/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: ['./lib/geoserver-helper.ts', './lib/utils/utils.ts', './lib/wfs.ts', './lib/wps.ts'],
      name: 'geoserver-helper',
      // fileName: 'geoserver-helper',
      fileName: (format, entryName: string) => {
        if (format == "es") {
          return `${entryName}.js`
        } else if (format == "umd") {
          return `${entryName}.${format}.cjs`
        } else if (format == "cjs") {
          return `${entryName}.cjs`
        } else {
          return `${entryName}.${format}.js`
        }
      },
    },
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下,全局模式下为这些外部化的依赖提供一个全局变量
        globals: {
          liteMove: 'geoserverHelper',
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    open: true,
    proxy: {
      "/geoserver": {
        // target: "http://192.168.0.110:8082/geoserver",
        target: "http://124.232.190.101:30500/geoserver",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, "/"),
      }
    },
  },
  test: {
    environment: 'jsdom',
  },
  plugins: [dts()]
})
