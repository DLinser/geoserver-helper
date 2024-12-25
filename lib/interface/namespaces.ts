/*
命名空间模块
*/
export namespace INamespaces {
    //命名空间详情
    export interface NamespaceInfo {
        prefix: string
        uri: string
        featureTypes: string
    }
    //返回命名空间结果
    export interface NamespaceInfoRes {
        namespace: NamespaceInfo
    }
}
