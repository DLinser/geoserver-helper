# geoserver-rest

## 介绍
用于请求geoserver的rest接口，包括常用的wfs、wms、wps等

## 软件架构

* 脚手架：create-vite
* 主语言：Typescript
* 声明文件框架：vite-plugin-dts
* 单元测试框架：vitest
* 创建流程：
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
├─dist  打包后的文件目录  
├─lib   代码库  
│  ├─interface       接口  
│  ├─modules         模块  
│  └─utils           工具  
├─public             普通前端的public用于预览和测试  
└─src                普通前端的src用于预览和测试  
### 二次开发指引
1. 克隆项目
```shell
git clone https://gitee.com/lyxstart/geoserver-rest.git
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
* 单元测试
```shell
npm run test
```
* 发布前调试(发布到本地,类似虚拟的 npm publish)
```shell
npm run link
pnpm link --global
```
* 发布前测试项目测试
```shell
npm run link geoserver-rest
pnpm link --global geoserver-rest
npm run unlink
```
* 关闭发布前的调试
```shell
npm run unlink
pnpm unlink geoserver-rest
```

## 安装教程
```shell
# 安装依赖
npm i geoserver-restt
```

### 使用说明

1.  引入依赖的
```shell
# 整体引入依赖
import geoserverHelper from 'geoserver-helper'

# 按需引入依赖
import utils from 'geoserver-helper/utils'
import wfsHelper from 'geoserver-helper/wfs'
import wpsHelper from 'geoserver-helper/wps'
import restHelper from 'geoserver-helper/rest'
```
2.  使用
```javascript
//对象转Query字符串
const aa = utils.common.formateObjToParamStr({
        name: 'zhangsan',
})

//查询所有的图层列表
const restHelperInstance = new restHelper({
    url: "http://localhost:8080/geoserver"
})
//查询所有的图层列表
const res = await restHelperInstance.getLayerListApi()
console.log(res.layers)
//查询所有的工作空间列表
const res = await restHelperInstance.getWorkspaceListApi()
console.log(res.workspaces)
```


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
