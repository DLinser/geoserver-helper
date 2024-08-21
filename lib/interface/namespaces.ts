// * 工作空间模块
export namespace INamespaces {
    //返回命名空间结果
    export interface NamespaceInfo {
        namespace: {
            prefix: string
            uri: string
            featureTypes: string
        }
    }
}
