const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const babel = require('../babel.config');

/**
 * Constants
 */
const DEFAULT_ENV = 'development';
const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_HELPDESK_URL = 'https://help-dev.alacritylaw.com';
const GOOGLE_META_TAG_NAME = 'google-signin-client_id';

const DEFAULT_POLYFILLS = [
  'default',
  'Array.prototype.find',
  'Intl',
  'Intl.DateTimeFormat.~locale.fr',
  'URLSearchParams',
];

// additional polyfills for hot-loader to work in IE11.
const DEV_POLYFILLS = [...DEFAULT_POLYFILLS, 'EventSource'];

// node modules that have syntax unsupported by IE11 and must be transpiled by Babel
const NODE_MODULES_TO_TRANSPILE = [
  'date-fns-tz',
  'intl-messageformat',
  'intl-messageformat-parser',
  'react-intl',
  'stickybits',
];

/**
 * Paths
 */
const PATHS = {
  dist: path.resolve(__dirname, `../dist/${process.env.ROOT_DIR}`),
  src: path.resolve(__dirname, `../packages/${process.env.ROOT_DIR}/index.js`),
  core: path.resolve(__dirname, '../packages/shared/core'),
  static: path.resolve(__dirname, '../packages/shared/static'),
  public: process.env.CDN_URL ? `${process.env.CDN_URL}/` : '/',
};

/**
 * Helpers
 */
const META_TAGS = {
  [GOOGLE_META_TAG_NAME]: process.env.GOOGLE_SIGNIN_CLIENT_ID,
};

const excludeNodeModulesExcept = (modules) => {
  let pathSep = path.sep;
  if (pathSep === '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\';
  }
  const moduleRegExps = modules.map((modName) => new RegExp(`node_modules${pathSep}${modName}`));

  return (modulePath) => {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i += 1) {
        if (moduleRegExps[i].test(modulePath)) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
};

/**
 * Webpack shared config
 */
module.exports = {
  entry: PATHS.src,
  output: {
    path: PATHS.dist,
    publicPath: PATHS.public,
    crossOriginLoading: 'anonymous',
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[name].[contenthash].js.map',
  },
  resolve: {
    alias: {
      '@alacrity': path.resolve(__dirname, '../packages'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: excludeNodeModulesExcept(NODE_MODULES_TO_TRANSPILE),
        use: { loader: 'babel-loader', options: babel() },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|gif|png|jpe?g|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // General vars
        VERSION: JSON.stringify(process.env.CIRCLE_SHA1),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || DEFAULT_ENV),
        API_URL: JSON.stringify(process.env.API_URL || DEFAULT_API_URL),
        // Intercom vars
        HELPDESK_URL: JSON.stringify(process.env.HELPDESK_URL || DEFAULT_HELPDESK_URL),
        INTERCOM_URL: JSON.stringify(process.env.INTERCOM_URL || null),
        // Sentry vars
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        SENTRY_ORG: JSON.stringify(process.env.SENTRY_ORG),
        SENTRY_PROJECT: JSON.stringify(process.env.SENTRY_PROJECT),
        SENTRY_AUTH_TOKEN: JSON.stringify(process.env.SENTRY_AUTH_TOKEN),
        // Google vars
        GOOGLE_SIGNIN_CLIENT_ID: JSON.stringify(process.env.GOOGLE_SIGNIN_CLIENT_ID || null),
        GOOGLE_ANALYTICS_TRACKING_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_ID || null),
      },
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.core}/index.html`,
      includeGoogleSso: process.env.ROOT_DIR === 'oasis',
      meta: process.env.GOOGLE_SIGNIN_CLIENT_ID ? META_TAGS : {},
      prePolyfillFeatures: ['Intl.PluralRules', 'Intl.PluralRules.~locale.fr'],
      polyfillFeatures: (process.env.NODE_ENV === DEFAULT_ENV ? DEV_POLYFILLS : DEFAULT_POLYFILLS).join(','),
    })
  ],
};
