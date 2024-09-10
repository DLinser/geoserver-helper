/*
 * @Author: linyongxin linyongxin@ellipspace.com
 * @Date: 2024-08-14 14:40:47
 * @LastEditors: linyongxin linyongxin@ellipspace.com
 * @LastEditTime: 2024-09-10 13:45:20
 * @FilePath: \geoserver-helper\lib\utils\common.ts
 * @Description: 公共方法库
 */

/**
 * @description: 将对象转换成URL上拼接的字符串
 * @param {Record} paramObj 对象参数
 * @return {String}
 */
export function formateObjToParamStr(
    paramObj: Record<string, string | number | undefined>,
) {
    const params = new URLSearchParams();
    for (const attr in paramObj) {
        if (paramObj[attr] != undefined && paramObj[attr] != null) {
            params.append(attr, String(paramObj[attr]));
        }
    }
    return params.toString();
}
export default {
    formateObjToParamStr,
}