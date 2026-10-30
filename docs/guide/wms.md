# WMS

`wmsHelper` 提供 WMS 能力集、点选要素信息与图例。

## 初始化

入口：`geoserver-helper/wms`。

```ts
import wmsHelper from "geoserver-helper/wms";

const wms = new wmsHelper({
  url: "http://localhost:8080/geoserver/wms",
  layer: "states", // 可选
  workspace: "topp", // 可选
  workspaceUri: "http://www.openplans.org/topp", // 可选
  srsName: "EPSG:4326", // 默认 EPSG:4326
});
```

实例属性：`url`、`layer`、`srsName`、`workspace`、`workspaceUri`。图例等方法未传图层时，会用 `workspace:layer` 或 `layer`。

## 查询能力集

内部用 `ol/format/WMSCapabilities` 解析。`version` 类型为 `IWmsVersion`，默认 `"1.0.0"`。

```ts
GetCapabilities(option: { version: IWmsVersion } = { version: "1.0.0" })
```

```ts
const caps = await wms.GetCapabilities({ version: "1.1.1" });
```

## 点选要素信息

一般用于地图点选（GetFeatureInfo）。参数为 `IWms.GetFeatureInfoParameters`（1.0.0/1.1.x 用 `srs`；1.3.0 用 `crs` 等，详见接口类型）。

```ts
GetFeatureInfo(option: IWms.GetFeatureInfoParameters)
```

```ts
const info = await wms.GetFeatureInfo({
  layers: "topp:states",
  version: "1.1.1",
  srs: "EPSG:4326",
  bbox: "118.85559,39.47113,119.17419,39.776",
  width: "256",
  height: "256",
  x: "128",
  y: "128",
  info_format: "application/json",
  feature_count: 5,
});
```

## 获取图例

默认 `format` 为 `application/json`。

```ts
GetLegendGraphic(option: IWms.GetLegendGraphic.QueryParameters)
// QueryParameters 常用字段：layer?、version?、format?: "application/json" | WmsFormats
```

```ts
const legend = await wms.GetLegendGraphic({
  layer: "topp:states",
});
```

更细类型见 [接口类型](/api/interfaces)。