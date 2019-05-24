/* eslint no-console: 0 */
const isDev = process.env.NODE_ENV === 'development';
const isMacOS = process.platform === 'darwin';
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const settings = require('electron-settings');
const { argv } = require('yargs');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

app.setAppUserModelId('com.gistoapp.gisto2');
app.setAsDefaultProtocolClient('gisto');

app.setAppUserModelId('com.gistoapp.gisto2');
app.setAsDefaultProtocolClient('gisto');

// main helpers
const helpers = require('./main/helpers');

helpers.initSentry();

let mainWindow;

let splashWindow;

let envPath = path.join(app.getAppPath(), '.env');

if (isDev) {
  envPath = path.join(app.getAppPath(), '..', '.env');
}

require('dotenv').config({ path: envPath });
require('./oauth2');

if (isDev) {
  require('electron-reload')(__dirname);
  require('electron-debug')();
}

const createWindow = () => {
  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

  if (isDev) {
    helpers.setBadge('DEV');
    setTimeout(() => helpers.setBadge(app.getVersion()), 8000);
    helpers.installDevToolsExtentions();
  } else {
    helpers.setBadge(app.getVersion());
    setTimeout(() => helpers.setBadge(''), 8000);
  }

  const backgroundColor = settings.get('color', '#3F84A8');

  splashWindow = new BrowserWindow({
    width: 484,
    height: 272,
    backgroundColor,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, '/icon/Icon-512x512.png')
  });
  splashWindow.loadURL(`file://${__dirname}/loading.html`);

  setTimeout(() => {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 700,
      backgroundColor,
      title: isDev ? `dev ${app.getVersion()}` : `Gisto v${app.getVersion()}`,
      webPreferences: {
        nodeIntegration: true
      },
      show: false,
      icon: path.join(__dirname, '/icon/Icon-512x512.png')
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
      splashWindow.destroy();
      mainWindow.show();

      helpers.buildMenu(mainWindow);
      helpers.handleCmdFlags(mainWindow, argv);
    });

    if (isMacOS) {
      ipcMain.on('checkForUpdate', () => helpers.handleMacOSUpdates(mainWindow));
    } else {
      helpers.updateChecker(mainWindow, ipcMain);
    }

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
