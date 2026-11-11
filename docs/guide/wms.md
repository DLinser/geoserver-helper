# WMS

`wmsHelper` 提供 WMS 能力集、GetMap 出图、点选要素信息与图例。

## 当前支持范围

已支持：

- `GetCapabilities`
- `GetMap` / `GetMapUrl`
- `GetFeatureInfo`
- `GetLegendGraphic`

尚未封装（需要时可直接拼 OGC 请求，或后续再补）：

- `DescribeLayer`
- `GetStyles`
- WMTS
- WMS 请求上的 Basic Auth（REST / WFS helper 已支持，WMS 这一侧还没有）

## 初始化

入口：`geoserver-helper/wms`。

```ts
import wmsHelper from "geoserver-helper/wms";

const wms = new wmsHelper({
  url: "http://localhost:8080/geoserver/wms",
  layer: "states", // 可选
  workspace: "topp", // 可选
  workspaceUri: "http://www.openplans.org/topp", // 可选
  srsName: "EPSG:4326", // 默认 EPSG:4326；未显式传 srs/crs 时会用到
});
```

实例属性：`url`、`layer`、`srsName`、`workspace`、`workspaceUri`。出图、点选、图例等方法未传图层时，会用 `workspace:layer` 或 `layer`。

## 版本、坐标系与像素坐标

- 未传 `version` 时，`GetCapabilities`、`GetMap`、`GetFeatureInfo` 默认仍为 `"1.0.0"`。调用方可显式传入 `"1.1.1"` 或 `"1.3.0"`。
- **WMS 1.1.x / 1.0.0** 使用 `SRS`，点选像素坐标为 `X` / `Y`。
- **WMS 1.3.0** 使用 `CRS`，点选像素坐标为 `I` / `J`。
- `X` / `Y` 与 `I` / `J` 都是相对于 `width` × `height` 出图结果的**像素列/行**（左上为原点：列从左起，行从上起），**不是经纬度**。
- 未传 `srs` 或 `crs` 时，使用实例上的 `srsName`，不会写死 `EPSG:4326`。
- **1.3.0 轴序**：当 CRS 是 `EPSG:4326` 这类纬度优先的坐标系时，`bbox` 应为 `minLat,minLon,maxLat,maxLon`。`EPSG:3857` 等投影坐标仍是 `minX,minY,maxX,maxY`。用错轴序会导致空白图或查询点对不上。

## 查询能力集

内部用 `ol/format/WMSCapabilities` 解析。`version` 类型为 `IWms.WmsVersion`，默认 `"1.0.0"`。

```ts
GetCapabilities(option: { version?: IWms.WmsVersion } = { version: "1.0.0" })
```

```ts
const caps = await wms.GetCapabilities(); // 默认 1.0.0
const caps111 = await wms.GetCapabilities({ version: "1.1.1" });
```

## 获取地图（GetMap）

`GetMapUrl` 只拼接请求地址（可直接给 `img.src` 或切片调试用）；`GetMap` 会发起请求。默认 `format` 为 `image/png`，图片结果通常是 `Blob`。

规范要求的 `layers`、`styles`、`bbox`、`width`、`height`、以及按版本的 `srs` / `crs` 都会出现在 URL 中。`layers` 可回退到实例图层，`styles` 未传时按空字符串发送，坐标系未传时用 `srsName`。

```ts
GetMapUrl(option: IWms.GetMapParameters): string
GetMap(option: IWms.GetMapParameters): Promise<Blob | string | any>
```

```ts
const mapUrl = wms.GetMapUrl({
  layers: "topp:states",
  version: "1.1.1",
  srs: "EPSG:4326",
  bbox: "-124.73,24.96,-66.97,49.37",
  width: 512,
  height: 256,
  format: "image/png",
  transparent: true,
  // 可选：cql_filter、time、env、bgcolor 等
});

const image = await wms.GetMap({
  layers: "topp:states",
  version: "1.1.1",
  srs: "EPSG:4326",
  bbox: "-124.73,24.96,-66.97,49.37",
  width: 512,
  height: 256,
  format: "image/png",
  transparent: true,
});
```

WMS 1.3.0 示例（注意 `crs` 与 `EPSG:4326` 的纬度、经度轴序）：

```ts
const mapUrl130 = wms.GetMapUrl({
  layers: "topp:states",
  version: "1.3.0",
  crs: "EPSG:4326",
  bbox: "24.96,-124.73,49.37,-66.97",
  width: 512,
  height: 256,
});
```

## 点选要素信息

一般用于地图点选（GetFeatureInfo）。参数为 `IWms.GetFeatureInfoParameters`：1.0.0 / 1.1.x 用 `srs` + `x` / `y`，1.3.0 用 `crs` + `i` / `j`。

`bbox`、`width`、`height` 以及像素坐标在规范中都是必填（它们描述的是「点选发生在哪一张图上」），类型里也按必填处理，不再默认 `width/height=101` 或把像素坐标静默设为 `0`。`query_layers` 未传时等于 `layers`。

```ts
GetFeatureInfo(option: IWms.GetFeatureInfoParameters)
```

```ts
const info = await wms.GetFeatureInfo({
  layers: "topp:states",
  version: "1.1.1",
  srs: "EPSG:4326",
  bbox: "118.85559,39.47113,119.17419,39.776",
  width: 256,
  height: 256,
  x: 128,
  y: 128,
  info_format: "application/json",
  feature_count: 5,
});
```

```ts
const info130 = await wms.GetFeatureInfo({
  layers: "topp:states",
  version: "1.3.0",
  crs: "EPSG:4326",
  bbox: "39.47113,118.85559,39.776,119.17419",
  width: 256,
  height: 256,
  i: 128,
  j: 128,
});
```

## 获取图例

默认 `format` 为 `application/json`。

```ts
GetLegendGraphic(option: IWms.GetLegendGraphic.QueryParameters)
// QueryParameters 常用字段：layer?、version?、format?、style?、scale?、width?、height?、rule?、legend_options?
```

```ts
const legend = await wms.GetLegendGraphic({
  layer: "topp:states",
});
```

更细类型见 [接口类型](/api/interfaces)。
