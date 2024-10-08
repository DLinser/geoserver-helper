
import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { IWms } from "./interface/wms";
import { ILayer } from "./interface/layer";

// wms的版本列表
type IWmsVersion = "1.0.0" | "1.1.0" | "1.1.1" | "1.3.0"
export default class wmsHelper {
    url: string = "";
    layer: string = "";
    srsName: string = "EPSG:4326";
    workspace: string = "";
    //工作空间Uri
    workspaceUri: string = "";
    constructor(
        options:
            {
                url: string;
                layer?: string;
                srsName?: string;
                workspace?: string;
                workspaceUri?: string
            }
    ) {
        if (!options) return;
        this.url = options.url;
        this.layer = options.layer || "";
        this.srsName = options.srsName || "EPSG:4326";
        this.workspace = options.workspace || "";
        this.workspaceUri = options.workspaceUri || "";
    }

    /**
     * 获取wms能力集(不同version会有细微的不同)
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wfs",
     *   workspace: "qhd",
     * });
     * wfsHelperInstance.GetCapabilities({
     *   version: "1.0.0",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {IWms.WMSCapabilities.GetCapabilitiesResponse} 能力集
     */
    GetCapabilities(option: {
        version: IWmsVersion
    } = {
            version: "1.0.0"
        }) {
        const featureRequest = {
            service: "WMS",
            version: option.version,
            request: "GetCapabilities"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return new Promise<IWms.WMSCapabilities.GetCapabilitiesResponse>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl).then(xmlString => {
                resolve(new WMSCapabilities().read(xmlString))
            }).catch(() => {
                reject
            })
        })
    }

    /**
     * 获取要素信息(一般用于点选查询)
     * @param {IWms.GetFeatureInfoParameters} option
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wms",
     * });
     * wfsHelperInstance.GetFeatureInfo({
     *   layers: "workspaceName:layerName",
     *   version: "1.0.0",
     *   bbox:"118.85559,39.47113,119.17419,39.776",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {*}
     */
    GetFeatureInfo(option: IWms.GetFeatureInfoParameters) {
        const currentLayerName = option?.layers || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        const versionParameters = option.version == "1.3.0" ? {
            x: "0",
            y: "0",
            srs: "EPSG:4326"
        } : {
            i: "0",
            j: "0",
            crs: "EPSG:4326"
        }
        const featureRequest: IWms.GetFeatureInfoParameters = Object.assign({
            service: "WMS",
            version: "1.0.0",
            request: "GetFeatureInfo",
            layers: currentLayerName,
            query_layers: currentLayerName,
            bbox: option.bbox,
            width: option.width || "101",
            height: option.height || "101",
            feature_count: option.feature_count,
            info_format: option.info_format || "application/json",
            exceptions: option.exceptions || "application/json"
        }, versionParameters, option);
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return fetchUtil.get<ILayer.LayerPropertySheetInfo>(fetchUrl)
    }

    /**
     * 获取图例信息
     * @param {*} option
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wms",
     * });
     * wfsHelperInstance.GetLegendGraphic({
     *   layer: "workspaceName:layerName",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {*}
     */
    GetLegendGraphic(option: IWms.GetLegendGraphic.QueryParameters) {
        const currentLayerName = option?.layer || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        const requestParameters = Object.assign({
            service: "WMS",
            version: "1.1.0",
            layer: currentLayerName,
            request: "GetLegendGraphic",
            format: "application/json",
        }, option)
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(requestParameters as any)}`;
        return fetchUtil.get<IWms.GetLegendGraphic.Response>(fetchUrl)

    }
}
