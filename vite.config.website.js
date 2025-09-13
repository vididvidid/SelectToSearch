import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [
    // Standard React plugin
    react(),
    // Cloudflare plugin for building the worker
    cloudflare(),
  ],

  // Specify the public directory for the website
  publicDir: 'public_website',

  build: {
    // Define the output directory for the build artifacts
    outDir: 'dist',
  },
});
