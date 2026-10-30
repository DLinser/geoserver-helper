# WPS

`wpsHelper` 封装 WPS 能力集、进程描述，以及若干常用处理的 Execute XML 拼装。

## 初始化

入口：`geoserver-helper/wps`。构造时可传 URL，也可稍后 `setUrl`。

```ts
import wpsHelper from "geoserver-helper/wps";

const wps = new wpsHelper("http://localhost:8080/geoserver/wps");
// 或：
// const wps = new wpsHelper();
// wps.setUrl("http://localhost:8080/geoserver/wps");
```

实例属性：`url`（默认 `""`）。

```ts
setUrl(url: string)
```

## 查询能力集与进程

能力集暂不支持 JSON。`DescribeProcess` 需传进程标识。

```ts
GetCapabilities()
DescribeProcess(option: { identifier: string })
```

```ts
const caps = await wps.GetCapabilities();
const proc = await wps.DescribeProcess({
  identifier: "gs:Aggregate",
});
```

## 拼装查询 XML

通用查询 XML（空间字段 + CQL + 图层）。得到片段后通常再 `finishXML` 加 XML 头，并用 POST 发到 WPS 端点。

```ts
formatQueryXmlString(option: {
  geoFile: string; // 空间字段名，如 geom | the_geom | shap
  cqlFilter: string;
  workspace: string;
  namespaceURL: string;
  typeName: string;
  attributes?: string[];
})
```

```ts
const xml = wps.formatQueryXmlString({
  geoFile: "the_geom",
  cqlFilter: "1=1",
  workspace: "topp",
  namespaceURL: "http://www.openplans.org/topp",
  typeName: "states",
  attributes: ["STATE_NAME"],
});
const body = wps.finishXML(xml);
```

## 矢量查询 / 统计类 XML

以下方法返回 Execute XML 片段，再经 `finishXML` 后提交。注意部分参数名与源码一致：`workspaceURI`、`outputMimiType`（拼写如此）。

```ts
formatVectorQueryXmlString(option: {
  workspace: string;
  workspaceURI: string;
  queryName: string;
  attributes?: string[];
  cql: string;
  outputMimiType?: string;
})

formatUniqueXmlString(option: {
  workspace: string;
  workspaceURI: string;
  queryName: string;
  fieldName: string;
  outputMimiType?: string;
})

formatFeatureCountXmlString(option: {
  workspace: string;
  workspaceURI: string;
  queryName: string;
  cql?: string;
  outputMimiType?: string;
})

formatAggregateXmlString(option: {
  workspace: string;
  workspaceURI: string;
  queryName: string;
  fieldName?: string;
  groupByAttributes?: string;
  functionName: string;
  cql?: string;
  outputMimiType?: string;
})
```

```ts
const uniqueXml = wps.formatUniqueXmlString({
  workspace: "topp",
  workspaceURI: "http://www.openplans.org/topp",
  queryName: "states",
  fieldName: "STATE_NAME",
  outputMimiType: "application/json",
});

const countXml = wps.formatFeatureCountXmlString({
  workspace: "topp",
  workspaceURI: "http://www.openplans.org/topp",
  queryName: "states",
  cql: "STATE_NAME = 'California'",
});

const aggXml = wps.formatAggregateXmlString({
  workspace: "topp",
  workspaceURI: "http://www.openplans.org/topp",
  queryName: "states",
  fieldName: "PERSONS",
  functionName: "Sum",
});
```

## 子流程边界与完成 XML

对子流程结果（FeatureCollection）算边界；以及给任意 Execute XML 加 XML 头。

```ts
formatBoundsBySubprocessXmlString(Subprocess: string)
finishXML(xml: string)
```

```ts
const boundsXml = wps.formatBoundsBySubprocessXmlString(uniqueXml);
const finished = wps.finishXML(boundsXml);
```

更细类型见 [接口类型](/api/interfaces)。