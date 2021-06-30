module.exports = function babelConfig(api = null) {
  if (api) {
    api.cache(true);
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: '3.14',
          targets: { ie: '11', browsers: 'last 2 versions' },
          useBuiltIns: 'usage',
        },
      ],
      '@babel/preset-flow',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      'react-hot-loader/babel',
    ],
  };
};
