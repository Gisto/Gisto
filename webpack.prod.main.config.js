const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ],
  target: 'electron-main',
  node: {
    __dirname: false
  }
};
