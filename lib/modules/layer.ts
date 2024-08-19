import { ILayer } from '../interface/layer'
import fetchUtil from '../utils/fetch'
const auth = window.btoa(`admin:geoserver`)
const restXhrConfig = {
    headers: { noLoading: false, geoserverRest: true, Authorization: `Basic ${auth}` },
}

// * 获取rest图层详情
export const getLayerInfoApi = (layerNameWithWorkspace: string) => {
    return fetchUtil.get<ILayer.ResLayerInfo>(`/rest/layers/${layerNameWithWorkspace}`)
}

// * 编辑/更新图层
// export const modifyLayerApi = (layerName: string, layerBody: ILayer.LayerModifyInfo, workspaceName?: string) => {
//     const putUrl = workspaceName ? `/rest/workspaces/${workspaceName}/layers/${layerName}` : `/rest/layers/${layerName}`
//     return fetchUtil.put<ILayer.ResLayerInfo>(putUrl, { layer: layerBody }, restXhrConfig)
// }

// * 获取图层源详情
export const getLayerSourceInfoByHrefApi = (sourceInfoHref: string) => {
    return fetchUtil.get<ILayer.LayerSourceDetailInfo>(sourceInfoHref)
}

// * 获取rest图层切片任务详情
export const getLayerCacheTasksApi = (layerNameWithWorkspace: string) => {
    return fetchUtil.get<ILayer.ILayerCacheTasks>(`/gwc/rest/seed/${layerNameWithWorkspace}.json`)
}

// * 发起rest图层切片任务
export const sendLayerCacheTaskApi = (layerNameWithWorkspace: string, operationType: string) => {
    interface ISeedOption {
        seedRequest?: {
            name?: string
            zoomStart?: number
            zoomStop?: number
            type?: string
            threadCount?: number
        }
        kill_all?: string
    }
    const seedOption: ISeedOption = {
        seedRequest: {
            name: layerNameWithWorkspace,
            zoomStart: 0,
            zoomStop: 15,
            type: operationType,
            threadCount: 1,
        },
    }
    const formData = new FormData()
    if (operationType == 'kill_all') {
        formData.append('kill_all', 'all')
        // seedOption = {
        //     kill_all: 'all',
        // }
    }

    return fetchUtil.post<ILayer.ILayerCacheTasks>(
        `/gwc/rest/seed/${layerNameWithWorkspace}.json`,
        operationType == 'kill_all' ? formData : seedOption,
        restXhrConfig,
    )
}

// * 关闭rest图层切片任务
export const clostLayerCacheTaskApi = (layerNameWithWorkspace: string) => {
    const tempHeadersConfig = Object.assign({ 'Content-Type': 'application/javascript' }, restXhrConfig.headers)
    const tempXhrConfig = Object.assign(restXhrConfig, {
        headers: tempHeadersConfig,
    })
    return fetchUtil.post<ILayer.ILayerCacheTasks>(
        `/gwc/rest/seed/${layerNameWithWorkspace}`,
        'kill_all=all' as any,
        tempXhrConfig,
    )
}
