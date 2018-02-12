const { app, BrowserWindow, protocol, electron } = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(__dirname);

let win;

const createWindow = () => {

  app.dock.setBadge('DEV');

  setTimeout(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 700,
      title: 'dev ' + app.getVersion(),
      icon: 'http://localhost:4200/favicon.ico',
      "web-preferences": {
        "web-security": false
      }
    });

    // and load the app.
    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

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
