# geoserver-helper

## Languages

- [English](./README_en.md)
- [中文](./README.md)

## Introduction

Used to request interface information such as REST, WFS, WMS, WPS for Geoserver

## Software Architecture

- Scaffolding：create-vite
- Main language：Typescript
- Declaration file framework：vite-plugin-dts
- Unit testing framework：vitest
- API documentation framework：typedoc
- Creation process：

```shell
# 1.创建入口
npm create vite
# 2.按照指引安装依赖（如果电脑上以前没有安装create-vite的话，此项目是用的create-vite@5.5.1）以及设置项目名称（Project name:）
# 3.不要选择开发框架而是选择Others（Select a framework: » Others）
# 4.选择预配置变体，其实就是默认生成哪种配置（Select a variant: » create-vite-extra）
# 5.选择模板为工具库（Select a template: » library）
# 5.选择预配置语言变量（Select a variant: » TypeScript）
```

### File resource directory 📚

├─dist  
├─lib  
│ ├─interface  
│ ├─config  
│ └─utils  
├─public  
└─src

### Development

1. clone

```shell
git clone https://gitee.com/lyxstart/geoserver-helper.git
```

2. install

```shell
npm i  /  pnpm i
```

3. run

```shell
npm run dev
```

4. build

```shell
npm run build
```

- test

```shell
# 测试的geoserver地址可能要做一下变更
npm run test
```

- link(just like npm publish)

```shell
npm run link
pnpm link --global
```

- link install(just like npm i)

```shell
npm link geoserver-helper
pnpm link --global geoserver-helper
```

- close link

```shell
npm run unlink
pnpm unlink geoserver-helper
```

## Installation Tutorial

```shell
# 安装依赖
npm i geoserver-helper
```

### Instructions

1.  Introducing Dependency

```javascript
// Introducing dependencies as a whole
import geoserverHelper from "geoserver-helper";
// Introduce dependencies on demand
import utils from "geoserver-helper/utils";
import wfsHelper from "geoserver-helper/wfs";
import wcsHelper from "geoserver-helper/wcs";
import wpsHelper from "geoserver-helper/wps";
import wmsHelper from "geoserver-helper/wms";
import restHelper from "geoserver-helper/rest";
```

2.  use

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

3. attention  
   If your project uses Typescript, due to Typescript version issues, currently only Typescript 4.7 (June 2022) and later versions support exports mapping, which means that a higher version parser (node16 nodenext、Bundler）， That is to say, the "moduleSolution": "Bundler" in your tsconfig. json must be modified to one of node16, nodenext, or Bundler. If for some special reason you are unwilling or unable to change it, you can also use the following absolute path reference method

```javascript
// Introducing dependencies as a whole
import geoserverHelper from "geoserver-helper";
// Introduce dependencies on demand
import utils from "geoserver-helper/dist/utils";
import wfsHelper from "geoserver-helper/dist/wfs";
import wcsHelper from "geoserver-helper/dist/wcs";
import wpsHelper from "geoserver-helper/dist/wps";
import wmsHelper from "geoserver-helper/dist/wms";
```

Document：[Portal](https://dlinser.github.io/geoserver-helper/)

## Version change log

[Portal](./CHANGELOG.md)

#### Participate and contribute

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
