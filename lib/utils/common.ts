/*
 * @Author: linyongxin linyongxin@ellipspace.com
 * @Date: 2024-08-14 14:40:47
 * @LastEditors: linyongxin linyongxin@ellipspace.com
 * @LastEditTime: 2024-08-19 15:33:09
 * @FilePath: \geoserver-rest\lib\utils\common.ts
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
        params.append(attr, String(paramObj[attr]));
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