import { defineConfig } from "vitepress";

export default defineConfig({
  title: "geoserver-helper",
  description: "前端调用 GeoServer OGC / REST 的 TypeScript 助手库",
  lang: "zh-CN",
  base: "/geoserver-helper/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/getting-started" },
      { text: "接口类型", link: "/api/interfaces" },
      {
        text: "GitHub",
        link: "https://github.com/DLinser/geoserver-helper",
      },
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "首页", link: "/" },
          { text: "快速开始", link: "/guide/getting-started" },
        ],
      },
      {
        text: "模块指南",
        items: [
          { text: "REST", link: "/guide/rest" },
          { text: "WFS", link: "/guide/wfs" },
          { text: "WMS", link: "/guide/wms" },
          { text: "WCS", link: "/guide/wcs" },
          { text: "WPS", link: "/guide/wps" },
        ],
      },
      {
        text: "参考",
        items: [{ text: "接口类型摘录", link: "/api/interfaces" }],
      },
    ],
    search: { provider: "local" },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/DLinser/geoserver-helper",
      },
    ],
    footer: {
      message: "MIT License",
      copyright: "Copyright © geoserver-helper contributors",
    },
  },
});
