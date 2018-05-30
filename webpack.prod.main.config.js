const webpack = require('webpack');
const path = require('path');

const buildPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: ['babel-polyfill', './src/electron/main.js'],
  output: {
    filename: 'main.js',
    path: buildPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    })
  ],
  target: 'electron-main'
};
