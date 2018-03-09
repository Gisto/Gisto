const { app, BrowserWindow, protocol, electron, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
require('./oauth2');

require('electron-reload')(__dirname);

let win;
let splash;
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
    });

    win.webContents.openDevTools();

    win.on('closed', () => {
      win = null;
    });
  }, 10000);
};

app.on('ready', createWindow);

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
