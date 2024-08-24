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
import { rules } from "@eslint/js/src/configs/eslint-all";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules:{
      "no-debugger":"off"
    }
  }
];