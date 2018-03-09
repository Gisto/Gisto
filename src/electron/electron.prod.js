const { app, BrowserWindow, protocol } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const path = require('path');
const url = require('url');
require('./oauth2');

let win;
let splash;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

sendStatusToWindow('App starting...');

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
                label: 'DevTools' + name,
                click() {
                    win.webContents.openDevTools();
                }
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() {
                    app.quit();
                }
            },
        ]
    })
}

const createWindow = () => {
  protocol.interceptFileProtocol('file', function(req, callback) {
    var newUrl = req.url.substr(7);
    callback({path: path.normalize(__dirname + newUrl)});
  },function (error) {
    if (error) {
      console.error('Failed to register protocol');
    }
  });

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

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
    autoUpdater.checkForUpdatesAndNotify();
  });

  win.on('closed', () => {
    win = null;
  });
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
})
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
