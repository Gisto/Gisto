const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const WorkboxPlugin  = require('workbox-webpack-plugin');

const packageJson = require('./package.json');

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
    extensions: ['.js', '.jsx', '.json']
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
  devServer: {
    contentBase: path.join(__dirname, 'web'),
    port: 8080
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new webpack.IgnorePlugin(
      new RegExp(/^(fs|ipc|shell|electron-google-analytics|@sentry\/electron)$/)
    ),
    new HtmlWebPackPlugin({
      title: `Gisto v${packageJson.version}`,
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
      'service-worker-sync.js',
      { from: 'src/icons', to: 'src/icons' }
    ]),
    new WorkboxPlugin.GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      globIgnores: [
        '**/node_modules/**/*',
        'service-worker.js',
        'service-worker-sync.js'
      ],
      include: [/\.html$/, /\.js$/, /\.svg$/, /\.jpg$/, /\.gif$/, /\.png$/, /\.css$/],
      exclude: [/\.service-worker-sync\.js$/],
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
    __filename: false
  },
  target: 'web'
};
