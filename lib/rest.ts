
import fetchUtil from './utils/fetch'
import { type ILayer } from "./interface/layer"
import { type IWorkspace } from "./interface/workspace"
import { type INamespaces } from "./interface/namespaces";
import { type IStyle } from './interface/style'
import { type IDatastore } from './interface/datastore'
import { ISystem } from './interface/system';
import { IResource } from './interface/resource';
import { ISecurity } from './interface/security';
export default class restHelper {
    private restXhrConfig: Record<string, any> = {
        headers: {},
    }
    /**
     * @internal
     * geoserver地址
     */
    url: string = "";
    /**
     * @internal
     * geoserver用户名
     */
    userName: string = "";
    /**
     * @internal
    * geoserver密码
    */
    password: string = "";
    /**
     * @internal
     * 图层名称
     */
    layer: string = "";
    /**
     * @internal
     * SRS名称
     */
    srsName: string = "EPSG:4326";
    /**
     * @internal
     * 工作空间名称
     */
    workspace: string = "";
    /**
     * @internal
     * @param options 
     * @returns 
     */
    constructor(
        options:
            {
                /**
                 * server 地址
                 */
                url: string;
                /**
                 * 用户名（不传用户名密码的话就不会携带Authorization头）
                 */
                userName?: string;
                /**
                 * 密码（不传用户名密码的话就不会携带Authorization头）
                 */
                password?: string;
                layer?: string;
                srsName?: string;
                workspace?: string;
            }
    ) {
        if (!options) return;
        this.url = options.url;
        this.userName = options.userName || "";
        this.password = options.password || "";
        this.layer = options.layer || "";
        this.srsName = options.srsName || "EPSG:4326";
        this.workspace = options.workspace || "";
        if (this.userName && this.password) {
            const auth = window.btoa(`${this.userName}:${this.password}`)
            this.restXhrConfig = {
                headers: { Authorization: `Basic ${auth}` },
            }
        }
    }
    /*************************************************系统相关start**************************************************** */

    /**
     * 获取系统状态(包括磁盘状态，cpu状态等)
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getSystemStatus().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getSystemStatus() {
        return fetchUtil.get<ISystem.Status>(`${this.url}/rest/about/system-status.json`, {}, this.restXhrConfig)
    }
    /**
     * 获取版本信息（包括Geoserver、Geotools、GeoWebCache）
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getVersion().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getVersion() {
        return fetchUtil.get<ISystem.Version>(`${this.url}/rest/about/version.json`, {}, this.restXhrConfig)
    }
    /**
     * 获取支持的字体列表
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getFonts().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getFonts() {
        return fetchUtil.get<ISystem.Fonts>(`${this.url}/rest/fonts`, {}, this.restXhrConfig)
    }

    /**
     * 获取日志配置
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getLoggingConfig().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
    */
    getLoggingConfig() {
        return fetchUtil.get<ISystem.LogConfiguration>(`${this.url}/rest/logging.json`, {}, this.restXhrConfig)
    }
    /**
     * 更新（编辑）日志配置
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.updateLoggingConfig({
     *   "logging": {
     *      "level": "PRODUCTION_LOGGING",
     *      "location": "logs/geoserver.log",
     *      "stdOutLogging": true
     *   }
     *  }).then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    updateLoggingConfig(config: ISystem.LogConfiguration) {
        return fetchUtil.put<string>(`${this.url}/rest/logging`, config, this.restXhrConfig)
    }

    /**
     * 从磁盘重新加载配置，并重置所有缓存。
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.reload().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    reload() {
        return fetchUtil.post<string>(
            `${this.url}/rest/reload`,
            {},
            this.restXhrConfig,
        )
    }

    /**
     * 重置所有身份验证、存储、栅格和架构缓存(请谨慎调用)。
     * @group 系统
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.reset().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    reset() {
        return fetchUtil.post<string>(
            `${this.url}/rest/reset`,
            {},
            this.restXhrConfig,
        )
    }

    /*************************************************系统相关end**************************************************** */
    /*************************************************文件资源相关start**************************************************** */


    /**
     * 获取资源目录信息（geoserver安装目录的data_dir下的文件夹信息）
     * @group 文件资源
     * @param relativePath 相对于data_dir的路径 默认为空字符串
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getResourceDirectoryInfo().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getResourceDirectoryInfo(relativePath: string = '') {
        return fetchUtil.get<IResource.IDirectoryInfo>(`${this.url}/rest/resource${relativePath}?format=json`, {}, this.restXhrConfig)
    }

    /**
     * 创建资源（只能是文本文件,如果文件存在则会覆盖）
     * @group 文件资源
     * @param relativePath 要创建的文件路径（相对于data_dir的路径）
     * @param stringData 文本内容
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.creatResource("/test.txt","Hellow World").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    creatResource(relativePath: string, stringData: string) {
        return fetchUtil.put<string>(`${this.url}/rest/resource${relativePath}?operation=default`, stringData, this.restXhrConfig)
    }

    /**
     * 复制资源（只能是文件不能是目录）
     * @group 文件资源
     * @param newPath 新文件路径（相对于data_dir的路径）
     * @param orignPath 原始路径（相对于data_dir的路径）
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.copyResource("/test.txt","/test2.txt").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    copyResource(newPath: string, orignPath: string) {
        return fetchUtil.put<string>(`${this.url}/rest/resource${newPath}?operation=copy`, orignPath, this.restXhrConfig)
    }

    /**
     * 移动资源（只能是文件不能是目录）
     * @group 文件资源
     * @param newPath 新文件路径（相对于data_dir的路径）
     * @param orignPath 原始路径（相对于data_dir的路径）
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.moveResource("/testData/test.txt","/testData2/test.txt").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    moveResource(newPath: string, orignPath: string) {
        return fetchUtil.put<string>(`${this.url}/rest/resource${newPath}?operation=move`, orignPath, this.restXhrConfig)
    }

    /**
     * 删除资源或目录（如果是目录则会递归删除）
     * @group 文件资源
     * @param relativePath 要删除的目录或者文件路径（相对于data_dir的路径）
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.deleteResource("/relativePath").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    deleteResource(relativePath: string) {
        return fetchUtil.delete<string>(`${this.url}/rest/resource${relativePath}`, {}, this.restXhrConfig)
    }

    /*************************************************文件资源相关end**************************************************** */
    /*************************************************安全相关start**************************************************** */

    /**
     * 获取超级管理员密码
     * @group 安全
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getMasterPassword().then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getMasterPassword() {
        return fetchUtil.get<ISecurity.MasterPassword>(`${this.url}/rest/security/masterpw.json`, {}, this.restXhrConfig)
    }

    /**
     * 获取角色列表
     * @group 安全
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getRoles().then(res => {
     *  console.log(res)
     * })
     * ```
     * */
    getRoles() {
        return fetchUtil.get<ISecurity.Roles>(`${this.url}/rest/security/roles.json`, {}, this.restXhrConfig)
    }

    /**
     * 更新（编辑）超级管理员密码
     * @group 安全
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.updateMasterPassword({
     *   "oldMasterPassword": "geoserver",
     *   "newMasterPassword": "geoserver2"
     *  }).then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    updateMasterPassword(updateForm: ISecurity.MasterPasswordUpdateForm) {
        return fetchUtil.put<string>(`${this.url}/rest/logging`, updateForm, this.restXhrConfig)
    }

    /**
    * 获取基于图层的安全校验规则
    * @group 安全
    * @example
    * ``` typescript
    * const restHelperInstance = new restHelper({
    *      url: "/geoserver"
    *      userName: "admin",
    *      password: "geoserver",
    *  })
    * restHelperInstance.getSecurityRulesOfLayersBased().then(res => {
    *  console.log(res)
    * })
    * ```
    * @returns 
    */
    getSecurityRulesOfLayersBased() {
        return fetchUtil.get<ISecurity.SecurityRules>(`${this.url}/rest/security/acl/layers.json`, {}, this.restXhrConfig)
    }

    /*************************************************安全相关end**************************************************** */
    /*************************************************图层相关start**************************************************** */

    /**
     * 获取图层列表
     * @group 图层
     * @param {string} workspaceName 工作空间名称，空的话则返回所有
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getLayerListApi().then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {*}
     */
    getLayerListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers` : `${this.url}/rest/layers`
        return fetchUtil.get<ILayer.ResLayerList>(queryUrl, {}, this.restXhrConfig)
    }

    /**
     * 获取单个图层详情
     * @group 图层
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getLayerInfoApi("qhd:xzqh_shi").then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {Promise}
     */
    getLayerInfoApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.ResLayerInfo>(`${this.url}/rest/layers/${realLayerNameWithWorkspace}`, {}, this.restXhrConfig)
    }

    /**
     * 编辑/更新图层
     * @group 图层
     * @param {string} layerName 图层名
     * @param {ILayer} layerBody 编辑/更新信息
     * @param {string} workspaceName 工作空间名称
     * @return {Promise<string>}
     */
    modifyLayerApi(layerName: string, layerBody: ILayer.LayerModifyInfo, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layers/${layerName}` : `${this.url}/rest/layers/${layerName}`
        return fetchUtil.put<string>(putUrl, { layer: layerBody }, this.restXhrConfig)
    }

    /**
     * 获取图层源详情
     * @group 图层
     * @param {string} sourceInfoHref URL of the source
     * @return {Promise<ILayer.LayerSourceDetailInfo>}
     */
    getLayerSourceInfoByHrefApi(sourceInfoHref: string) {
        return fetchUtil.get<ILayer.LayerSourceDetailInfo>(sourceInfoHref, {}, this.restXhrConfig)
    }

    /**
     * 获取图层切片任务详情
     * @group 图层
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
     * @return {Promise<ILayer.LayerCacheTasks>}
     */
    getLayerCacheTasksApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        return fetchUtil.get<ILayer.LayerCacheTasks>(`${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}.json`, {}, this.restXhrConfig)
    }

    /**
     * 发起rest图层切片任务
     * @group 图层
     * @param  seedRequestOption 参数配置
     * @example
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.sendLayerCacheTaskApi({
     *     name: "workspace:layername",
     *     zoomStart: 0,
     *     zoomStop: 15,
     *     type: "seed",
     *     threadCount: 1,
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<string>} 只要请求的状态码是200就说明成功了 返回的是个空字符串
     */
    sendLayerCacheTaskApi(seedRequestOption: ILayer.SeedRequest) {
        const realLayerNameWithWorkspace = seedRequestOption.name ? seedRequestOption.name : this.workspace ? `${this.workspace}:${this.layer}` : `${this.layer}`;
        interface ISeedOption {
            seedRequest?: ILayer.SeedRequest
        }
        const defaultSeedOption: ISeedOption = {
            seedRequest: {
                name: realLayerNameWithWorkspace,
                zoomStart: 0,
                zoomStop: 15,
                type: "seed",
                threadCount: 1,
            },
        }
        const seedOption = Object.assign(defaultSeedOption, { seedRequest: seedRequestOption })
        return fetchUtil.post<string>(
            `${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}.json`,
            seedOption,
            this.restXhrConfig,
        )
    }

    /**
     * 关闭图层切片任务
     * @group 图层
     * @param {string} layerNameWithWorkspace 图层名（为空时默认使用构造函数中的图层名称）
     * @example
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.clostLayerCacheTaskApi("workspace:layername").then(res => {
     *   console.log(res)
     * })
     * @return {Promise<string>}
     */
    clostLayerCacheTaskApi(layerNameWithWorkspace?: string) {
        const realLayerNameWithWorkspace = layerNameWithWorkspace ? layerNameWithWorkspace : `${this.workspace}:${this.layer}`
        const tempHeadersConfig = Object.assign({ 'Content-Type': 'application/javascript' }, JSON.parse(JSON.stringify(this.restXhrConfig.headers)))
        const tempXhrConfig = Object.assign(this.restXhrConfig, {
            headers: tempHeadersConfig,
        })
        return fetchUtil.post<string>(
            `${this.url}/gwc/rest/seed/${realLayerNameWithWorkspace}`,
            'kill_all=all' as any,
            tempXhrConfig,
        )
    }
    /*************************************************图层相关end**************************************************** */
    /*************************************************图层组相关start**************************************************** */
    /**
     * 获取图层组列表
     * @group 图层组
     * @example
    * ```typescript
    * import restHelper from 'geoserver-helper/rest'
    * const restHelperInstance = new restHelper({
    *      url: "/geoserver",
    *      userName: "admin",
    *      password: "geoserver",
    * })
    * restHelperInstance.getLayerGroupListApi().then(res => {
    *  console.log(res)
    * })
    * ```
     * @return {Promise<IWorkspace.LayerGroupList>}
     */
    getLayerGroupListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/workspaceName/layergroups.json` : `${this.url}/rest/layergroups.json`
        return fetchUtil.get<ILayer.ResLayerGroupList>(queryUrl, {}, this.restXhrConfig)
    }

    /**
     * 获取图层组详情
     * @group 图层组
     * @param layergroupName 图层组名称
     * @param workspaceName 工作空间名称
     * @example
     * ```typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     * })
     * restHelperInstance.getLayerGroupInfoApi("layergroupName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getLayerGroupInfoApi(layergroupName: string, workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layergroups/${layergroupName}.json` : `${this.url}/rest/layergroups/${layergroupName}.json`
        return fetchUtil.get<ILayer.ResLayerGroupInfo>(queryUrl, {}, this.restXhrConfig)
    }

    /**
     * 编辑/更新图层
     * @group 图层组
     * @param  layergroupName 图层组名
     * @param  layerGroupBody 编辑/更新信息
     * @param workspaceName 工作空间名称
     * @return {Promise<string>}
     */
    modifyLayerGroupApi(layergroupName: string, layerGroupBody: ILayer.LayerGroupModifyInfo, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layergroups/${layergroupName}` : `${this.url}/rest/layergroups/${layergroupName}`
        return fetchUtil.put<string>(putUrl, { layerGroup: layerGroupBody }, this.restXhrConfig)
    }

    /**
     * 删除图层组
     * @group 图层组
     * @param layergroupName 图层组名称
     * @param workspaceName 工作空间名称
     * @example
     * ```typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver",
     *      userName: "admin",
     *      password: "geoserver",
     * })
     * restHelperInstance.deleteLayerGroupApi("layergroupName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    deleteLayerGroupApi(layergroupName: string, workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/layergroups/${layergroupName}.json` : `${this.url}/rest/layergroups/${layergroupName}.json`
        return fetchUtil.delete<ILayer.ResLayerGroupInfo>(queryUrl, {}, this.restXhrConfig)
    }

    /*************************************************图层组相关end**************************************************** */
    /*************************************************工作空间相关start**************************************************** */
    /**
     * 获取工作空间列表 
     * @group 工作空间
     * @example
    * ``` typescript
    * import restHelper from 'geoserver-helper/rest'
    * const restHelperInstance = new restHelper({
    *      url: "/geoserver",
    *      userName: "admin",
    *      password: "geoserver",
    * })
    * restHelperInstance.getWorkspaceListApi().then(res => {
    *  console.log(res)
    * })
    * ```
     * @return {*}
     */
    getWorkspaceListApi() {
        return fetchUtil.get<IWorkspace.WorkspaceList>(`${this.url}/rest/workspaces.json`, {}, this.restXhrConfig)
    }

    /**
     * 获取单个工作空间详情
     * @group 工作空间
     * @param workspaceName 工作空间名称
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *     url: "/geoserver",
     *     userName: "admin",
     *     password: "geoserver",
     *  })
     * restHelperInstance.getWorkspaceInfoApi("qhd").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getWorkspaceInfoApi(workspaceName?: string) {
        return fetchUtil.get<IWorkspace.WorkspaceInfo>(`${this.url}/rest/workspaces/${workspaceName}`, {}, this.restXhrConfig)
    }

    /**
     * 新增工作空间
     * @group 工作空间
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
        return fetchUtil.post<string>(postUrl, { workspace: body }, this.restXhrConfig)
    }
    /**
     * 更新工作空间
     * @group 工作空间
     * @param {string} orignWorkspaceName 原工作空间名称
     * @param {IWorkspace.WorkspaceOperationForm} body 更新的参数
     * @return {Promise<string>}
     */
    updateWorkspaceApi(orignWorkspaceName: string, body: IWorkspace.WorkspaceOperationForm) {
        return fetchUtil.put<string>(`${this.url}/rest/workspaces/${orignWorkspaceName}`, { workspace: body }, this.restXhrConfig)
    }

    /**
     * 删除工作空间
     * @group 工作空间
     * @param {string} workspaceName 工作空间名称
     * @return {Promise<string>}
     */
    deleteWorkspaceApi(workspaceName: string) {
        return fetchUtil.delete<string>(`${this.url}/rest/workspaces/${workspaceName}`, {}, this.restXhrConfig)
    }
    /*************************************************工作空间相关end**************************************************** */
    /*************************************************命名空间相关start**************************************************** */
    /**
     * 获取命名空间详情
     * @group 命名空间
     * @param {string} namespaceName 命名空间名称（一般和工作空间名称相同）
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *     url: "/geoserver",
     *     userName: "admin",
     *     password: "geoserver",
     *  })
     * restHelperInstance.getNamespacesInfoApi("qhd").then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {Promise<INamespaces.NamespaceInfo>}
     */
    getNamespacesInfoApi(namespaceName: string) {
        return fetchUtil.get<INamespaces.NamespaceInfo>(`${this.url}/rest/namespaces/${namespaceName}`, {}, this.restXhrConfig)
    }

    /*************************************************命名空间相关end**************************************************** */
    /*************************************************样式相关start**************************************************** */

    /**
     * 获取样式列表
     * @group 样式
     * @param workspaceName 工作空间名称
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *     url: "/geoserver",
     *     userName: "admin",
     *     password: "geoserver",
     * })
     * restHelperInstance.getStylesListApi("workspaceName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getStylesListApi(workspaceName?: string) {
        const queryUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles` : `${this.url}/rest/styles`
        return fetchUtil.get<IStyle.StyleList>(queryUrl, {}, this.restXhrConfig)
    }

    /**
     * 获取样式的xld字符串
     * @group 样式
     * @param {string} styleName 样式名称
     * @param {string} workspaceName 工作空间
     * @return {*}
     */
    getSldStyleApi(styleName: string, workspaceName?: string) {
        const queryUrl = workspaceName
            ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}.sld`
            : `${this.url}/rest/styles/${styleName}.sld`
        return fetchUtil.get<string>(queryUrl, {}, this.restXhrConfig)
    }

    /**
     * 添加样式
     * @group 样式
     * @param body 样式的sld字符串
     * @param styleName 样式名称
     * @param workspaceName 工作空间名称
     * @returns 
     */
    addStyleApi(body: any, styleName: string, workspaceName?: string) {
        const postUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles?name=${styleName}` : `${this.url}/rest/styles?name=${styleName}`
        const tempHeadersConfig = Object.assign(JSON.parse(JSON.stringify(this.restXhrConfig.headers)), { 'Content-Type': 'application/vnd.ogc.sld+xml' })
        const tempXhrConfig = Object.assign(JSON.parse(JSON.stringify(this.restXhrConfig)), {
            headers: tempHeadersConfig,
        })
        return fetchUtil.post<string>(postUrl, body, tempXhrConfig)
    }
    /**
     * 更新样式
     * @group 样式
     * @param body 样式的sld字符串
     * @param styleName 原样式名称
     * @param newStyleName 新样式名称
     * @param workspaceName 工作空间名称
     * @returns 
     */
    updateStyleApi(body: any, styleName: string, newStyleName?: string, workspaceName?: string) {
        const putUrl = workspaceName ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}?style=${newStyleName || styleName}` : `${this.url}/rest/styles/${styleName}?style=${newStyleName || styleName}`
        const tempHeadersConfig = Object.assign(JSON.parse(JSON.stringify(this.restXhrConfig.headers)), { 'Content-Type': 'application/vnd.ogc.sld+xml' })
        const tempXhrConfig = Object.assign(JSON.parse(JSON.stringify(this.restXhrConfig)), {
            headers: tempHeadersConfig,
        })
        return fetchUtil.put<string>(putUrl, body, tempXhrConfig)
    }

    /**
     * 删除样式
     * @group 样式
     * @param {string} styleName 样式名称
     * @param {string} workspaceName 工作空间名称
     * @example
     * ``` typescript
     * import restHelper from 'geoserver-helper/rest'
     * const restHelperInstance = new restHelper({
     *     url: "/geoserver",
     *     userName: "admin",
     *     password: "geoserver",
     * })
     * restHelperInstance.deleteStyleApi("styleName","workspaceName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @return {*}
     */
    deleteStyleApi(styleName: string, workspaceName: string) {
        const deleteUrl = workspaceName
            ? `${this.url}/rest/workspaces/${workspaceName}/styles/${styleName}`
            : `${this.url}/rest/styles/${styleName}`
        return fetchUtil.delete<string>(deleteUrl, {}, this.restXhrConfig)
    }
    /*************************************************样式相关end**************************************************** */
    /*************************************************数据存储相关start**************************************************** */
    /**
     * 获取矢量数据存储列表
     * @group 数据存储
     * @param workspaceName 工作空间名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getDatastoreListApi("workspace").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getDatastoreListApi(workspaceName: string) {
        return fetchUtil.get<IDatastore.ResDatastoreList>(`${this.url}/rest/workspaces/${workspaceName}/datastores`, {}, this.restXhrConfig)
    }
    /**
     * 获取栅格数据存储列表
     * @group 数据存储
     * @param workspaceName 工作空间名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getCoveragestoresListApi("workspace").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getCoveragestoresListApi(workspaceName: string) {
        return fetchUtil.get<IDatastore.ResCoveragestoreList>(`${this.url}/rest/workspaces/${workspaceName}/coveragestores`, {}, this.restXhrConfig)
    }

    /**
     * 获取单个矢量数据存储详情
     * @group 数据存储
     * @param workspaceName 工作空间名称
     * @param datastoreName 存储名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getDatastoreInfoApi("workspaceName","datastoreName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getDatastoreInfoApi(workspaceName: string, datastoreName: string) {
        return fetchUtil.get<IDatastore.ResDatastoreInfo>(
            `${this.url}/rest/workspaces/${workspaceName}/datastores/${datastoreName}`,
            {},
            this.restXhrConfig,
        )
    }
    /**
     * 获取单个栅格数据存储详情
     * @group 数据存储
     * @param workspaceName 工作空间名称
     * @param storeName 存储名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.getCoveragestoreInfoApi("workspaceName","datastoreName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    getCoveragestoreInfoApi(workspaceName: string, storeName: string) {
        return fetchUtil.get<IDatastore.ResCoveragestoreInfo>(
            `${this.url}/rest/workspaces/${workspaceName}/coveragestores/${storeName}`,
            {},
            this.restXhrConfig,
        )
    }

    /**
     * 新增数据存储
     * @group 数据存储
     * @param body 
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * // GeoPackage类型
     * restHelperInstance.addDatastoreApi({
     *      "name": "nyc",
     *      "connectionParameters": {
     *          "entry": [
     *              {"@key":"database","$":"file:///path/to/nyc.gpkg"},
     *              {"@key":"dbtype","$":"geopkg"}
     *          ]
     *      }
     * }).then(res => {
     *  console.log(res)
     * })
     * 
     * // PostGIS类型
     * restHelperInstance.addDatastoreApi({
     *  "name": "nyc",
     *  "connectionParameters": {
     *      "entry": [
     *          {"@key":"host","$":"localhost"},
     *          {"@key":"port","$":"5432"},
     *          {"@key":"database","$":"nyc"},
     *          {"@key":"user","$":"bob"},
     *          {"@key":"passwd","$":"postgres"},
     *          {"@key":"dbtype","$":"postgis"}
     *      ]
     *   }
     * }).then(res => {
     *  console.log(res)
     * })
     * 
     * // Shapefile 类型
     * restHelperInstance.addDatastoreApi({
     *  "name": "nyc",
     *  "connectionParameters": {
     *      "entry": [{"@key":"url","$":"file:/path/to/nyc.shp"}]
     *   }
     * }).then(res => {
     *  console.log(res)
     * })

     * // Shapefile文件夹类型
     * restHelperInstance.addDatastoreApi({
     *  "name": "nyc",
     *  "connectionParameters": {
     *      "entry": [{"@key":"url","$":"file:/path/to"}]
     *   }
     * }).then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    addDatastoreApi(body: IDatastore.DatastoreOperationForm) {
        const postUrl = `${this.url}/rest/workspaces/${body.workspace}/datastores`
        // 清理掉对后台无用的参数数据
        if (Object.hasOwnProperty.call(body, 'workspace')) {
            delete body.workspace
        }
        if (Object.hasOwnProperty.call(body, 'type')) {
            delete body.type
        }
        if (Object.hasOwnProperty.call(body, 'connectionParameters')) {
            body.connectionParameters?.entry.forEach(singleEntry => {
                if (Object.hasOwnProperty.call(singleEntry, 'label')) {
                    delete singleEntry.label
                }
                if (Object.hasOwnProperty.call(singleEntry, 'needShow')) {
                    delete singleEntry.needShow
                }
                if (Object.hasOwnProperty.call(singleEntry, 'required')) {
                    delete singleEntry.required
                }
            })
        }
        return fetchUtil.post<string>(postUrl, { dataStore: body }, this.restXhrConfig)
    }
    /**
     * 更新数据存储
     * @group 数据存储
     * @param orignDatastoreParam  源信息
     * @param body 要更新的实体
     * @returns 
     */
    updateDatastoreApi(
        orignDatastoreParam: IDatastore.DatastoreInfo,
        body: IDatastore.DatastoreOperationForm,
    ) {
        // 清理掉对后台无用的参数数据
        if (Object.hasOwnProperty.call(body, 'workspace')) {
            delete body.workspace
        }
        if (Object.hasOwnProperty.call(body, 'type')) {
            delete body.type
        }
        if (Object.hasOwnProperty.call(body, 'connectionParameters')) {
            body.connectionParameters?.entry.forEach(singleEntry => {
                if (Object.hasOwnProperty.call(singleEntry, 'label')) {
                    delete singleEntry.label
                }
                if (Object.hasOwnProperty.call(singleEntry, 'needShow')) {
                    delete singleEntry.needShow
                }
                if (Object.hasOwnProperty.call(singleEntry, 'required')) {
                    delete singleEntry.required
                }
            })
        }
        return fetchUtil.put<string>(
            `${this.url}/rest/workspaces/${orignDatastoreParam.workspace.name}/datastores/${orignDatastoreParam.name}`,
            { dataStore: body },
            this.restXhrConfig,
        )
    }
    /**
     * 删除数据存储
     * @group 数据存储
     * @param workspaceName 工作空间
     * @param storeName 存储名称
     * @example
     * ``` typescript
     * const restHelperInstance = new restHelper({
     *      url: "/geoserver"
     *      userName: "admin",
     *      password: "geoserver",
     *  })
     * restHelperInstance.deleteDatastoreApi("workspaceName","datastoreName").then(res => {
     *  console.log(res)
     * })
     * ```
     * @returns 
     */
    deleteDatastoreApi(workspaceName: string, storeName: string) {
        return fetchUtil.delete<string>(`${this.url}/rest/workspaces/${workspaceName}/datastores/${storeName}`, {}, this.restXhrConfig)
    }

    /*************************************************数据存储相关end**************************************************** */


}
