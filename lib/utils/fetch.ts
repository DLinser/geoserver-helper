import { formateObjToParamStr } from "./common"

const request = {
    // post请求方法
    post<T>(url: string, data: any, config?: Record<string, any>): Promise<T> {
        let requestBody: string | FormData = ""
        if (typeof data == "string") {
            requestBody = data
        } else if (data instanceof FormData) {
            requestBody = data
        } else if (typeof data == "object") {
            requestBody = formateObjToParamStr(data)
        }
        let requestHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        if (config?.headers) {
            requestHeaders = { ...requestHeaders, ...config.headers }
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
    get<T>(url: string, config?: Record<string, any>): Promise<T> {
        let requestHeaders: Record<string, any> = {
            "Content-Type": "application/json;charset=UTF-8",
        }
        if (config?.headers) {
            requestHeaders = { ...requestHeaders, ...config.headers }
        }
        return fetch(url, {
            credentials: 'include',
            headers: new Headers(requestHeaders),
            mode: "cors",
        }).then(res => {
            return res.json()
        })
    },
    // get请求方法
    put<T>(url: string, data: any, config?: Record<string, any>): Promise<T> {
        let requestHeaders: Record<string, any> = {
            "Content-Type": "application/json;charset=UTF-8",
        }
        if (config?.headers) {
            requestHeaders = { ...requestHeaders, ...config.headers }
        }
        return fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: new Headers(requestHeaders),
            mode: "cors",
            body: data
        }).then(res => {
            return res.json()
        })
    }
}

export default request;