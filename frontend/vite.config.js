import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    const normalizedId = id.replace(/\\/g, '/')
    if (!/\/src\/.*\.js$/.test(normalizedId)) return null
    return transformWithOxc(code, id, { lang: 'jsx' })
  },
})

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    transformJsxInJs(),
    react({
      include: /\.(jsx|js|tsx|ts)$/,
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    entries: [path.resolve(import.meta.dirname, 'index.html')],
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 5173,
    fs: {
      deny: ['**/build/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@services': path.resolve(import.meta.dirname, './src/services'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts';
          if (id.includes('framer-motion') || id.includes('react-icons')) return 'ui';
          if (
            id.includes('react-dom')
            || id.includes('react-router-dom')
            || id.includes('/react/')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
