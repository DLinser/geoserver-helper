# geoserver-helper

## 语言（Languages）

- [English](./README_en.md)
- [中文](./README.md)

## 介绍

用于前端请求 geoserver 的 OGC 服务包括 rest 接口、wfs 接口、wms 接口、wps 接口等，http 请求采用原生的 js 的 fetch 方法，同时简化了 geoserver 原始请求方式，调用更加简单，方便。

### 使用人群

以 geoserver 为地图服务的 webgis 开发者

## 软件架构

- 脚手架：create-vite
- 主语言：Typescript
- 声明文件框架：vite-plugin-dts
- 单元测试框架：vitest
- api 文档框架：typedoc
- 创建流程：

```shell
# 1.创建入口
npm create vite
# 2.按照指引安装依赖（如果电脑上以前没有安装create-vite的话，此项目是用的create-vite@5.5.1）以及设置项目名称（Project name:）
# 3.不要选择开发框架而是选择Others（Select a framework: » Others）
# 4.选择预配置变体，其实就是默认生成哪种配置（Select a variant: » create-vite-extra）
# 5.选择模板为工具库（Select a template: » library）
# 5.选择预配置语言变量（Select a variant: » TypeScript）
```

### 文件资源目录 📚

├─dist 打包后的文件目录  
├─lib 代码库  
│ ├─interface 接口  
│ ├─config 配置文件  
│ └─utils 工具  
├─public 普通前端的 public 用于预览和测试  
└─src 普通前端的 src 用于预览和测试

### 二次开发指引

1. 克隆项目

```shell
git clone https://github.com/DLinser/geoserver-helper.git
```

2. 安装依赖

```shell
npm i  /  pnpm i
```

3. 运行

```shell
npm run dev
```

4. 打包

```shell
npm run build
```

- 单元测试

```shell
# 测试的geoserver地址可能要做一下变更
npm run test
```

- 发布前调试(发布到本地,类似虚拟的 npm publish)

```shell
npm run link
pnpm link --global
```

- 发布前测试项目测试

```shell
npm link geoserver-helper
pnpm link --global geoserver-helper
```

- 关闭发布前的调试

```shell
npm run unlink
pnpm unlink geoserver-helper
```

## 安装教程

```shell
# 安装依赖
npm i geoserver-helper
```

### 使用说明

1.  引入依赖

```javascript
// 整体引入依赖
import geoserverHelper from "geoserver-helper";
// 按需引入依赖
import utils from "geoserver-helper/utils";
import wfsHelper from "geoserver-helper/wfs";
import wcsHelper from "geoserver-helper/wcs";
import wpsHelper from "geoserver-helper/wps";
import wmsHelper from "geoserver-helper/wms";
import restHelper from "geoserver-helper/rest";
```

2.  使用

```javascript
//对象转Query字符串
const aa = utils.common.formateObjToParamStr({
  name: "zhangsan",
});

//查询所有的图层列表
const restHelperInstance = new restHelper({
  url: "http://localhost:8080/geoserver",
});
//查询所有的图层列表
const res = await restHelperInstance.getLayerListApi();
console.log(res.layers);
//查询所有的工作空间列表
const res = await restHelperInstance.getWorkspaceListApi();
console.log(res.workspaces);
```

3. 注意
   如果您的项目用到了 Typescript，因为 Typescript 版本问题，目前支持 exports 映射的只有 Typescript 4.7（2022 年 6 月）往后的版本，也就是说使用的时候必须用高版本的解析器（node16、nodenext、Bundler），也就是说您的 tsconfig.json 中的 "moduleResolution": "Bundler",必须修改为 node16、nodenext、Bundler 中的某一个，如果因为某些特殊原因您不愿意更改或者不能更改也可以使用下面绝对路径的引用方式

```javascript
// 整体引入依赖
import geoserverHelper from "geoserver-helper";
// 按需引入依赖
import utils from "geoserver-helper/dist/utils";
import wfsHelper from "geoserver-helper/dist/wfs";
import wcsHelper from "geoserver-helper/dist/wcs";
import wpsHelper from "geoserver-helper/dist/wps";
import wmsHelper from "geoserver-helper/dist/wms";
```

开发文档地址：[传送门](https://dlinser.github.io/geoserver-helper/)

## 版本变更日志

[传送门](./CHANGELOG.md)

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
