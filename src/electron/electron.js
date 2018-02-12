const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  require('./electron.dev');
} else {
  require('./electron.prod');
}
