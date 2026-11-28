import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
          if (id.includes('allExercisesMaster')) return 'exercises-master';
          if (id.includes('massiveFoodDatabase')) return 'food-master';
          if (id.includes('healthBlogCatalog') || id.includes('src/data/blog')) return 'blog-catalog';
        },
      },
    },
  },
});
