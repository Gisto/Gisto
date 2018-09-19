jest.mock('electron-settings', () => ({
  get: () => 'red',
  set: () => 'blue',
  getAll: () => {}
}));
