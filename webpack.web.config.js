const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const WorkboxPlugin  = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/web`
  },
  devtool: 'source-map',
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
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
              localIdentName: '[name]_[local]_[hash:base64]'
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
    new MonacoWebpackPlugin(),
    new webpack.IgnorePlugin(
      new RegExp(/^(fs|ipc|shell|electron-google-analytics|@sentry\/electron)$/)
    ),
    new HtmlWebPackPlugin({
      title: 'Gisto',
      favicon: './build/icon.png',
      template: './src/index-web.html',
      filename: './index.html',
      hash: true
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    }),
    new webpack.DefinePlugin({
      'process.browser': true
    }),
    new CopyWebpackPlugin([
      { from: 'src/icons', to: 'src/icons' },
      { from: 'node_modules/leaflet/dist/images', to: 'src/img' }
    ]),
    new WorkboxPlugin.GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      include: [/\.html$/, /\.js$/, /\.svg$/, /\.jpg$/, /\.gif$/, /\.png$/, /\.css$/],
      offlineGoogleAnalytics: true,
      runtimeCaching: [{
        urlPattern: new RegExp('^https://api.github.com/'),
        handler: 'staleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]
    })
  ],
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
    child_process: 'empty'
  },
  target: 'web'
};
