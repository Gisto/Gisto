const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const SizePlugin = require('size-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: `${__dirname}/web`,
    filename: 'bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  devtool: 'cheap-module-source-map',
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
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64]',
              minimize: true
            }
          }
        ]
      },
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
    new SizePlugin(),
    new HardSourceWebpackPlugin(),
    new MonacoWebpackPlugin(),
    new webpack.IgnorePlugin(new RegExp(/^(fs|ipc|shell|@sentry\/electron)$/)),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    }),
    new webpack.DefinePlugin({
      'process.browser': true
    }),
    new CopyWebpackPlugin([
      { from: 'src/icons', to: 'src/icons' }
    ])
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'web'
};
