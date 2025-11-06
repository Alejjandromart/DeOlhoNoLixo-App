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
      image: "app/assets/images/DeOlhoIcon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      config: {
            googleSignIn: {
                clientId: "125992023674-3kusk6p4nc0mimnc39gd03kqf5ha5qrn.apps.googleusercontent.com"
            }
        },

      adaptiveIcon: {
        foregroundImage: "app/assets/images/DeOlhoIcon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.deolho.app"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "app/assets/images/DeOlhoIcon.png"
    },
    plugins: [
      "expo-router",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
  // ...existing code...
      eas: {
        projectId: "d80d11f6-aaac-48b6-a1be-83033f23b782"
      }
      
    },
  },
};
