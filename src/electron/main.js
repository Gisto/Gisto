import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REACT_PERF, REDUX_DEVTOOLS } from 'electron-devtools-installer';

let mainWindow;

// if (process.env.NODE_ENV === 'development') {
//   require('electron-reload')(__dirname);
// }

const installExtensions = async () => installExtension([
  REACT_DEVELOPER_TOOLS.id,
  REACT_PERF.id,
  REDUX_DEVTOOLS.id
])
  .then((name) => console.log(`Added Extension:  ${name}`)) // eslint-disable-line no-console
  .catch((err) => console.log('An error occurred: ', err)); // eslint-disable-line no-console

const newWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);

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
