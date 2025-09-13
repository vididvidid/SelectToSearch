import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // The extension build only needs the React plugin
    react(),
  ],

  // Point to the public folder containing manifest.json and background.js
  publicDir: 'public_extension',

  build: {
    // Output to a different folder to keep builds separate
    outDir: 'extension',
    // It's a good practice to ensure the output directory is clean
    emptyOutDir: true,
  },
});
