const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const baseConfig = require('./webpack.base.config');

const buildPath = path.resolve(__dirname, './dist');

const config = merge.smart(baseConfig, {
  entry: './src/index.js',
  output: {
    filename: 'renderer.js',
    path: buildPath
  },
  devtool: 'inline-source-map',
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
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64]',
              sourceMap: true,
              minimize: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    })
  ]
});

module.exports = config;
