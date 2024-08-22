
import fetchUtil from './utils/fetch'
const auth = window.btoa(`admin:geoserver`)
const restXhrConfig = {
    headers: { Authorization: `Basic ${auth}` },
}
import { type ILayer } from "./interface/layer"
import { type IWorkspace } from "./interface/workspace"
import { INamespaces } from "./interface/namespaces";
export type { ILayer } from './interface/layer';
export type { IWorkspace } from './interface/workspace';
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
    /*************************************************图层相关start**************************************************** */
    /**
     * @description: 获取图层列表
     * @param {string} workspaceName 工作空间名称，空的话则返回所有
     * @return {*}
     */
    getLayerListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers` : `${this.url}/rest/layers`
        return fetchUtil.get<ILayer.ResLayerList>(queryUrl, {}, restXhrConfig)
    }

    /**
     * @description: 获取单个图层详情
     * @param {string} layerNameWithWorkspace
     * @return {Promise}
     */
    getLayerInfoApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ResLayerInfo>(`${this.url}/rest/layers/${realLayerNameWithWorkspace}`, {}, restXhrConfig)
    }

    /**
     * @description: 编辑/更新图层
     * @param {string} layerName 图层名
     * @param {ILayer} layerBody 
     * @param {string} workspaceName
     * @return {Promise<string>}
     */
    modifyLayerApi(layerName: string, layerBody: ILayer.LayerModifyInfo, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers/${layerName}` : `${this.url}/rest/layers/${layerName}`
        return fetchUtil.put<string>(putUrl, { layer: layerBody }, restXhrConfig)
    }

    /**
     * @description: 获取图层源详情
     * @param {string} sourceInfoHref
     * @return {Promise<ILayer.LayerSourceDetailInfo>}
     */
    getLayerSourceInfoByHrefApi(sourceInfoHref: string) {
        return fetchUtil.get<ILayer.LayerSourceDetailInfo>(sourceInfoHref, {}, restXhrConfig)
    }

    /**
     * @description: 获取图层切片任务详情
     * @param {string} layerNameWithWorkspace
     * @return {Promise<ILayer.ILayerCacheTasks>}
     */
    getLayerCacheTasksApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ILayerCacheTasks>(`${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}.json`, {}, restXhrConfig)
    }

    /**
     * @description: 发起rest图层切片任务
     * @param {string} operationType 操作类型
     * @param {string} layerNameWithWorkspace 图层名
     * @return {Promise<ILayer.ILayerCacheTasks>}
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

    /**
     * @description: 关闭图层切片任务
     * @param {string} layerNameWithWorkspace 图层名
     * @return {Promise<string>}
     */
    clostLayerCacheTaskApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        const tempHeadersConfig = Object.assign({ 'Content-Type': 'application/javascript' }, restXhrConfig.headers)
        const tempXhrConfig = Object.assign(restXhrConfig, {
            headers: tempHeadersConfig,
        })
        return fetchUtil.post<string>(
            `${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}`,
            'kill_all=all' as any,
            tempXhrConfig,
        )
    }
    /*************************************************图层相关end**************************************************** */
    /*************************************************工作空间相关start**************************************************** */
    // * 获取工作空间列表
    getWorkspaceListApi() {
        return fetchUtil.get<IWorkspace.WorkspaceList>(`${this.url}/rest/workspaces.json`, {}, restXhrConfig)
    }

    /**
     * @description: 获取单个工作空间详情
     * @param {string} layerNameWithWorkspace 工作空间名称
     * @return {Promise<IWorkspace.WorkspaceInfo>}
     */
    getWorkspaceInfoApi(workspaceName?: string) {
        return fetchUtil.get<IWorkspace.WorkspaceInfo>(`${this.url}/rest/workspaces/${workspaceName}`, {}, restXhrConfig)
    }

    /**
     * @description: 新增工作空间
     * @param {IWorkspace.WorkspaceOperationForm} body 新增的参数
     * @return {Promise<string>}
     */
    addWorkspaceApi(body: IWorkspace.WorkspaceOperationForm) {
        let postUrl = `${this.url}/rest/workspaces`
        if (body.default) {
            postUrl += `?default=${body.default}`
        }
        if (Object.hasOwnProperty.call(body, 'default')) {
            delete body.default
        }
        return fetchUtil.post<string>(postUrl, { workspace: body }, restXhrConfig)
    }
    /**
     * @description: 更新工作空间
     * @param {string} orignWorkspaceName 原工作空间名称
     * @param {IWorkspace.WorkspaceOperationForm} body 更新的参数
     * @return {Promise<string>}
     */
    updateWorkspaceApi(orignWorkspaceName: string, body: IWorkspace.WorkspaceOperationForm) {
        return fetchUtil.put<string>(`${this.url}/rest/workspaces/${orignWorkspaceName}`, { workspace: body }, restXhrConfig)
    }

    /**
     * @description: 删除工作空间
     * @param {string} workspaceName 工作空间名称
     * @return {Promise<string>}
     */
    deleteWorkspaceApi(workspaceName: string) {
        return fetchUtil.delete<string>(`${this.url}/rest/workspaces/${workspaceName}`, {}, restXhrConfig)
    }
    /*************************************************工作空间相关end**************************************************** */
    /*************************************************命名空间相关start**************************************************** */
    /**
     * @description: 获取命名空间详情
     * @param {string} namespaceName 命名空间名称（一般和工作空间名称相同）
     * @return {Promise<INamespaces.NamespaceInfo>}
     */
    getNamespacesInfoApi(namespaceName: string) {
        return fetchUtil.get<INamespaces.NamespaceInfo>(`${this.url}/rest/namespaces/${namespaceName}`, {}, restXhrConfig)
    }
    /*************************************************命名空间相关end**************************************************** */
}
