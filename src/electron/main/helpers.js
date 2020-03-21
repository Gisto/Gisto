/* eslint no-console: 0 */
const { shell, app, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { init } = require('@sentry/electron');
const { includes, startsWith, head } = require('lodash/fp');

const isMacOS = process.platform === 'darwin';
const packageJson = require('../package');

function initSentry() {
  init({
    dsn: 'https://9b448264479b47418f9e248c208632ae@sentry.io/1245680',
    release: app.getVersion(),
    environment: process.env.NODE_ENV
  });
}

function installDevToolsExtentions() {
  if (isMacOS) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      REACT_PERF
    } = require('electron-devtools-installer');

    installExtension([REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id, REACT_PERF.id])
      .then((extensionName) => console.log(`Added Extension:  ${extensionName}`))
      .catch((err) => console.log('An error occurred: ', err));

    console.log('\x1b[37m\x1b[41m', 'LOG ', '\x1b[0m', process.env.NODE_ENV);
  }
}

function sendStatusToWindow(text, info, targetWindow, channel = 'update-info') {
  targetWindow.webContents.send(channel, text, info);
}

function handleDownload(win) {
  win.webContents.session.on('will-download', (event, item, sender) => {
    const isUpdateUrl = includes(
      ['https://github.com/Gisto/Gisto/releases/download/'],
      head(item.getURLChain())
    );

    if (isUpdateUrl) {
      item.on('updated', (updateEvent, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            sender.send('update-info', 'Download paused');
          } else {
            const downloaded = item.getReceivedBytes() / 1048576;
            const total = item.getTotalBytes() / 1048576;

            sender.send('download-progress', null, {
              progress: { percent: (downloaded / total) * 100 }
            });
          }
        }
      });
      item.once('done', (doneEvent, state) => {
        if (state === 'completed') {
          sender.send('update-downloaded', 'New version downloaded, quit and run installer?', {
            success: true,
            path: item.getSavePath()
          });
        } else {
          sender.send('update-downloaded', null, { success: false });
        }
      });
    }
  });
}

function handleNavigate(win) {
  // Handled URL opening in default browser
  win.webContents.on('will-navigate', (event, url) => {
    const isUpdateUrl = includes(['https://github.com/Gisto/Gisto/releases/download/'], url);
    const isFileProtocol = startsWith('file:', url);

    if (isUpdateUrl || isFileProtocol) {
      return false;
    }

    event.preventDefault();
    shell.openExternal(url);

    return true;
  });
}

function setBadge(badge) {
  if (isMacOS) {
    app.dock.setBadge(badge);
  }
}

function buildMenu(mainWindow) {
  const template = [];
  const name = app.getName();

  template.unshift(
    {
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
          visible: !isMacOS
        },
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('routeTo', '/settings')
        },
        {
          label: 'Console',
          click: () => mainWindow.webContents.openDevTools(),
          visible: false
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.webContents.reload()
        },
        {
          label: 'Check for updates',
          click: () => {
            autoUpdater.autoDownload = false;
            autoUpdater.checkForUpdates();
          },
          visible: !isMacOS
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: `Learn More about ${name}`,
          click() {
            shell.openExternal('https://www.gistoapp.com');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://www.gistoapp.com/documentation/');
          }
        },
        {
          label: 'Announcements',
          click() {
            shell.openExternal('https://www.gistoapp.com/blog/');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/gisto/gisto/issues');
          }
        }
      ]
    }
  );

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function handleMacOSUpdates(mainWindow) {
  if (isMacOS) {
    const LATEST_RELEASED_VERSION_URL = 'https://api.github.com/repos/Gisto/Gisto/releases/latest';
    const request = require('superagent');
    const semver = require('semver');

    sendStatusToWindow('Gisto checking for new version...', {}, mainWindow, 'update-info');
    request
      .get(LATEST_RELEASED_VERSION_URL)
      .set(
        'User-Agent',
        `Gisto app v${packageJson.version} (https://www.gistoapp.com) Snippets made awesome`
      )
      .end((error, result) => {
        let shouldUpdate = false;

        if (result.body) {
          const serverVersion = result.body.name;
          const serverAssets = result.body.assets;

          if (serverVersion && packageJson.version) {
            shouldUpdate = semver.lt(packageJson.version, serverVersion);
          }

          if (shouldUpdate) {
            const dmgUrl = serverAssets.filter(
              (asset) => asset.name === `Gisto-${serverVersion}.dmg`
            );

            sendStatusToWindow(
              `Update from ${packageJson.version} to ${serverVersion} available`,
              { url: dmgUrl },
              mainWindow,
              'update-info'
            );
          } else {
            sendStatusToWindow('No updates available at the moment', {}, mainWindow, 'no-updates');
          }
        }
        if (error) {
          sendStatusToWindow(
            'No new version information at the moment',
            {},
            mainWindow,
            'update-info'
          );
        }
      });
  }
}

function updateChecker(mainWindow) {
  ipcMain.on('downloadUpdate', () => autoUpdater.downloadUpdate());
  ipcMain.on('quitAndInstall', () => autoUpdater.quitAndInstall(true, true));

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'debug';

  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow(
      `Update from ${packageJson.version} to ${info.version} available`,
      info,
      mainWindow,
      'update-available'
    );
  });

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow(
      'New version downloaded, quit and Install?',
      info,
      mainWindow,
      'update-downloaded'
    );
  });

  autoUpdater.on('download-progress', (progress, bytesPerSecond, percent, total, transferred) => {
    sendStatusToWindow(
      'Downloaded: ',
      {
        progress,
        bytesPerSecond,
        percent,
        total,
        transferred
      },
      mainWindow,
      'download-progress'
    );
  });
}

function handleCmdFlags(win, flags) {
  if (flags.token) {
    win.webContents.send('token', flags.token);
  }
}

module.exports = {
  initSentry,
  installDevToolsExtentions,
  handleDownload,
  handleNavigate,
  setBadge,
  buildMenu,
  updateChecker,
  handleMacOSUpdates,
  handleCmdFlags
};
