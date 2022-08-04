const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  getTransformOptions: () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.resolver = {
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [
    ...config.resolver.sourceExts,
    "cjs",
    "js",
    "ts",
    "tsx",
    "jsx",
    "svg",
  ],
  extraNodeModules: require("expo-crypto-polyfills"),
};

module.exports = config;

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);
//   return {
//     ...defaultConfig,
//     transformer: {
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: true,
//         },
//       }),
//     },
//     resolver: {
//       sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
//       extraNodeModules: require("expo-crypto-polyfills"),
//     },
//   };
// })();

// module.exports = {
//   ...defaultConfig,
//   resolver: {
//     ...defaultConfig.resolver,
//     sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
//     extraNodeModules: require("expo-crypto-polyfills"),
//   },
// };
