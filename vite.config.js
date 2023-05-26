import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'
export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin(
      {
        libs: [
          {
            libraryName: 'zarm',
            esModules: true,
            resolveStyle: (name) => {
              return `zarm/es/${name}/style/css`
            }
          }
        ]
      }
    )
  ],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://api.chennick.wang',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') 
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
      'utils': path.resolve(__dirname, 'src/utils'), 
      'config': path.resolve(__dirname, 'src/config') 
    }
  },
})