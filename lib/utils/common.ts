/*
 * @Author: linyongxin linyongxin@ellipspace.com
 * @Date: 2024-08-14 14:40:47
 * @LastEditors: 林永鑫
 * @LastEditTime: 2024-08-24 23:17:11
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
        if(paramObj[attr] != undefined && paramObj[attr]!=null){
            params.append(attr, String(paramObj[attr]));
        }
    }
    return params.toString();
}

export function postXml(url: string, params: BodyInit) {
    return fetch(url, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json;charset=UTF-8",
        }),
        mode: "cors",
        body: params,
    }).then((res) => {
        return res.text();
    });
}

export default {
    formateObjToParamStr,
    postXml
}