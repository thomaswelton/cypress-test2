/* eslint-disable */
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

const defaults = webpackPreprocessor.defaultOptions;

module.exports = (on, config) => {
  delete defaults.webpackOptions.module.rules[0].use[0].options.presets;
  on("file:preprocessor", webpackPreprocessor(defaults));

  addMatchImageSnapshotPlugin(on, config);

  on('before:browser:launch', (browser = {}, launchOptions) => {
    launchOptions.args.push('--window-size=1920,1080');
    return launchOptions;
  });

  return config;
};
