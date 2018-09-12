const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: `${__dirname}/web`,
    filename: 'bundle.js',
    pathinfo: true,
    chunkFilename: 'static/js/[name].chunk.js'
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ],
    splitChunks: {
      chunks: 'async',
      name: 'vendors'
    },
    runtimeChunk: true
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
  plugins: [
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
