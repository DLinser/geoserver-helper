# WCS

`wcsHelper` 支持常见 WCS 版本下的能力集、覆盖描述与栅格下载。

## 初始化

入口：`geoserver-helper/wcs`。

```ts
import wcsHelper from "geoserver-helper/wcs";

const wcs = new wcsHelper({
  url: "http://localhost:8080/geoserver/wcs",
  layer: "Pk50095", // 可选，默认覆盖名
  workspace: "nurc", // 可选
  srsName: "EPSG:4326", // 默认 EPSG:4326
});
```

实例属性：`url`、`layer`、`srsName`、`workspace`。未在参数里写覆盖名时，会用 `workspace:layer` 或 `layer`。

## 查询能力集

默认版本 `"2.0.1"`（`IWcs.WcsVersion`）。

```ts
GetCapabilities(option: { version: IWcs.WcsVersion } = { version: "2.0.1" })
```

```ts
const caps = await wcs.GetCapabilities({ version: "2.0.1" });
```

## 查询覆盖描述

```ts
DescribeCoverage(option: IWcs.DescribeCoverageParameters = {})
// DescribeCoverageParameters: version?、coverage?、identifiers?、coverageId?
```

```ts
const desc = await wcs.DescribeCoverage({
  version: "2.0.1",
  coverage: "nurc:Pk50095",
});
```

## 获取栅格覆盖

可先用 `GetCoverageUrl` 拼出完整请求地址，再用 `GetCoverage` 下载。二者参数同为 `IWcs.GetCoverageParameters`。

```ts
GetCoverageUrl(option: IWcs.GetCoverageParameters): string
async GetCoverage(option: IWcs.GetCoverageParameters)
// 常用：version?、coverage? / identifiers? / coverageId?、format?（默认 GeoTIFF）、
// bbox?、crs?、width?、height?、subset?、extension?、headers? 等
```

```ts
const url = wcs.GetCoverageUrl({
  version: "2.0.1",
  coverage: "nurc:Pk50095",
  format: "GeoTIFF",
});

const data = await wcs.GetCoverage({
  version: "2.0.1",
  coverage: "nurc:Pk50095",
  format: "GeoTIFF",
});
```

更细类型见 [接口类型](/api/interfaces)。