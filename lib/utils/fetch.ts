import { formateObjToParamStr } from "../common"

const request = {
    // post请求方法
    post(url: string, data: string | Record<string, string | number | undefined>) {
        let requestBody = ""
        if (typeof data == "string") {
            requestBody = data
        } else if (typeof data == "object") {
            requestBody = formateObjToParamStr(data)
        }
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // 注意 post 时候参数的形式
            body: requestBody
        }).then(res => {
            return res.json()
        })
    },
    // get请求方法
    get(url: string) {
        return fetch(url, {
            credentials: 'include',
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
            }),
            mode: "cors",
        }).then(res => {
            return res.json()
        })
    }
}

export default request;