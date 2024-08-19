/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'geoserver-rest',
      fileName: 'geoserver-rest'
    }
  },
  server: {
    host: "127.0.0.1",
    open: true,
    proxy: {
      "/geoserver": {
        target: "http://192.168.0.110:8082/geoserver",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, "/"),
      }
    },
  },
  test: {
    // environment: 'jsdom',
  },
  plugins: [dts()]
})
