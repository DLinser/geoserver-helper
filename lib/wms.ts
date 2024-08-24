
import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { IWms } from "./interface/wms";

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
     * @description: 获取wms能力集(不同version会有细微的不同)
     * @return {string} 能力集（暂不支持json格式）
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

    GetFeatureInfo(option: {
        version?: IWmsVersion
        layers?: string
        styles?: string
        //坐标系（WMS 1.3.0 +）
        crs?: string
        //坐标系
        srs?: string
        bbox?: string
        //返回地图图片的宽度（点选查询的时候用不到）
        width?: string
        //返回地图图片的高度（点选查询的时候用不到）
        height?: string
        //经度WMS 1.3.0
        i?: string
        //纬度WMS 1.3.0
        j?: string
        //经度
        x?: string
        //纬度
        y?: string
        //返回结果有哪些字段，默认返回全部
        propertyName?: string
        //cql过滤条件
        cql_filter?: string
        //返回结果的格式
        info_format?: string
    }) {
        const currentLayerName = option?.layers || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        const featureRequest = {
            service: "WMS",
            version: option.version || "1.0.0",
            request: "GetFeatureInfo",
            layers: currentLayerName,
            query_layers: currentLayerName,
            styles: option.styles,
            crs: option.crs,
            srs: option.srs,
            bbox: option.bbox,
            width: option.width,
            height: option.height,
            x: option.x,
            y: option.y,
            i: option.i,
            j: option.j,
            info_format: "application/json"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return fetchUtil.get<string>(fetchUrl)
    }



}
