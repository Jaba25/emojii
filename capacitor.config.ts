import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jaba.emojigame',
  appName: 'Georgian Emoji Movies',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    minWebViewVersion: 70,
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#667eea",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#667eea'
    }
  }
};

export default config;
