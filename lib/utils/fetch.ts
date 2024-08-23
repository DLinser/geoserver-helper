import { formateObjToParamStr } from "./common"

// 定义请求配置类型  
interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: HeadersInit;
    body?: any; // 根据需要，可以进一步细化这个类型  
}
// 定义一个泛型函数来处理fetch请求，以便我们可以指定响应数据的类型  
function fetchData<T>(url: string, config: RequestConfig): Promise<T> {
    return fetch(url, {
        method: config.method,
        headers: config.headers,
        mode: "cors",
        body: config.body,
    }).then(res => {
        if (res.headers.get('content-type') && res.headers.get('content-type')!.includes('application/json')) {
            // 服务器返回的是JSON
            return res.json();
        } else {
            // 服务器返回的是其他类型，比如text/plain
            return res.text();
        }
    })
}

const request = {
    // post请求方法
    post<T>(url: string, data: any, config?: Record<string, any>): Promise<T> {
        let requestBody: string | FormData = ""
        let requestHeaders: Record<string, any> = {}
        if (typeof data == "string") {
            requestBody = data
            requestHeaders['Content-Type'] = "application/json;charset=UTF-8"
        } else if (data instanceof FormData) {
            requestBody = data
        } else if (typeof data == "object") {
            requestHeaders['Content-Type'] = "application/json;charset=UTF-8"
            requestBody = JSON.stringify(data)
        }
        //如果外部传值，优先使用外部的传值
        if (config?.headers) {
            requestHeaders = Object.assign(requestHeaders, config.headers)
        }
        return fetchData<T>(url, { method: 'POST', body: requestBody, headers: new Headers(requestHeaders) });
    },
    postXml<T>(url: string, data: BodyInit, config?: Record<string, any>): Promise<T> {
        //默认值
        let requestHeaders: Record<string, any> = {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'text/xml'
        }
        //如果外部传值，优先使用外部的传值
        if (config?.headers) {
            requestHeaders = Object.assign(requestHeaders, config.headers)
        }
        return fetchData<T>(url, {
            method: "POST",
            headers: new Headers(requestHeaders),
            body: data,
        });
    },
    // get请求方法
    get<T>(url: string, data?: Record<string, any>, config?: Record<string, any>): Promise<T> {
        let requestHeaders: Record<string, any> = { 'Content-Type': "application/json;charset=UTF-8" }
        let fetchUrl = ''
        if (data && Object.keys(data).length > 0) {
            fetchUrl = `${url}${url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(data)}`;
        } else {
            fetchUrl = url
        }
        //如果外部传值，优先使用外部的传值
        if (config?.headers) {
            requestHeaders = Object.assign(requestHeaders, config.headers)
        }
        //get请求一般不允许传请求体参数
        return fetchData<T>(fetchUrl, { method: 'GET', headers: new Headers(requestHeaders) });
    },
    // put请求方法
    put<T>(url: string, data: any, config?: Record<string, any>): Promise<T> {
        let requestBody: string = ""
        let requestHeaders: Record<string, any> = {}
        if (typeof data == "string") {
            requestBody = data
            requestHeaders['Content-Type'] = "application/json;charset=UTF-8"
        } else if (typeof data == "object") {
            requestHeaders['Content-Type'] = "application/json;charset=UTF-8"
            requestBody = JSON.stringify(data)
        }
        //如果外部传值，优先使用外部的传值
        if (config?.headers) {
            requestHeaders = Object.assign(requestHeaders, config.headers)
        }
        return fetchData<T>(url, { method: 'PUT', body: requestBody, headers: new Headers(requestHeaders) });
    },
    // delete方法
    delete<T>(url: string, data?: Record<string, any>, config?: Record<string, any>): Promise<T> {
        let requestHeaders: Record<string, any> = {}
        //如果外部传值，优先使用外部的传值
        if (config?.headers) {
            requestHeaders = Object.assign(requestHeaders, config.headers)
        }
        //一般不允许传请求体参数
        let fetchUrl = ''
        if (data && Object.keys(data).length > 0) {
            fetchUrl = `${url}${url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(data)}`;
        } else {
            fetchUrl = url
        }
        return fetchData<T>(fetchUrl, { method: 'DELETE', headers: new Headers(requestHeaders) });
    },


}

export default request;