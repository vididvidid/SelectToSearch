import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is your shared configuration
export default defineConfig({
  plugins: [react()],
  // Any other options shared between website and extension
});