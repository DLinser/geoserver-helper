# 变更日志

变更日志记录要符合下面的模板

## 模板

## [版本号] - 日期

版本号-alpha 表示测试版本，也就是即将发布的版本号加上了 alpha 标识

### Added

- 新增某些功能的描述信息

### Changed

- 变更某些功能的描述信息

### Fixed

- 修复某些功能的描述信息

## 记录

## [0.0.15] - 2024-09-04

### Fixed

- 修复 rest 发送切片任务接口参数出现混乱的 bug

## [0.0.16-alpha] - 2024-09-04

### Added

- 添加 README_en.md 英文的说明文档

### Fixed

- wfs 的 formateFeatures 方法修复会修改源数据的问题
- rest 的 sendLayerCacheTaskApi 接口修复返回值类型错误问题
- vite.config.ts 打包入口修复以前漏掉的 rest 入口配置问题

## [0.0.16] - 2024-09-05

### Changed

- 完善 wfs 的 Transaction 方法，使其返回 json 格式

## [0.0.17] - 2024-09-05

### Fixed

- 修复 wfs 的 Transaction 编辑要素时 id 丢失问题

## [0.0.18] - 2024-09-09

### Fixed

- 修复 wfs 的 GetFeatureByPost 的 cql 太长导致的正则失效问题问题

## [0.0.19-alpha] - 2024-09-09

### Added

- 完善 rest 服务的数据存储相关接口

## [0.0.19-alpha] - 2024-09-10

### Added

- 完善 rest 服务的 System 相关接口
- 完善 rest 服务的图层组相关接口

## [0.0.19] - 2024-09-20

### Fixed

- 修复 wfs 的 GetFeatureByPost 的 cql 的 like 不生效问题

## [0.0.20-alpha] - 2024-09-21

### Added

- rest 添加日志配置 以及安全部分接口

## [0.0.20] - 2024-10-11

### Added

- rest 添加资源目录的查询，资源的复制，移动功能

## [0.0.21-alpha] - 2024-10-12

### Added

- rest 添加资源目录的创建接口

## [0.0.21] - 2024-10-12

### Fixed

- rest getLayerInfoApi 修复返回结果的类型错误

## [0.0.22] - 2024-11-04

### Fixed

- wms 修复没有到处 wms 相关 interfacebug

## [0.0.23] - 2024-11-12

### Fixed

- wfs 修复 GetFeatureByPost 第二次请求时总是使用第一次的请求参数问题

## [0.0.24] - 2024-11-20

### Fixed

- 补充上次

## [0.0.25-alpha] - 2024-12-10

### Added

- rest 添加 getDefaultWorkspaceInfoApi 接口(Add the getDefaultWorkspaceInfoApi interface)
- interface IWorkspace 添加 WorkspaceInfo(add IWorkspace.WorkspaceInfo interface)

## [0.0.25-alpha] - 2024-12-12

### Added

- interface IWfs 添加 GetFeatureParameters(add IWfs.GetFeatureParameters interface)

## [0.0.25] - 2024-12-16

### Fixed

- rest addDatastoreApi 接口去掉 type 参数的限制

## [0.0.26] - 2024-12-16

### Added

- rest 添加 addCoverageDatastoreApi 和 updateCoverageDatastoreApi 接口(Add addCoverageDatastoreApi and updateCoverageDatastoreApi interfaces)
- interface IDatastore.DatastoreInfo 添加 url 属性(Add URL attribute)

## [0.0.27] - 2024-12-16

### Fixed

- rest 修复 addCoverageDatastoreApi 和 updateCoverageDatastoreApi 接口(Fixed addCoverageDatastoreApi and updateCoverageDatastoreApi interfaces)

## [0.0.28-alpha] - 2024-12-16

### Added

- rest deleteDatastoreApi 添加 循环递归参数 recurse(Add parameter recurrence)

## [0.0.28] - 2024-12-18

### Fixed

- rest addCoverageDatastoreApi workspace 参数修复 recurse(fix parameter of workspace)

## [0.0.29] - 2024-12-18

### Added

- rest 添加 deleteLayerApi 接口 (add interfaces of deleteLayerApi)

## [0.0.30] - 2024-12-24

### Added

- interface wfs 添加 WfsFormats 类型
- interface wms 添加 WmsFormats 类型

## [0.0.31-alpha] - 2024-12-24

### Added

- interface wfs 修改 WfsFormats 类型
- interface wms 修改 WmsFormats 类型

## [0.0.31] - 2024-12-25

### Added

- interface namespaces 添加 NamespaceInfoRes 与 NamespaceInfo 类型
- interface style 添加 StyleDetailInfoRes 与 StyleDetailInfo 类型

## [0.0.32] - 2024-12-26

### Added

- interface system 添加 VersionItem 与 StatusItem 类型

## [0.0.33] - 2024-12-26

### Added

- rest 添加用户和角色相关接口(Add user and role related interfaces)

## [0.0.34] - 2024-12-26

### Fixed

- rest 补充缺失的 ISecurity(Add actual interfaces)

## [0.0.35] - 2024-12-31

### Added

- rest 添加 Featuretypes 相关接口(Add featuretypes related interfaces)

## [0.0.36] - 2025-01-24

### Added

- rest 添加 Coverages 相关接口(Add coverages related interfaces)

## [0.0.37] - 2025-02-18

### Added

- rest 添加 IWms.GetLegendGraphic.LegendLineSymbolizer 接口(Add interfaces of IWms.GetLegendGraphic.LegendLineSymbolizer)

## [0.0.38] - 2025-08-21

### Fixed

- wfs 修复GetFeature方法中startIndex为0不识别的问题

## [1.0.0] - 2025-09-15

### Changed

- 发布正式版本1.0.0

## [1.0.1] - 2025-11-28

### Fixed

- rest 修复getLayerGroupListApi传工作空间名无效的问题 (Fix the issue where getLayerGroupListApi passes invalid workspace names)

