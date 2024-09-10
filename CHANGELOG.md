# 变更日志
变更日志记录要符合下面的模板
## 模板
## [版本号] - 日期
版本号-alpha 表示测试版本，也就是即将发布的版本号加上了alpha标识
### Added
- 新增某些功能的描述信息
 
### Changed
- 变更某些功能的描述信息
 
### Fixed
- 修复某些功能的描述信息
## 记录
## [0.0.15] - 2024-09-04

### Fixed
- 修复rest发送切片任务接口参数出现混乱的bug
## [0.0.16-alpha] - 2024-09-04
### Added
- 添加 README_en.md 英文的说明文档
### Fixed
- wfs的formateFeatures方法修复会修改源数据的问题
- rest的sendLayerCacheTaskApi接口修复返回值类型错误问题
- vite.config.ts 打包入口修复以前漏掉的rest入口配置问题
## [0.0.16] - 2024-09-05
### Changed
- 完善wfs的Transaction方法，使其返回json格式
## [0.0.17] - 2024-09-05
### Fixed
- 修复wfs的Transaction编辑要素时id丢失问题
## [0.0.18] - 2024-09-09
### Fixed
- 修复wfs的GetFeatureByPost的cql太长导致的正则失效问题问题
## [0.0.19-alpha] - 2024-09-09
### Added
- 完善rest服务的数据存储相关接口
## [0.0.19-alpha] - 2024-09-10
### Added
- 完善rest服务的System相关接口
