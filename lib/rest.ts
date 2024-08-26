
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
    /**
     * geoserver地址
     */
    url: string = "";
    /**
     * 图层名称
     */
    layer: string = "";
    /**
     * SRS名称
     */
    srsName: string = "EPSG:4326";
    /**
     * 工作空间名称
     */
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
     * 获取图层列表
     * @param {string} workspaceName 工作空间名称，空的话则返回所有
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *  url: "/geoserver"
     *  })
     * restHelperInstance.getLayerListApi().then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {*}
     */
    getLayerListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers` : `${this.url}/rest/layers`
        return fetchUtil.get<ILayer.ResLayerList>(queryUrl, {}, restXhrConfig)
    }

    /**
     * 获取单个图层详情
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *  url: "/geoserver"
     *  })
     * restHelperInstance.getLayerInfoApi("qhd:xzqh_shi").then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {Promise}
     */
    getLayerInfoApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ResLayerInfo>(`${this.url}/rest/layers/${realLayerNameWithWorkspace}`, {}, restXhrConfig)
    }

    /**
     * @description: 编辑/更新图层
     * @param {string} layerName 图层名
     * @param {ILayer} layerBody 编辑/更新信息
     * @param {string} workspaceName 工作空间名称
     * @return {Promise<string>}
     */
    modifyLayerApi(layerName: string, layerBody: ILayer.LayerModifyInfo, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers/${layerName}` : `${this.url}/rest/layers/${layerName}`
        return fetchUtil.put<string>(putUrl, { layer: layerBody }, restXhrConfig)
    }

    /**
     * @description: 获取图层源详情
     * @param {string} sourceInfoHref URL of the source
     * @return {Promise<ILayer.LayerSourceDetailInfo>}
     */
    getLayerSourceInfoByHrefApi(sourceInfoHref: string) {
        return fetchUtil.get<ILayer.LayerSourceDetailInfo>(sourceInfoHref, {}, restXhrConfig)
    }

    /**
     * @description: 获取图层切片任务详情
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
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
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
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
    /**
     * @description:获取工作空间列表 
     * @example
    * ``` typescript
    * restHelperInstance.getWorkspaceListApi().then(res => {
    *  console.log(res)
    * })
    * ```
     * @return {*}
     */
    getWorkspaceListApi() {
        return fetchUtil.get<IWorkspace.WorkspaceList>(`${this.url}/rest/workspaces.json`, {}, restXhrConfig)
    }

    /**
     * 获取单个工作空间详情
     * @param workspaceName 工作空间名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *  url: "/geoserver"
     *  })
     * restHelperInstance.getWorkspaceInfoApi("qhd").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
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
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *  url: "/geoserver"
     *  })
     * restHelperInstance.getNamespacesInfoApi("qhd").then(res => {
     *  console.log(res)
     * })
     * @return {Promise<INamespaces.NamespaceInfo>}
     */
    getNamespacesInfoApi(namespaceName: string) {
        return fetchUtil.get<INamespaces.NamespaceInfo>(`${this.url}/rest/namespaces/${namespaceName}`, {}, restXhrConfig)
    }

    /*************************************************命名空间相关end**************************************************** */
    /*************************************************样式相关start**************************************************** */

    getStylesListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles` : `${this.url}/rest/styles`
        return fetchUtil.get<Styles.ResStyleList>(queryUrl, {}, restXhrConfig)
    }

    /**
     * 获取样式的xld字符串
     * @param {string} styleName 样式名称
     * @param {string} workspaceName 工作空间
     * @return {*}
     */
    getSldStyleApi(styleName: string, workspaceName?: string) {
        const queryUrl = workspaceName
            ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}.sld`
            : `${this.url}/rest/styles/${styleName}.sld`
        return fetchUtil.get<string>(queryUrl, {}, restXhrConfig)
    }

    /**
     * 添加样式
     * @param body 样式的sld字符串
     * @param styleName 样式名称
     * @param workspaceName 工作空间名称
     * @returns 
     */
    addStyleApi(body: any, styleName: string, workspaceName?: string) {
        const postUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles?name=${styleName}` : `${this.url}/rest/styles?name=${styleName}`
        const tempHeadersConfig = Object.assign(restXhrConfig.headers, { 'Content-Type': 'application/vnd.ogc.sld+xml' })
        const tempXhrConfig = Object.assign(restXhrConfig, {
            headers: tempHeadersConfig,
        })
        return fetchUtil.post<string>(postUrl, body, tempXhrConfig)
    }
    /**
     * 更新样式
     * @param body 样式的sld字符串
     * @param styleName 原样式名称
     * @param newStyleName 新样式名称
     * @param workspaceName 工作空间名称
     * @returns 
     */
    updateStyleApi(body: any, styleName: string, newStyleName?: string, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}?style=${newStyleName || styleName}` : `${this.url}/rest/styles/${styleName}?style=${newStyleName || styleName}`
        const tempHeadersConfig = Object.assign(restXhrConfig.headers, { 'Content-Type': 'application/vnd.ogc.sld+xml' })
        const tempXhrConfig = Object.assign(restXhrConfig, {
            headers: tempHeadersConfig,
        })
        return fetchUtil.put<string>(putUrl, body, tempXhrConfig)
    }

    /**
     * 删除样式
     * @param {string} styleName 样式名称
     * @param {string} workspaceName 工作空间名称
     * @return {*}
     */
    deleteStyleApi(styleName: string, workspaceName: string) {
        const deleteUrl = workspaceName
            ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}`
            : `${this.url}/rest/styles/${styleName}`
        return fetchUtil.delete<string>(deleteUrl, {}, restXhrConfig)
    }
    /*************************************************命名空间相关end**************************************************** */
}
