import "dotenv/config";

export default {
  expo: {
    name: "Gilder",
    slug: "gilder-app",
    version: "1.0.17",
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
      indexRPC: process.env.INDEX_RPC || "https://ssc-dao.genesysgo.net/",
      streamApiKey: process.env.STREAM_API_KEY,
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "gilder",
            project: "gilder",
            authToken: process.env.SENTRY_API_TOKEN,
          },
        },
      ],
    },
  },
  name: "gilder-app",
};
