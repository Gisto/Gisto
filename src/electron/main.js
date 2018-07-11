/* eslint no-console: 0 */

const {
  app, BrowserWindow, Menu, shell
} = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development';

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
        click: (menuItem, focusedWindow, event) => require('./updater').checkForUpdates(menuItem, focusedWindow, event)
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
  win.webContents.send('message', text, info);
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
    width: 484, height: 272, transparent: true, frame: false, alwaysOnTop: true
  });
  splash.loadURL('https://www.letsbackflip.com/wp-content/uploads/2012/11/tennant-buffer.gif');

  setTimeout(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 700,
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

    if (isDev) {
      win.webContents.openDevTools();
    }

    win.on('closed', () => {
      win = null;
    });
  }, 300);
};

app.on('ready', createWindow);

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.', info);
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.', info);
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow(`Error in auto-updater. ${err}`);
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
