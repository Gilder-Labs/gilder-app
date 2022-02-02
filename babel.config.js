module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};

// This is to add drawer animation but screws debugging
//    plugins: ["react-native-reanimated/plugin"],
