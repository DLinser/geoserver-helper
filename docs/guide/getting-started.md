# 快速开始

## 安装

```bash
npm i geoserver-helper
```

## 引入

支持整体引入或按子路径按需引入：

```ts
// 整体
import geoserverHelper from "geoserver-helper";

// 按需
import utils from "geoserver-helper/utils";
import wfsHelper from "geoserver-helper/wfs";
import wcsHelper from "geoserver-helper/wcs";
import wpsHelper from "geoserver-helper/wps";
import wmsHelper from "geoserver-helper/wms";
import restHelper from "geoserver-helper/rest";
```

### TypeScript `moduleResolution`

若使用 TypeScript，请将 `tsconfig.json` 的 `moduleResolution` 设为 `Bundler`、`node16` 或 `nodenext`（需 TS ≥ 4.7），以便解析 `package.json` 的 `exports`。

无法改解析器时，可用 `dist` 绝对路径：

```ts
import wfsHelper from "geoserver-helper/dist/wfs";
import restHelper from "geoserver-helper/dist/rest";
```

## 最小示例（REST）

```ts
import restHelper from "geoserver-helper/rest";

const rest = new restHelper({
  url: "http://localhost:8080/geoserver",
  // 如需 Basic Auth：
  // userName: "admin",
  // password: "geoserver",
});

const layers = await rest.getLayerListApi();
console.log(layers.layers);

const workspaces = await rest.getWorkspaceListApi();
console.log(workspaces.workspaces);
```

更多场景见侧栏「REST / WFS / WMS / WCS / WPS」指南：每个方法只在对应场景小节出现一次（说明 + 类型 + 示例）。类型细节见 [接口类型](/api/interfaces)。

## utils 小工具

```ts
import utils from "geoserver-helper/utils";

const qs = utils.common.formateObjToParamStr({ name: "zhangsan" });
```

## 本地开发本仓库

```bash
npm i
npm run dev       # 演示页
npm run test      # 单测（可改 GeoServer 地址）
npm run build     # 构建库
npm run docs:dev  # 预览 VitePress 文档
npm run docs:build # 构建文档静态站点
```

## 线上文档

部署地址：<https://dlinser.github.io/geoserver-helper/>