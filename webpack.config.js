const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const SizePlugin = require('size-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const packageJson = require('./package.json');

function srcPath(subdir) {
  return path.join(__dirname, 'src', subdir);
}
const buildPath = path.resolve(__dirname, './dist');

const isDev = process.env.NODE_ENV === 'development';
const copyPaths = [
  'build/icon.ico',
  '.env',
  'build/icon.png',
  'package.json',
  { from: 'src/electron/icon/Icon-512x512.png', to: 'icon/Icon-512x512.png' },
  { from: 'src/electron/main.js', to: 'main.js' },
  { from: 'src/electron/main', to: 'main' },
  { from: 'src/electron/oauth2.js', to: 'oauth2.js' },
  { from: 'src/electron/updater.js', to: 'updater.js' },
  { from: 'src/icons', to: 'src/icons' },
  { from: 'node_modules/leaflet/dist/images', to: 'src/img' }
];

if (isDev) {
  copyPaths.push({ from: 'test/dev-app-update.yml', to: 'dev-app-update.yml' });
}

const config = {
  entry: './src/index.js',
  output: {
    path: buildPath,
    filename: 'renderer.js'
  },
  bail: true,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      components: srcPath('components'),
      utils: srcPath('utils'),
      store: srcPath('store')
    }
  },
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
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
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
    // new BundleAnalyzerPlugin(),
    new SizePlugin(),
    new webpack.DefinePlugin({
      'global.GENTLY': false,
      'process.browser': true
    }),
    new HtmlWebPackPlugin({
      title: 'Gisto',
      favicon: './build/icon.png',
      template: './src/index.html',
      filename: './index.html'
    }),
    new HtmlWebPackPlugin({
      version: packageJson.version,
      template: './src/loading.html',
      filename: './loading.html',
      inject: false
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDev ? 'development' : 'production',
      DEBUG: isDev
    }),
    new MonacoWebpackPlugin(),
    new CopyWebpackPlugin(copyPaths)
  ],
  target: 'electron-renderer'
};

module.exports = config;
