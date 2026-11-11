import { defineConfig } from "vitepress";

export default defineConfig({
  title: "geoserver-helper",
  titleTemplate: ":title · geoserver-helper",
  description: "前端调用 GeoServer OGC / REST 的 TypeScript 助手库",
  lang: "zh-CN",
  base: "/geoserver-helper/",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/geoserver-helper/favicon.svg",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "geoserver-helper",
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/getting-started" },
      { text: "接口类型", link: "/api/interfaces" },
      { text: "变更日志", link: "/changelog" },
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
        items: [
          { text: "接口类型摘录", link: "/api/interfaces" },
          { text: "变更日志", link: "/changelog" },
        ],
      },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            displayDetails: "显示详细列表",
            resetButtonTitle: "重置搜索",
            backButtonTitle: "关闭搜索",
            noResultsText: "没有找到相关结果",
            footer: {
              selectText: "选择",
              selectKeyAriaLabel: "选择",
              navigateText: "切换",
              navigateUpKeyAriaLabel: "上一个",
              navigateDownKeyAriaLabel: "下一个",
              closeText: "关闭",
              closeKeyAriaLabel: "关闭",
            },
          },
        },
      },
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/DLinser/geoserver-helper",
      },
    ],
    outline: {
      label: "本页目录",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdated: {
      text: "最后更新于",
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    footer: {
      message: "MIT License",
      copyright: "Copyright © geoserver-helper contributors",
    },
  },
});