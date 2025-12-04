module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@features': './src/features',
          '@shared': './src/shared',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@context': './src/context',
          '@core': './src/core',
        },
      },
    ],
  ],
};
