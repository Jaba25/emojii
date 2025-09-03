import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@ionic/angular',
      '@ionic/core',
      '@ionic/core/loader'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 4200
  }
});
