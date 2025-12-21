
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures process.env.API_KEY is available to the Gemini SDK
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disables source maps to hide original source code in production
    minify: 'terser', // High-level minification
    terserOptions: {
      compress: {
        drop_console: true, // Strips all console.log for "source code hide" effect
        drop_debugger: true
      }
    }
  }
});
