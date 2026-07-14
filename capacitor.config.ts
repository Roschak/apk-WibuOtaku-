import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.wibuotaku.app',
    appName: 'WibuOtaku',
    webDir: 'out',
    server: {
        androidScheme: 'https',
    },
};

export default config;
