# WFS

`wfsHelper` 简化 GeoServer WFS：能力集、要素查询、字段结构、增删改。

## 初始化

入口：`geoserver-helper/wfs`。未传 `userName` / `password` 时不会带 Authorization。

```ts
import wfsHelper from "geoserver-helper/wfs";

const wfs = new wfsHelper({
  url: "http://localhost:8080/geoserver/wfs",
  userName: "admin", // 可选
  password: "geoserver", // 可选
  layer: "states", // 可选，默认图层名
  workspace: "topp", // 可选
  workspaceUri: "http://www.openplans.org/topp", // 可选，Transaction / POST 常用
  srsName: "EPSG:4326", // 默认 EPSG:4326
});
```

实例上可读改：`url`、`userName`、`password`、`layer`、`srsName`、`workspace`、`workspaceUri`。未在方法里指定图层时，会用 `workspace:layer`（有 workspace）或 `layer`。

## 查询能力集

不同 `version` 返回内容略有差异；暂不支持 JSON。

```ts
GetCapabilities(option: { version: string } = { version: "1.0.0" })
```

```ts
const caps = await wfs.GetCapabilities({ version: "1.0.0" });
```

## 查询要素

简单条件用 GET 的 `GetFeature`；复杂 CQL / 长过滤建议用 `GetFeatureByPost`（POST）。POST 的 CQL 暂不支持 `TOUCHES` | `CROSSES` | `OVERLAPS` | `DWITHIN` | `BEYOND`。

```ts
GetFeature(queryOption?: {
  cql?: string;
  propertyname?: string;
  fid?: number | string;
  typename?: string;
  maxFeatures?: number | string;
  startIndex?: number | string;
  extension?: Record<string, string | number>;
})

GetFeatureByPost(option?: {
  cql?: string;
  propertyname?: string; // 多字段用逗号分隔
  typename?: string;
  workspace?: string;
  workspaceUri?: string;
  maxFeatures?: number;
  startIndex?: number;
})
```

```ts
// GET：适合简单查询
const features = await wfs.GetFeature({
  typename: "topp:states",
  propertyname: "STATE_NAME,STATE_ABBR",
  maxFeatures: 50,
  // cql: "STATE_NAME='California'",
  // fid: "states.1",
});

// POST：复杂空间 / 长 CQL
const byPost = await wfs.GetFeatureByPost({
  typename: "topp:states",
  workspace: "topp",
  workspaceUri: "http://www.openplans.org/topp",
  cql: "STATE_NAME = 'California'",
  maxFeatures: 10,
  startIndex: 0,
});
```

## 查询单一属性

类似 GetFeature，但只取某一字段，且不能加条件筛选。

```ts
GetPropertyValue(option: { typeNames?: string; valueReference: string })
```

```ts
const values = await wfs.GetPropertyValue({
  typeNames: "topp:states",
  valueReference: "STATE_NAME",
});
```

## 字段结构

查询矢量图层字段信息。

```ts
DescribeFeatureType(queryOption?: { typeName?: string })
```

```ts
const desc = await wfs.DescribeFeatureType({
  typeName: "topp:states",
});
```

## 增删改要素

`Transaction` 支持新增、编辑、删除。内部已对坐标做经纬度反转处理，调用方不必再处理。`type` 字面量为 `"modif" | "create" | "delete"`（与源码一致）。

```ts
Transaction(option: IWfs.Transaction.FeatureTransactionOption)
// FeatureTransactionOption:
// {
//   type: "modif" | "create" | "delete";
//   featurePrefix: string;   // 工作区名
//   featureNS: string;      // 创建工作区时的命名空间 URI
//   featureType: string;    // 图层名
//   srsName?: string;
//   features: Feature[] | featureOption[];
// }
```

```ts
const result = await wfs.Transaction({
  type: "create",
  featurePrefix: "topp",
  featureNS: "http://www.openplans.org/topp",
  featureType: "states",
  srsName: "EPSG:4326",
  features: [
    /* OpenLayers Feature 或 JSON featureOption */
  ],
});
```

更细的请求/响应类型见 [接口类型](/api/interfaces)。