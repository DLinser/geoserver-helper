/*
 * @Author: your name
 * @Date: 2024-08-24 11:04:53
 * @LastEditors: 林永鑫
 * @LastEditTime: 2024-08-24 16:20:43
 * @Description: 
 * @FilePath: \geoserver-helper\eslint.config.js
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { ignores: ["dist/**", "docs/**", "public/**", "src/**", "vite.config.ts", "vite.config.ts.timestamp-*.mjs"] },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules:{
      "no-debugger":"off",
      // interface 目录以 namespace 组织开放类型，属于既有公开 API 结构
      "@typescript-eslint/no-namespace":"off",
      // 空接口继承(FeatureTypeAddParam 等)是刻意的类型别名用法
      "@typescript-eslint/no-empty-object-type":"off",
      // 存量 any 较多，先降为警告，逐步清理
      "@typescript-eslint/no-explicit-any":"warn",
      "@typescript-eslint/no-unused-vars":"warn"
    }
  }
];