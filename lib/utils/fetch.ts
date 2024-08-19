import { formateObjToParamStr } from "./common"

const request = {
    // post请求方法
    post<T>(url: string, data: any, config?: undefined | Record<string, any>): Promise<T> {
        let requestBody: string | FormData = ""
        if (typeof data == "string") {
            requestBody = data
        } else if (data instanceof FormData) {
            requestBody = data
        } else if (typeof data == "object") {
            requestBody = formateObjToParamStr(data)
        }
        const requestHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            ...config
        }
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: requestHeaders,
            // 注意 post 时候参数的形式
            body: requestBody
        }).then(res => {
            return res.json()
        })
    },
    // get请求方法
    get<T>(url: string, config?: undefined | Record<string, string | number | undefined>): Promise<T> {
        const requestHeaders = {
            "Content-Type": "application/json;charset=UTF-8",
            ...config
        }
        return fetch(url, {
            credentials: 'include',
            headers: new Headers(requestHeaders),
            mode: "cors",
        }).then(res => {
            return res.json()
        })
    }
}

export default request;