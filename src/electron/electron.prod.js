const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
require('./oauth2');

let win;
let splash;

const createWindow = () => {
  protocol.interceptFileProtocol('file', function(req, callback) {
    var url = req.url.substr(7);
    callback({path: path.normalize(__dirname + url)});
  },function (error) {
    if (error) {
      console.error('Failed to register protocol');
    }
  });

  setTimeout(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 700,
      icon: path.join(__dirname, 'favicon.ico'),
      show: false,
      "web-preferences": {
        "web-security": false
      }
    });

    splash = new BrowserWindow({width: 484, height: 272, transparent: true, frame: false, alwaysOnTop: true});
    splash.loadURL(`https://www.letsbackflip.com/wp-content/uploads/2012/11/tennant-buffer.gif`);

    win.loadURL(url.format({
      pathname: 'index.html',
      protocol: 'file:',
      slashes: true
    }));

    win.once('ready-to-show', () => {
      splash.destroy();
      win.show();
    });

    win.on('closed', () => {
      win = null;
    });
  }, 0);
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
