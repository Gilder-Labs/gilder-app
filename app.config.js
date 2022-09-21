import "dotenv/config";

export default {
  expo: {
    name: "Gilder",
    slug: "gilder-app",
    version: "1.0.51",
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
      buildNumber: "20",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/DarkIconAndroid.png",
        backgroundColor: "#000000",
      },
      versionCode: 20,
      googleServicesFile: "./google-services.json",
      package: "com.dawggydawg.gilderapp",
    },
    androidNavigationBar: {
      /*
       Configure the navigation bar icons to have light or dark color.
       Valid values: "light-content", "dark-content".
     */
      barStyle: "light-content",
      /*
       Configuration for android navigation bar.
       6 character long hex color string, eg: "#000000"
     */
      backgroundColor: "#131313",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      // Add your extra configs here
      rpcNetwork: process.env.MAINNET_RPC || "https://ssc-dao.genesysgo.net/",
      heavyRPC: process.env.HEAVY_RPC || "https://ssc-dao.genesysgo.net/",
      streamApiKey: process.env.STREAM_API_KEY,
      heliusApiKey: process.env.HELIUS_API_KEY,
      eas: {
        projectId: "d43ad13f-8eb8-4f37-9f5b-dca8e8f129c1",
      },
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
