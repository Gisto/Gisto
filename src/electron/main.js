import path from 'path';
import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REACT_PERF, REDUX_DEVTOOLS } from 'electron-devtools-installer';

let mainWindow;

console.log('\x1b[37m\x1b[41m', 'LOG ', '\x1b[0m', process.env.NODE_ENV);

// if (process.env.NODE_ENV === 'development') {
//   require('electron-reload')(__dirname);
// }

const installExtensions = async () => installExtension([
  REACT_DEVELOPER_TOOLS.id,
  REACT_PERF.id,
  REDUX_DEVTOOLS.id
])
  .then((name) => console.info(`Added Extension:  ${name}`)) // eslint-disable-line no-console
  .catch((err) => console.error('An error occurred: ', err)); // eslint-disable-line no-console

const newWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico')
  });

  setTimeout(() => mainWindow.loadURL(`file://${__dirname}/index.html`), 300);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  await newWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    await newWindow();
  }
});
