const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const buildPath = path.resolve(__dirname, './dist');

const config = merge.smart(baseConfig, {
  entry: './src/index.js',
  output: {
    filename: 'renderer.js',
    path: buildPath,
    pathinfo: true,
    chunkFilename: 'static/js/[name].chunk.js'
  },
  bail: true,
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'async',
      name: 'vendors'
    },
    runtimeChunk: true
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    })
  ]
});

module.exports = config;
