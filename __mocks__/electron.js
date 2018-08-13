module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: jest.fn(),
  remote: jest.fn(),
  dialog: jest.fn(),
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn()
  }
};

jest.mock('electron-settings');
