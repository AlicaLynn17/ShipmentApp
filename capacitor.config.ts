import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ShipmentApp',
  webDir: 'www',
  plugins: {
    BarcodeScanner: {
      enableCameraPermission: true, // Enable camera permission for BarcodeScanner
    },
  },
};

export default config;
