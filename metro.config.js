const { getDefaultConfig } = require("@expo/metro-config");

// const defaultConfig = getDefaultConfig(__dirname);

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      sourceExts: [...sourceExts, "cjs"],
      extraNodeModules: require("expo-crypto-polyfills"),
    },
  };
})();

// module.exports = {
//   ...defaultConfig,
//   resolver: {
//     ...defaultConfig.resolver,
//     sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
//     extraNodeModules: require("expo-crypto-polyfills"),
//   },
// };
