var path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: path.resolve(__dirname, 'chatbotinterface/index.js'),
    plugins: [
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env), // Inject all environment variables
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.SOCKET_SERVER_URL': JSON.stringify(process.env.SOCKET_SERVER_URL || 'http://localhost:6000'),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    target: process.env.NODE_ENV === 'development' ? 'web' : 'node',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js',
      libraryTarget: process.env.NODE_ENV === 'development' ? 'umd' : 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.tsx?|\.jsx?|\.js?|\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.svg$/,
          loader: 'react-svg-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: isDevelopment ? 'asset/resource' : 'asset',
          generator: {
            filename: isDevelopment ? '[path][name][ext]' : 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.jsx', '.js', '.ts'],
      alias: {
        '@assets': path.resolve(__dirname, 'assets'),
      },
    },
    externals: process.env.NODE_ENV === 'development' 
      ? [] 
      : ['react', nodeExternals()],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
        },
        {
          directory: path.join(__dirname, 'assets'),
          publicPath: '/assets'
        }
      ],
      hot: true,
    },
  };
};
