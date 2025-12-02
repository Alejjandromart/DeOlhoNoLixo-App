const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  expo: {
    name: "DeOlho",
    slug: "DeOlho",
    version: "1.0.0",
    orientation: "portrait",
    icon: "app/assets/images/DeOlhoIcon.png",
    scheme: "deolhoapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "app/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      // googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "app/assets/images/DeOlhoIcon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "DeOlho.NoLixo.app",
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "app/assets/images/DeOlhoIcon.png"
    },
    plugins: [
      "expo-router",
      "expo-web-browser",
      "expo-font",
      "@react-native-google-signin/google-signin",
      "expo-audio"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "d80d11f6-aaac-48b6-a1be-83033f23b782"
      }
    },
  },
};
