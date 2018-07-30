const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'src/fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'src/img/[name].[ext]'
          }
        }
      },
      {
        test: /\.(svg)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            name: 'src/icons/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'global.GENTLY': false,
      'process.browser': true
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    }),
    new MonacoWebpackPlugin(),
    new CopyWebpackPlugin([
      'build/icon.ico',
      'build/icon.png',
      'package.json',
      { from: 'src/electron/main.js', to: 'main.js' },
      { from: 'src/electron/oauth2.js', to: 'oauth2.js' },
      { from: 'src/electron/updater.js', to: 'updater.js' },
      { from: 'src/icons', to: 'src/icons' }
    ])
  ],
  target: 'electron-renderer'
};
