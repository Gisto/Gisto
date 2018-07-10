const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      store: path.resolve(__dirname, './src/store'),
      selectors: path.resolve(__dirname, './src/selectors'),
      components: path.resolve(__dirname, './src/components'),
      assets: path.resolve(__dirname, './src/assets'),
      reducers: path.resolve(__dirname, './src/reducers'),
      middlewares: path.resolve(__dirname, './src/middlewares'),
      constants: path.resolve(__dirname, './src/constants'),
      utils: path.resolve(__dirname, './src/utils'),
      icons: path.resolve(__dirname, './src/iconsMap')
    }
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
        test: /\.(svg)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            name: 'src/iconst/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'global.GENTLY': false
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
