const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: () => ({
      transform: {
        ...defaultConfig.transformer.transform,
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  resolver: {
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      "cjs",
      "js",
      "ts",
      "tsx",
      "jsx",
      "svg",
    ],
    extraNodeModules: require("expo-crypto-polyfills"),
  },
};

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
