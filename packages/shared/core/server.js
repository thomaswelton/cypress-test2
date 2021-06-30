// @flow
/* eslint-disable no-console */
const history = require('connect-history-api-fallback');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../../../webpack/webpack.development');

/**
 * Constants
 */
const DEFAULT_PORT = 3050;

/**
 * APP setup
 */
const app = express();
const compiler = webpack(config);
const hotMiddleware = webpackHotMiddleware(compiler);
const devMiddleware = webpackDevMiddleware(compiler, { publicPath: config.output.publicPath });

// apply middlewares
app.use(history());
app.use(devMiddleware);
app.use(hotMiddleware);

// Set app globals
app.set('port', process.env.PORT || DEFAULT_PORT);

// Start app
app.listen(app.get('port'), (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log(`🚨 Server started at: http://localhost:${app.get('port')}`);
  }
});
