const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

let win;

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
      "web-preferences": {
        "web-security": false
      }
    });

    win.loadURL(url.format({
      pathname: 'index.html',
      protocol: 'file:',
      slashes: true
    }));

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
