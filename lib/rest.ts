
import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
const auth = window.btoa(`admin:geoserver`)
const restXhrConfig = {
    headers: { Authorization: `Basic ${auth}` },
}
import { type ILayer } from "./interface/layer"
export type { ILayer } from './interface/layer';
export default class restHelper {
    url: string = "";
    layer: string = "";
    srsName: string = "EPSG:4326";
    workspace: string = "";
    constructor(
        options?:
            | {
                url: string;
                layer?: string;
                srsName?: string;
                workspace?: string;
            }
            | undefined,
    ) {
        if (!options) return;
        this.url = options.url;
        this.layer = options.layer || "";
        this.srsName = options.srsName || "EPSG:4326";
        this.workspace = options.workspace || "";
    }
    /*************************************************图层相关**************************************************** */
    /**
     * @description: 获取图层列表
     * @param {string} workspaceName 工作空间名称，空的话则返回所有
     * @return {*}
     */
    getLayersListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers` : `${this.url}/rest/layers`
        return fetchUtil.get<ILayer.ResLayerList>(queryUrl, restXhrConfig)
    }

    /**
     * @description: 获取单个图层详情
     * @param {string} layerNameWithWorkspace
     * @return {Promise}
     */
    getLayerInfoApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ResLayerInfo>(`${this.url}/rest/layers/${realLayerNameWithWorkspace}`, restXhrConfig)
    }

    /**
     * @description: 编辑/更新图层
     * @param {string} layerName 图层名
     * @param {ILayer} layerBody 
     * @param {string} workspaceName
     * @return {*}
     */
    modifyLayerApi(layerName: string, layerBody: ILayer.LayerModifyInfo, workspaceName?: string) {
        const putUrl = workspaceName ? `/rest/workspaces/${workspaceName}/layers/${layerName}` : `/rest/layers/${layerName}`
        return fetchUtil.put<ILayer.ResLayerInfo>(putUrl, { layer: layerBody }, restXhrConfig)
    }

    // * 获取图层源详情
    getLayerSourceInfoByHrefApi(sourceInfoHref: string) {
        return fetchUtil.get<ILayer.LayerSourceDetailInfo>(sourceInfoHref, restXhrConfig)
    }

    // * 获取rest图层切片任务详情
    getLayerCacheTasksApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ILayerCacheTasks>(`${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}.json`, restXhrConfig)
    }

    /**
     * @description: 发起rest图层切片任务
     * @param {string} operationType 操作类型
     * @param {string} layerNameWithWorkspace 图层名
     * @return {Promise}
     */
    sendLayerCacheTaskApi(operationType: string, layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
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
                name: realLayerNameWithWorkspace,
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
            `${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}.json`,
            operationType == 'kill_all' ? formData : seedOption,
            restXhrConfig,
        )
    }

    // * 关闭rest图层切片任务
    clostLayerCacheTaskApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        const tempHeadersConfig = Object.assign({ 'Content-Type': 'application/javascript' }, restXhrConfig.headers)
        const tempXhrConfig = Object.assign(restXhrConfig, {
            headers: tempHeadersConfig,
        })
        return fetchUtil.post<ILayer.ILayerCacheTasks>(
            `${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}`,
            'kill_all=all' as any,
            tempXhrConfig,
        )
    }
}
