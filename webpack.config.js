const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const libraryName = 'reqres-client';

module.exports = (env = {}) => ({
  entry: __dirname + '/src/index.ts',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/web',
    filename: (() => {
      if (env.build) {
        return libraryName + '.min.js';
      }
      return libraryName + '.js';
    })(),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'ts-loader',
        options: { transpileOnly: true },
        exclude: /node_modules/
      },
      {
        test: /(\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [ path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.ts', '.js']
  },
  plugins: (() => {
    if (env.build) {
      return [new UglifyJsPlugin({ sourceMap: true })];
    }
    return [];
  })()
});
