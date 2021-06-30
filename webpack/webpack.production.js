const { merge } = require('webpack-merge');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const SourceIntegrityPlugin = require('webpack-subresource-integrity');

const config = require('./webpack.shared.js');

/**
 * Paths
 */
const PATHS = {
  dist: './dist/app',
  i18n: '../packages/shared/copy',
  static: '../packages/shared/static',
};

/**
 * Webpack config for "PRODUCTION" env
 */
module.exports = merge(config, {
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [
    new SentryCliPlugin({
      include: PATHS.dist,
      release: process.env.CIRCLE_SHA1,
      ignore: ['node_modules', PATHS.static, PATHS.i18n],
    }),
    new SourceIntegrityPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: !process.env.SKIP_SRI,
    }),
  ],
});
