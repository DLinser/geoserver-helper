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

### 安装教程
```shell
# 安装依赖
npm i geoserver-restt
```

### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

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
