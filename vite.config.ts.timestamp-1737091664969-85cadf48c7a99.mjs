// vite.config.ts
import { defineConfig } from "file:///E:/MyStudy/geoserver-helper/node_modules/vite/dist/node/index.js";
import dts from "file:///E:/MyStudy/geoserver-helper/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: ["./lib/geoserver-helper.ts", "./lib/utils/utils.ts", "./lib/interface/interface.ts", "./lib/rest.ts", "./lib/wfs.ts", "./lib/wms.ts", "./lib/wps.ts"],
      name: "geoserver-helper",
      // fileName: 'geoserver-helper',
      fileName: (format, entryName) => {
        if (format == "es") {
          return `${entryName}.js`;
        } else if (format == "umd") {
          return `${entryName}.${format}.cjs`;
        } else if (format == "cjs") {
          return `${entryName}.cjs`;
        } else {
          return `${entryName}.${format}.js`;
        }
      }
    },
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下,全局模式下为这些外部化的依赖提供一个全局变量
        globals: {
          liteMove: "geoserverHelper"
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
    open: true,
    proxy: {
      "/geoserver": {
        target: "http://192.168.0.110:8082/geoserver",
        //target: "https://ahocevar.com/geoserver",//openlayers官方地址
        // target: "https://maps5.geosolutionsgroup.com/geoserver",//geosolutions官方地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, "/")
      }
    }
  },
  test: {
    environment: "jsdom"
  },
  plugins: [dts()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxNeVN0dWR5XFxcXGdlb3NlcnZlci1oZWxwZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXE15U3R1ZHlcXFxcZ2Vvc2VydmVyLWhlbHBlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovTXlTdHVkeS9nZW9zZXJ2ZXItaGVscGVyL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiBbJy4vbGliL2dlb3NlcnZlci1oZWxwZXIudHMnLCAnLi9saWIvdXRpbHMvdXRpbHMudHMnLCAnLi9saWIvaW50ZXJmYWNlL2ludGVyZmFjZS50cycsICcuL2xpYi9yZXN0LnRzJywgJy4vbGliL3dmcy50cycsICcuL2xpYi93bXMudHMnLCAnLi9saWIvd3BzLnRzJ10sXHJcbiAgICAgIG5hbWU6ICdnZW9zZXJ2ZXItaGVscGVyJyxcclxuICAgICAgLy8gZmlsZU5hbWU6ICdnZW9zZXJ2ZXItaGVscGVyJyxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQsIGVudHJ5TmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSBcImVzXCIpIHtcclxuICAgICAgICAgIHJldHVybiBgJHtlbnRyeU5hbWV9LmpzYFxyXG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09IFwidW1kXCIpIHtcclxuICAgICAgICAgIHJldHVybiBgJHtlbnRyeU5hbWV9LiR7Zm9ybWF0fS5janNgXHJcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT0gXCJjanNcIikge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2VudHJ5TmFtZX0uY2pzYFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gYCR7ZW50cnlOYW1lfS4ke2Zvcm1hdH0uanNgXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU1OTE2XHU5MEU4XHU1MzE2XHU1OTA0XHU3NDA2XHU5MEEzXHU0RTlCXHU0RjYwXHU0RTBEXHU2MEYzXHU2MjUzXHU1MzA1XHU4RkRCXHU1RTkzXHU3Njg0XHU0RjlEXHU4RDU2XHJcbiAgICAgIGV4dGVybmFsOiBbXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgLy8gXHU1NzI4IFVNRCBcdTY3ODRcdTVFRkFcdTZBMjFcdTVGMEZcdTRFMEIsXHU1MTY4XHU1QzQwXHU2QTIxXHU1RjBGXHU0RTBCXHU0RTNBXHU4RkQ5XHU0RTlCXHU1OTE2XHU5MEU4XHU1MzE2XHU3Njg0XHU0RjlEXHU4RDU2XHU2M0QwXHU0RjlCXHU0RTAwXHU0RTJBXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgbGl0ZU1vdmU6ICdnZW9zZXJ2ZXJIZWxwZXInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgIG9wZW46IHRydWUsXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9nZW9zZXJ2ZXJcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTkyLjE2OC4wLjExMDo4MDgyL2dlb3NlcnZlclwiLFxyXG4gICAgICAgIC8vdGFyZ2V0OiBcImh0dHBzOi8vYWhvY2V2YXIuY29tL2dlb3NlcnZlclwiLC8vb3BlbmxheWVyc1x1NUI5OFx1NjVCOVx1NTczMFx1NTc0MFxyXG4gICAgICAgIC8vIHRhcmdldDogXCJodHRwczovL21hcHM1Lmdlb3NvbHV0aW9uc2dyb3VwLmNvbS9nZW9zZXJ2ZXJcIiwvL2dlb3NvbHV0aW9uc1x1NUI5OFx1NjVCOVx1NTczMFx1NTc0MFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZ2Vvc2VydmVyLywgXCIvXCIpLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGVzdDoge1xyXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbZHRzKCldXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFFaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTyxDQUFDLDZCQUE2Qix3QkFBd0IsZ0NBQWdDLGlCQUFpQixnQkFBZ0IsZ0JBQWdCLGNBQWM7QUFBQSxNQUM1SixNQUFNO0FBQUE7QUFBQSxNQUVOLFVBQVUsQ0FBQyxRQUFRLGNBQXNCO0FBQ3ZDLFlBQUksVUFBVSxNQUFNO0FBQ2xCLGlCQUFPLEdBQUcsU0FBUztBQUFBLFFBQ3JCLFdBQVcsVUFBVSxPQUFPO0FBQzFCLGlCQUFPLEdBQUcsU0FBUyxJQUFJLE1BQU07QUFBQSxRQUMvQixXQUFXLFVBQVUsT0FBTztBQUMxQixpQkFBTyxHQUFHLFNBQVM7QUFBQSxRQUNyQixPQUFPO0FBQ0wsaUJBQU8sR0FBRyxTQUFTLElBQUksTUFBTTtBQUFBLFFBQy9CO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQTtBQUFBLE1BRWIsVUFBVSxDQUFDO0FBQUEsTUFDWCxRQUFRO0FBQUE7QUFBQSxRQUVOLFNBQVM7QUFBQSxVQUNQLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUE7QUFBQTtBQUFBLFFBR1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGdCQUFnQixHQUFHO0FBQUEsTUFDckQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDakIsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
