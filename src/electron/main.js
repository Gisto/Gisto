/* eslint no-console: 0 */
const isDev = process.env.NODE_ENV === 'development';
const isMacOS = process.platform === 'darwin';
const { init } = require('@sentry/electron');
const {
  app, BrowserWindow, Menu, shell, ipcMain
} = require('electron');
const path = require('path');
const settings = require('electron-settings');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const packageJson = require('./package.json');

const LATEST_RELEASED_VERSION_URL = 'https://gisto-releases.s3.amazonaws.com/latest-mac.json';

init({
  dsn: 'https://9b448264479b47418f9e248c208632ae@sentry.io/1245680',
  release: app.getVersion(),
  environment: process.env.NODE_ENV
});

require('dotenv').config({ path: path.join(app.getAppPath(), '..', '.env') });
require('./oauth2');

if (isDev) {
  require('electron-reload')(__dirname);
  require('electron-debug')();
}

let win;
let splash;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

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
        submenu: []
      },
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => win.webContents.reload()
      },
      {
        label: 'Console',
        click: () => win.webContents.openDevTools()
      },
      {
        label: 'Check for updates',
        click: (menuItem, focusedWindow, event) => require('./updater').checkForUpdates(menuItem, focusedWindow, event),
        visible: !isMacOS
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
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
  }, {
    label: 'View',
    submenu: [{
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    }]
  }, {
    label: 'Help',
    submenu: [{
      label: `Learn More about ${name}`,
      click() {
        shell.openExternal('https://www.gistoapp.com');
      }
    }, {
      label: 'Documentation',
      click() {
        shell.openExternal('https://www.gistoapp.com/documentation/');
      }
    }, {
      label: 'Announcements',
      click() {
        shell.openExternal('https://www.gistoapp.com/blog/');
      }
    }, {
      label: 'Search Issues',
      click() {
        shell.openExternal('https://github.com/gisto/gisto/issues');
      }
    }]
  }
);

function sendStatusToWindow(text, info) {
  log.info(text);
  win.webContents.send('updateInfo', text, info);
}

const createWindow = () => {
  if (isDev) {
    app.dock.setBadge('DEV');
    const {
      default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF
    } = require('electron-devtools-installer');

    installExtension([REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id, REACT_PERF.id])
      .then((extensionName) => console.log(`Added Extension:  ${extensionName}`))
      .catch((err) => console.log('An error occurred: ', err));

    console.log('\x1b[37m\x1b[41m', 'LOG ', '\x1b[0m', process.env.NODE_ENV);
  }

  app.dock.setBadge('BETA');

  splash = new BrowserWindow({
    width: 484,
    height: 272,
    backgroundColor: settings.get('color', '#3F84A8'),
    frame: false,
    alwaysOnTop: true,
    'web-preferences': {
      'web-security': false
    }
  });
  splash.loadURL(`file://${__dirname}/loading.html`);

  setTimeout(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 700,
      backgroundColor: settings.get('color', '#3F84A8'),
      title: isDev ? `dev ${app.getVersion()}` : `Gisto v${app.getVersion()}`,
      'node-integration': true,
      show: false,
      'web-preferences': {
        'web-security': false
      }
    });

    win.loadURL(`file://${__dirname}/index.html`);

    win.once('ready-to-show', () => {
      splash.destroy();
      win.show();

      const menu = Menu.buildFromTemplate(template);

      Menu.setApplicationMenu(menu);

      autoUpdater.checkForUpdates();
    });

    // Handled URL opening in default browser
    win.webContents.on('will-navigate', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    if (isDev) {
      splash.webContents.openDevTools();
    }

    win.on('closed', () => {
      win = null;
    });
  }, 300);
};

app.on('ready', createWindow);

const handleMacOSUpdates = () => {
  if (isMacOS) {
    const request = require('superagent');
    const semver = require('semver');

    sendStatusToWindow('Gisto checking for new version...');

    request
      .get(LATEST_RELEASED_VERSION_URL)
      .end((error, result) => {
        if (result) {
          const shouldUpdate = semver.lt(packageJson.version, result.body.version);

          if (shouldUpdate) {
            sendStatusToWindow(`Update from ${packageJson.version} to ${result.body.version} available`, result.body);
          } else {
            sendStatusToWindow('No updates available at the moment');
          }
        }
        if (error) {
          sendStatusToWindow('No new version information at the moment');
        }
      });
  }
};

ipcMain.on('checkForUpdate', () => handleMacOSUpdates());

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available', info);
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('No updates available at the moment', info);
});

autoUpdater.on('error', (err) => {
  if (!isMacOS) {
    sendStatusToWindow(`Error in auto-updater ${err}`);
  } else {
    handleMacOSUpdates();
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;

  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded', info);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
