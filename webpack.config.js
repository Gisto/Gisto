const config = [];

if (process.env.NODE_ENV === 'production') {
  config.push(require('./webpack.prod.renderer.config.js'));
} else {
  config.push(require('./webpack.dev.renderer.config.js'));
}

module.exports = config;
