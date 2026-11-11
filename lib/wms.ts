import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { IWms } from "./interface/wms";
import { ILayer } from "./interface/layer";

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
     *   url: "/geoserver/wms",
     *   workspace: "qhd",
     * });
     * wmsHelperInstance.GetCapabilities({
     *   version: "1.0.0",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {IWms.WMSCapabilities.GetCapabilitiesResponse} 能力集
     */
    GetCapabilities(option: {
        version?: IWms.WmsVersion
    } = {
            version: "1.0.0"
        }) {
        const featureRequest = {
            service: "WMS",
            version: option.version || "1.0.0",
            request: "GetCapabilities"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return new Promise<IWms.WMSCapabilities.GetCapabilitiesResponse>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl).then(xmlString => {
                resolve(new WMSCapabilities().read(xmlString))
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * 获取要素信息(一般用于点选查询)。x/y 或 i/j 是像素列/行，不是经纬度。
     * @param {IWms.GetFeatureInfoParameters} option
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wms",
     * });
     * wmsHelperInstance.GetFeatureInfo({
     *   layers: "workspaceName:layerName",
     *   version: "1.0.0",
     *   srs: "EPSG:4326",
     *   bbox: "118.85559,39.47113,119.17419,39.776",
     *   width: 256,
     *   height: 256,
     *   x: 128,
     *   y: 128,
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<ILayer.LayerPropertySheetInfo>}
     */
    GetFeatureInfo(option: IWms.GetFeatureInfoParameters) {
        const currentLayerName = option?.layers || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        if (!currentLayerName) {
            throw new Error("WMS GetFeatureInfo 需要 layers，或在构造 wmsHelper 时提供 workspace / layer");
        }
        if (option.bbox === undefined || option.bbox === "") {
            throw new Error("WMS GetFeatureInfo 需要 bbox");
        }
        if (option.width === undefined || option.width === "") {
            throw new Error("WMS GetFeatureInfo 需要 width（与出图请求一致的像素宽度）");
        }
        if (option.height === undefined || option.height === "") {
            throw new Error("WMS GetFeatureInfo 需要 height（与出图请求一致的像素高度）");
        }

        const version = option.version || "1.0.0";
        const versionParameters = version === "1.3.0" ? {
            crs: ("crs" in option && option.crs) || this.srsName,
            i: "i" in option ? option.i : undefined,
            j: "j" in option ? option.j : undefined,
        } : {
            srs: ("srs" in option && option.srs) || this.srsName,
            x: "x" in option ? option.x : undefined,
            y: "y" in option ? option.y : undefined,
        }
        if (version === "1.3.0") {
            if (versionParameters.i === undefined || versionParameters.i === "" || versionParameters.j === undefined || versionParameters.j === "") {
                throw new Error("WMS 1.3.0 GetFeatureInfo 需要像素坐标 i 和 j（列/行，不是经纬度）");
            }
        } else if (versionParameters.x === undefined || versionParameters.x === "" || versionParameters.y === undefined || versionParameters.y === "") {
            throw new Error("WMS 1.0.0/1.1.x GetFeatureInfo 需要像素坐标 x 和 y（列/行，不是经纬度）");
        }

        const featureRequest = Object.assign({
            service: "WMS",
            version,
            request: "GetFeatureInfo",
            layers: currentLayerName,
            query_layers: option.query_layers || currentLayerName,
            styles: option.styles ?? "",
            bbox: option.bbox,
            width: option.width,
            height: option.height,
            info_format: option.info_format || "application/json",
            exceptions: option.exceptions || "application/json",
            feature_count: option.feature_count,
            propertyName: option.propertyName,
            format: option.format,
            cql_filter: option.cql_filter,
            time: option.time,
            elevation: option.elevation,
            env: option.env,
            transparent: option.transparent === undefined ? undefined : String(option.transparent),
            bgcolor: option.bgcolor,
            sld: option.sld,
            sld_body: option.sld_body,
            filter: option.filter,
            viewparams: option.viewparams,
            buffer: option.buffer,
            feature_id: option.feature_id,
        }, versionParameters, option.extension || {});
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return fetchUtil.get<ILayer.LayerPropertySheetInfo>(fetchUrl)
    }

    /**
     * 获取 GetMap 的完整请求地址，可直接用于 img.src
     * @param {IWms.GetMapParameters} option
     * @return {string}
     */
    GetMapUrl(option: IWms.GetMapParameters) {
        const currentLayerName = option?.layers || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        if (!currentLayerName) {
            throw new Error("WMS GetMap 需要 layers，或在构造 wmsHelper 时提供 workspace / layer");
        }
        if (option.bbox === undefined || option.bbox === "") {
            throw new Error("WMS GetMap 需要 bbox");
        }
        if (option.width === undefined || option.width === "") {
            throw new Error("WMS GetMap 需要 width");
        }
        if (option.height === undefined || option.height === "") {
            throw new Error("WMS GetMap 需要 height");
        }

        const version = option.version || "1.0.0";
        const versionParameters = version === "1.3.0"
            ? { crs: ("crs" in option && option.crs) || this.srsName }
            : { srs: ("srs" in option && option.srs) || this.srsName };
        const requestParameters = Object.assign({
            service: "WMS",
            version,
            request: "GetMap",
            layers: currentLayerName,
            styles: option.styles ?? "",
            bbox: option.bbox,
            width: option.width,
            height: option.height,
            format: option.format || "image/png",
            transparent: option.transparent === undefined ? undefined : String(option.transparent),
            bgcolor: option.bgcolor,
            exceptions: option.exceptions,
            cql_filter: option.cql_filter,
            time: option.time,
            elevation: option.elevation,
            env: option.env,
            sld: option.sld,
            sld_body: option.sld_body,
            filter: option.filter,
            viewparams: option.viewparams,
        }, versionParameters, option.extension || {});
        return `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(requestParameters)}`;
    }

    /**
     * 请求 WMS 地图图片。默认 format 为 image/png，成功时通常返回 Blob。
     * @param {IWms.GetMapParameters} option
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wms",
     *   srsName: "EPSG:4326",
     * });
     * const mapUrl = wmsHelperInstance.GetMapUrl({
     *   layers: "workspaceName:layerName",
     *   version: "1.0.0",
     *   bbox: "118.85559,39.47113,119.17419,39.776",
     *   width: 512,
     *   height: 256,
     *   format: "image/png",
     *   transparent: true,
     * });
     * const image = await wmsHelperInstance.GetMap({
     *   layers: "workspaceName:layerName",
     *   version: "1.0.0",
     *   bbox: "118.85559,39.47113,119.17419,39.776",
     *   width: 512,
     *   height: 256,
     *   format: "image/png",
     *   transparent: true,
     * });
     * @return {Promise<Blob | string | any>}
     */
    async GetMap(option: IWms.GetMapParameters) {
        const fetchUrl = this.GetMapUrl(option);
        const response = await fetch(fetchUrl, {
            method: "GET",
            headers: new Headers(option.headers || {}),
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`WMS GetMap request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            return response.json();
        }
        if (
            contentType.includes("image/") ||
            contentType.includes("application/pdf") ||
            contentType.includes("octet-stream")
        ) {
            return response.blob();
        }
        return response.text();
    }

    /**
     * 获取图例信息
     * @param {*} option
     * @example
     * import wmsHelper from 'geoserver-helper/wms'
     * const wmsHelperInstance = new wmsHelper({
     *   url: "/geoserver/wms",
     * });
     * wmsHelperInstance.GetLegendGraphic({
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
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(requestParameters as unknown as Record<string, string | number | undefined>)}`;
        return fetchUtil.get<IWms.GetLegendGraphic.Response>(fetchUrl)
    }
}
