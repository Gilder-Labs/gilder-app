import "dotenv/config";

export default {
  expo: {
    name: "Gilder",
    slug: "gilder-app",
    version: "1.0.7",
    orientation: "portrait",
    icon: "./assets/images/DarkIcon.png",
    scheme: "gilder",
    userInterfaceStyle: "automatic",
    plugins: ["sentry-expo"],
    splash: {
      image: "./assets/images/GilderSplash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    owner: "gilder",
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*", "assets/images/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dawggydawg.gilderapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.dawggydawg.gilderapp",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      // Add your extra configs here
      rpcNetwork: process.env.MAINNET_RPC || "https://ssc-dao.genesysgo.net/",
    },
    sdkVersion: "44.0.0",
  },
  name: "gilder-app",
};
