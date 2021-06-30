const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const config = require('./webpack.shared.js');

/**
 * Paths
 */
const PATHS = {
  src: path.resolve(__dirname, `../packages/${process.env.ROOT_DIR}/index.js`),
};

/**
 * Webpack config for "DEVELOPMENT" env
 */
module.exports = merge(config, {
  devtool: 'eval-cheap-module-source-map',
  entry: ['webpack-hot-middleware/client', PATHS.src],
  mode: 'development',
  optimization: {
    emitOnErrors: false,
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
