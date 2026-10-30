# REST

`restHelper` 封装 GeoServer 的 REST 管理接口，用来做工作空间、图层、样式、数据存储、系统配置等管理操作。本页按真实使用场景讲「做什么、怎么调」；字段与返回类型细节见 [接口类型](/api/interfaces)。

> 写操作（新增 / 修改 / 删除 / 发布 / reload 等）会改动服务器状态，请只在**测试环境**验证。

## 初始化

入口：`geoserver-helper/rest`。

- `url` 指向 GeoServer **根地址**（要带 `/geoserver`），例如 `http://localhost:8080/geoserver`，后面方法会自己拼 `/rest/...`。
- 同时传 `userName` + `password` 才会带 Basic 认证；只传其一或不传，则不带 Authorization。
- `layer` / `workspace` / `srsName` 是可选默认值：个别方法（例如切片任务）在你没显式传图层名时，会拼成 `workspace:layer`。

```ts
import restHelper from "geoserver-helper/rest";

const rest = new restHelper({
  url: "http://localhost:8080/geoserver", // GeoServer 根，含 /geoserver
  userName: "admin", // 可选；与 password 一起才会带 Basic
  password: "geoserver", // 可选
  layer: "", // 可选，默认图层名
  workspace: "", // 可选，默认工作空间
  srsName: "EPSG:4326", // 可选，默认坐标系
});

// 实例上可读改：url、userName、password、layer、srsName、workspace
```

## 工作空间

工作空间是命名空间容器：图层、数据存储、样式通常挂在某个工作空间下面。日常流程往往是「先建工作空间 → 再建存储 → 再发布图层」。

**常见能力**

- **列列表**：`getWorkspaceListApi()`。返回里常见 `workspaces.workspace` 数组，每一项有 `name`（名称）和 `href`（详情地址）。
- **查详情**：`getWorkspaceInfoApi(workspaceName?)`，拿到名称、创建时间、关联的 dataStores / coverageStores 等链接。
- **默认工作空间**：`getDefaultWorkspaceInfoApi()`。
- **新增**：`addWorkspaceApi({ name, default? })`。`name` 必填；`default: true` 表示同时设为默认（仅新增时有用）。
- **改名**：`updateWorkspaceApi(原名称, { name: 新名称 })`。
- **删除**：`deleteWorkspaceApi(名称)`（测试环境慎用；空间下若还有资源可能失败）。
- **命名空间**：`getNamespacesInfoApi(名称)` 可查 prefix / uri，一般够用，不必深究。

```ts
// 示例：创建 → 查询 →（可选）删除 —— 请在测试环境执行写操作
await rest.addWorkspaceApi({
  name: "demo_ws",
  default: false, // true 则设为默认工作空间
});

const list = await rest.getWorkspaceListApi();
// list.workspaces.workspace ≈ [{ name: "demo_ws", href: "..." }, ...]

const info = await rest.getWorkspaceInfoApi("demo_ws");
// info.workspace.name、dateCreated、dataStores 等

const def = await rest.getDefaultWorkspaceInfoApi();
const ns = await rest.getNamespacesInfoApi("demo_ws"); // prefix / uri

// 改名（测试环境）
await rest.updateWorkspaceApi("demo_ws", { name: "demo_ws2" });

// 清理（测试环境；确认无重要资源后再删）
await rest.deleteWorkspaceApi("demo_ws2");
```

## 图层与图层组

图层名在 GeoServer 里常写成 `工作空间:图层`，例如 `demo_ws:roads`。列表、详情、改默认样式、删除，以及从数据存储发布矢量 / 栅格，都走这一组接口。

### 查、改、删图层

- `getLayerListApi(workspaceName?)`：列图层；可限定工作空间。
- `getLayerInfoApi(layerNameWithWorkspace?)`：查详情；建议传 `"ws:layer"`。
- `modifyLayerApi(layerName, body, workspaceName?)`：改图层配置。常用字段见下面注释（完整字段见 [接口类型](/api/interfaces) 里的 `LayerModifyInfo`）。
- `deleteLayerApi(layerName, workspaceName?)`：删除图层（测试环境）。
- `getLayerSourceInfoByHrefApi(href)`：用详情里的 `resource.href` 再拉要素类型 / 覆盖源信息。

```ts
const layers = await rest.getLayerListApi("demo_ws");
// layers.layers.layer ≈ [{ name, href }, ...]

const layer = await rest.getLayerInfoApi("demo_ws:roads");
// layer.layer：name、type（如 VECTOR）、defaultStyle、resource 等

// 修改默认样式（测试环境）
await rest.modifyLayerApi(
  "roads", // 图层名（可不带工作空间前缀）
  {
    // LayerModifyInfo 常用字段：
    name: "roads", // 图层名
    defaultStyle: { name: "roads_style" }, // 默认样式名
    // opaque: true, // 是否不透明
    // queryable 等更多字段见接口类型
  },
  "demo_ws"
);

await rest.deleteLayerApi("roads", "demo_ws"); // 测试环境
```

### 从数据存储发布（先有 store，再发图层）

前提：目标工作空间里已经有矢量数据存储（datastore）或栅格覆盖存储（coveragestore）。发布时把库表 / 文件登记成 GeoServer 图层。

- **列要素类型**：`getFeaturetypesApi(workspace, store?, list?)`  
  `list` 取值含义（一句话）：`configured` 已发布的；`available` 存储里尚未发布的；`available_with_geom` 尚未发布且带几何列的；`all` 全部。
- **查单个要素类型**：`getFeaturetypeInfoApi(workspace, store, featureTypeName)`。
- **发布矢量**：`creatFeaturetypeApi(workspace, store, featureType)`（注意方法名是 creat，少一个 e）。
- **栅格侧**：`getCoveragesApi` / `getCoverageInfoApi` / `creatCoverageApi`，用法与矢量对称。

```ts
// 看存储里还有哪些表可以发布
const available = await rest.getFeaturetypesApi(
  "demo_ws",
  "pg_store",
  "available_with_geom" // 未发布且带几何
);
// 未发布时常见返回 list.string 字符串数组；已发布则是 featureTypes.featureType

// 发布矢量图层（测试环境）：把 PostGIS 表 roads 挂成图层
await rest.creatFeaturetypeApi("demo_ws", "pg_store", {
  name: "roads", // 图层名
  nativeName: "roads", // 源表名
  title: "道路",
  enabled: true,
  srs: "EPSG:4326",
  // 其它四至、投影策略等字段见 FeatureTypeAddParam
});

// 发布栅格（测试环境）：store 须已是 coveragestore
await rest.creatCoverageApi("demo_ws", "tif_store", {
  name: "dem",
  nativeName: "dem",
  nativeCoverageName: "dem",
  enabled: true,
  srs: "EPSG:4326",
});
```

### 图层组

图层组把多个图层捆在一起发布，客户端可以一次请求整组底图。

```ts
const groups = await rest.getLayerGroupListApi("demo_ws");
const g = await rest.getLayerGroupInfoApi("basemap", "demo_ws");
// g.layerGroup：name、mode、publishables（成员图层）等

// 修改 / 删除请在测试环境
// await rest.modifyLayerGroupApi("basemap", { /* LayerGroupModifyInfo */ }, "demo_ws");
await rest.deleteLayerGroupApi("basemap", "demo_ws");
```

### 切片任务（可选）

GeoWebCache 预切 / 重切 / 清切片：`type` 用 `seed`（生成）、`reseed`（重切）、`truncate`（清空）。`sendLayerCacheTaskApi` 发起任务；`getLayerCacheTasksApi` 看进度；`closeLayerCacheTaskApi` 结束（源码里还有历史别名 `clostLayerCacheTaskApi`，行为相同）。

```ts
// 测试环境；name 建议带 workspace:layer
await rest.sendLayerCacheTaskApi({
  name: "demo_ws:roads",
  zoomStart: 0,
  zoomStop: 10,
  type: "seed", // seed | reseed | truncate
  threadCount: 1,
});

const tasks = await rest.getLayerCacheTasksApi("demo_ws:roads");
await rest.closeLayerCacheTaskApi("demo_ws:roads");
```

## 样式

样式一般是 SLD（Styled Layer Descriptor）XML，决定图层怎么画。可以列样式、看 JSON 元数据，或直接取 SLD 原文。

- `getStylesListApi(workspace?)`：列表，项含 `name` / `href`。
- `getStyleInfoApi(name, workspace?)`：元数据（format、filename、workspace 等）。
- `getSldStyleApi(name, workspace?)`：返回 **SLD XML 字符串**。
- `addStyleApi(body, styleName, workspace?)`：`body` 就是 SLD 字符串；内部会把 Content-Type 切成 `application/vnd.ogc.sld+xml`。
- `updateStyleApi(body, styleName, newStyleName?, workspace?)`：同样传 SLD；可顺带改名。
- `deleteStyleApi(styleName, workspaceName)`：删除（测试环境；`workspaceName` 必填）。

```ts
const styles = await rest.getStylesListApi("demo_ws");
const meta = await rest.getStyleInfoApi("roads", "demo_ws");
const sld = await rest.getSldStyleApi("roads", "demo_ws"); // XML 字符串

const newSld = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml">
  <NamedLayer>
    <Name>roads</Name>
    <UserStyle>
      <Title>roads simple</Title>
      <FeatureTypeStyle>
        <Rule>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#333333</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

// 测试环境：新增 / 更新 / 删除
await rest.addStyleApi(newSld, "roads_v2", "demo_ws");
await rest.updateStyleApi(newSld, "roads_v2", undefined, "demo_ws");
await rest.deleteStyleApi("roads_v2", "demo_ws");
```

## 数据存储

数据存储连接真实数据源。矢量用 **datastore**（PostGIS、Shapefile、GeoPackage 等），栅格用 **coveragestore**（GeoTIFF、ImageMosaic 等）。列表 / 详情成对；新增时要说清挂在哪个工作空间、怎么连库或指哪个文件。

**字段白话**

- `name`：存储名称。
- `workspace`：所属工作空间（调用时必填，库会用来拼 URL）。
- `type`：类型，如 `"PostGIS"`、`"GeoTIFF"`。
- `connectionParameters.entry`：矢量常见连接参数，每项是 `{ "@key": "host", "$": "localhost" }` 这种键值。
- `url`：栅格常用来指文件路径（如 `file:///data/dem.tif`）。
- **删除**时的 `recurse`：为 `true` 会连带删掉该存储下已发布的图层，风险高，默认 `false`。

```ts
const stores = await rest.getDatastoreListApi("demo_ws");
const covStores = await rest.getCoveragestoresListApi("demo_ws");
const info = await rest.getDatastoreInfoApi("demo_ws", "pg_store");
// info.dataStore：name、type、enabled、connectionParameters 等

// 测试环境：新增 PostGIS 矢量存储（密码请换成你自己的占位，勿提交真实密码）
await rest.addDatastoreApi({
  name: "pg_store",
  workspace: "demo_ws",
  type: "PostGIS",
  enabled: true,
  connectionParameters: {
    entry: [
      { "@key": "host", "$": "127.0.0.1" },
      { "@key": "port", "$": "5432" },
      { "@key": "database", "$": "gis_db" },
      { "@key": "user", "$": "YOUR_DB_USER" },
      { "@key": "passwd", "$": "YOUR_DB_PASSWORD" }, // 占位，勿写真实密码
      { "@key": "dbtype", "$": "postgis" },
    ],
  },
});

// 测试环境：新增 GeoTIFF 栅格存储
await rest.addCoverageDatastoreApi({
  name: "tif_store",
  workspace: "demo_ws",
  type: "GeoTIFF",
  url: "file:///data/dem.tif", // 服务器上的文件路径
});

// recurse: false 只删存储；true 会递归删关联图层 —— 测试环境且确认后再用
await rest.deleteDatastoreApi("demo_ws", "pg_store", false);
await rest.deleteCoverageDatastoreApi("demo_ws", "tif_store", false);
```

## 系统与资源

### 版本、状态、字体、日志

用来摸清这台 GeoServer 的健康状况和日志落点。

- `getVersion()`：GeoServer / GeoTools / GWC 等版本。
- `getSystemStatus()`：内存、连接等指标列表。
- `getFonts()`：服务器可用字体。
- `getLoggingConfig()` / `updateLoggingConfig(config)`：读改日志级别与路径（写操作请测试环境）。

**reload vs reset（风险不同）**

- `reload()`：从磁盘重新加载配置并重置缓存，改完配置文件后常用。
- `reset()`：重置认证、存储、栅格、架构等缓存，影响面更大，**请谨慎**，仅在测试环境或明确需要时调用。

```ts
const version = await rest.getVersion();
// version.about.resource：各项的 Version、Git-Revision 等

const status = await rest.getSystemStatus();
const fonts = await rest.getFonts();
const logCfg = await rest.getLoggingConfig();

// 测试环境才改日志 / reload / reset
// await rest.updateLoggingConfig({
//   logging: {
//     level: "PRODUCTION_LOGGING",
//     location: "logs/geoserver.log",
//     stdOutLogging: true,
//   },
// });
// await rest.reload();
// await rest.reset(); // 更危险，默认不要调用
```

### 资源目录（相对 data_dir）

路径都是相对 GeoServer `data_dir` 的；拼 URL 时方法会直接拼接，**请以 `/` 开头**（如 `/www/hello.txt`）。

- `getResourceDirectoryInfo(path)`：列目录。
- `creatResource(path, 文本)`：只支持文本；已存在则覆盖。
- `copyResource` / `moveResource`：仅文件。
- `deleteResource`：删文件；目录会递归删除。

```ts
const dir = await rest.getResourceDirectoryInfo("/styles");

// 测试环境
await rest.creatResource("/www/hello.txt", "hello");
await rest.copyResource("/www/hello2.txt", "/www/hello.txt");
await rest.deleteResource("/www/hello2.txt");
```

## 安全

用户、角色的增删改，以及给用户绑角色。这些接口**权限敏感**，误操作可能把人锁在外面或放开不该放开的权限，务必只在测试环境练习，生产变更前先备份、再确认账号策略。

```ts
const users = await rest.getUsers(); // users.users：userName / enabled 等
const roles = await rest.getRoles(); // roles.roles：角色名字符串数组

// 以下均建议仅在测试环境执行
await rest.addRole("ROLE_VIEWER");
await rest.addUser({
  user: {
    userName: "alice",
    password: "CHANGE_ME", // 占位
    enabled: true,
  },
});
await rest.addUserRole("alice", "ROLE_VIEWER");
const aliceRoles = await rest.getUserRoles("alice");

// await rest.modifyUser("alice", { user: { userName: "alice", password: null, enabled: true } });
// await rest.deleteUserRole("alice", "ROLE_VIEWER");
// await rest.deleteUser("alice"); // 参数名在源码里叫 roleName，传入的是用户名
// await rest.deleteRole("ROLE_VIEWER");
```

主密码、图层级安全规则也有对应方法（`getMasterPassword` / `updateMasterPassword`、`getSecurityRulesOfLayersBased`），生产上更要谨慎，这里不展开示例。

---

未覆盖到的字段或边缘方法，以 [接口类型](/api/interfaces) 与源码 `lib/rest.ts` 为准。