const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  const preferredKeywords = ['wi-fi', 'wifi', 'ethernet', 'en', 'wlan'];
  
  // 1. Tentar interfaces físicas preferidas
  for (const interfaceName in interfaces) {
    const isPreferred = preferredKeywords.some(keyword => 
      interfaceName.toLowerCase().includes(keyword)
    );
    if (isPreferred) {
      for (const iface of interfaces[interfaceName]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  // 2. Tentar qualquer interface física (ignorando VMs conhecidas)
  for (const interfaceName in interfaces) {
    if (
      interfaceName.toLowerCase().includes('virtual') || 
      interfaceName.toLowerCase().includes('vbox') || 
      interfaceName.toLowerCase().includes('vmware') || 
      interfaceName.toLowerCase().includes('wsl')
    ) {
      continue;
    }
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  // 3. Fallback final
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIpAddress();

module.exports = {
  expo: {
    name: "DeOlho",
    slug: "DeOlho",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/images/DeOlhoIcon.png",
    scheme: "deolhoapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    splash: {
      image: "./app/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      // googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/images/DeOlhoIcon.png",
        backgroundColor: "#ffffff"
      },
      package: "deolho.nolixo"
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./app/assets/images/DeOlhoIcon.png"
    },
    plugins: [
      "expo-web-browser",
      "expo-font",
      "expo-audio",
      "expo-secure-store",
      "expo-status-bar",
      "expo-video",
      "expo-asset",
      "expo-splash-screen",
      [
        "expo-camera",
        {
          "cameraPermission": "O DeOlho precisa da câmera para fotografar denúncias."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "O DeOlho usa sua localização para registrar o local da denúncia."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "O DeOlho acessa sua galeria para anexar fotos às denúncias."
        }
      ]
    ],
    extra: {
      backendUrl: process.env.BACKEND_URL || `http://${localIp}:8000`,
      backendApiKey: process.env.BACKEND_API_KEY || '287e60096af7564e10abab86e726dcca6217b2c52de91a423ef923947d2374df',
      eas: {
        projectId: "d80d11f6-aaac-48b6-a1be-83033f23b782"
      }
    },
  },
};
