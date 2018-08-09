/* eslint no-console: 0 */
const isDev = process.env.NODE_ENV === 'development';
const isMacOS = process.platform === 'darwin';
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const settings = require('electron-settings');

// main helpers
const helpers = require('./main/helpers');

helpers.initSentry();

require('dotenv').config({ path: path.join(app.getAppPath(), '..', '.env') });
require('./oauth2');

if (isDev) {
  require('electron-reload')(__dirname);
  require('electron-debug')();
}

let mainWindow;
let splashWindow;

const createWindow = () => {
  if (isDev) {
    helpers.setBadge('DEV');
    helpers.installDevToolsExtentions();
  } else {
    helpers.setBadge('BETA');
  }

  splashWindow = new BrowserWindow({
    width: 484,
    height: 272,
    backgroundColor: settings.get('color', '#3F84A8'),
    frame: false,
    alwaysOnTop: true,
    'web-preferences': {
      'web-security': false
    }
  });
  splashWindow.loadURL(`file://${__dirname}/loading.html`);

  setTimeout(() => {
    mainWindow = new BrowserWindow({
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

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
      splashWindow.destroy();
      mainWindow.show();

      helpers.buildMenu(mainWindow);
      helpers.updateChecker(mainWindow);
    });

    ipcMain.on('checkForUpdate', () => helpers.handleMacOSUpdates(mainWindow));

    helpers.handleNavigate(mainWindow);
    helpers.handleDownload(mainWindow);

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }, 300);
};

ipcMain.on('checkForUpdate', () => helpers.handleMacOSUpdates(mainWindow));

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (!isMacOS) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
