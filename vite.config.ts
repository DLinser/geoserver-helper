/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: ['./lib/main.ts', './lib/utils/index.ts', './lib/modules/layer.ts'],
      name: 'geoserver-helper',
      // fileName: 'geoserver-helper',
      fileName: (format, entryName: string) => {
        console.log('名称 entryName', entryName)
        console.log('format format', format)
        if (entryName == "main") {
          if (format == "es") {
            return `geoserver-helper.js`
          } else if (format == "umd") {
            return `geoserver-helper.${format}.cjs`
          } else if (format == "cjs") {
            return `geoserver-helper.cjs`
          } else {
            return `geoserver-helper.${format}.js`
          }
        } else {
          if (format == "es") {
            return `${entryName}.js`
          } else if (format == "umd") {
            return `${entryName}.${format}.cjs`
          } else if (format == "cjs") {
            return `${entryName}.cjs`
          } else {
            return `${entryName}.${format}.js`
          }
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
          liteMove: 'geoserverRest',
        },
      },
    },
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
