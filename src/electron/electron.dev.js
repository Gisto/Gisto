const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
require('./oauth2');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

require('electron-reload')(__dirname);

let win;
let splash;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let template = [];
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
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
      },
    ]
  })
}

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

const createWindow = () => {

  app.dock.setBadge('DEV');

  setTimeout(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 700,
      title: 'dev ' + app.getVersion(),
      icon: 'http://localhost:4200/favicon.ico',
      'node-integration': true,
      show: false,
      "web-preferences": {
        "web-security": false
      }
    });

    splash = new BrowserWindow({width: 484, height: 272, transparent: true, frame: false, alwaysOnTop: true});
    splash.loadURL(`https://www.letsbackflip.com/wp-content/uploads/2012/11/tennant-buffer.gif`);

    // and load the app.
    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

    win.once('ready-to-show', () => {
      splash.destroy();
      win.show();

      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);

      autoUpdater.checkForUpdates();
    });

    win.webContents.openDevTools();

    win.on('closed', () => {
      win = null;
    });
  }, 10000);
};

app.on('ready', createWindow);

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
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
