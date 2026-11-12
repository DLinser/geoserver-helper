
import { formateObjToParamStr } from "./utils/common";
import { creatFeatureRequestXml, creatFeatureTransactionXml, formatFeatureTransactionResult } from "./utils/wfsXml";
import { type ILayer } from "./interface/layer"
import fetchUtil from './utils/fetch'
import X2JS from 'x2js';
import { IWfs } from "./interface/wfs";
import { TransactionResponse } from "ol/format/WFS";

const x2js = new X2JS();
export default class wfsHelper {
    private restXhrConfig: RequestInit = {
        headers: {},
    }
    /**
     * geoserver地址
     */
    url: string = "";
    /**
     * geoserver用户名
     */
    userName: string = "";
    /**
    * geoserver密码
    */
    password: string = "";
    /**
     * 图层名称(优先级较低，方法的参数中没传图层名的时候会用它)
     */
    layer: string = "";
    /**
     * SRS名称
     */
    srsName: string = "EPSG:4326";
    /**
     * 工作空间名称(优先级较低，方法的参数中没传图层名的时候会用它)
     */
    workspace: string = "";
    /**
     * 工作空间Uri(优先级较低，方法的参数中没传图层名的时候会用它)
     */
    workspaceUri: string = "";
    constructor(
        options:
            {
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
                workspaceUri?: string
            }
    ) {
        if (!options) return;
        this.url = options.url;
        this.userName = options.userName || "";
        this.password = options.password || "";
        this.layer = options.layer || "";
        this.srsName = options.srsName || "EPSG:4326";
        this.workspace = options.workspace || "";
        this.workspaceUri = options.workspaceUri || "";
        if (this.userName && this.password) {
            const auth = window.btoa(`${this.userName}:${this.password}`)
            this.restXhrConfig = {
                headers: { Authorization: `Basic ${auth}` },
            }
        }
    }

    private resolveLayerName(explicit?: string) {
        const name = explicit || (this.workspace && this.layer
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        if (!name) {
            throw new Error("WFS 需要图层名，或在构造 wfsHelper 时同时提供 workspace 与 layer");
        }
        return name;
    }

    /**
     * 数字 0 要保留。字符串空值、null、undefined 不写入请求。
     */
    private shouldSendQueryValue(value: number | string | undefined): value is number | string {
        if (typeof value === "number") {
            return true;
        }
        return !!value;
    }

    /**
     * 获取能力集(不同version会有细微的不同)
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     * });
     * wfsHelperInstance.GetCapabilities({
     *   version: "1.0.0",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<Record<string, any>>} x2js 解析后的能力集（暂不支持 JSON 能力集）
     */
    GetCapabilities(option: {
        version?: string
    } = {
            version: "1.0.0"
        }) {
        const featureRequest = {
            service: "WFS",
            version: option.version || "1.0.0",
            request: "GetCapabilities"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return new Promise<Record<string, any>>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl, undefined, this.restXhrConfig).then(xmlString => {
                resolve(x2js.xml2js(xmlString))
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * 查询某个图层的某个字段的属性(类似GetFeature查询但是只能查某个单一属性，并且无法加条件筛选)
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     *   workspace: "qhd",//这个工作空间优先级最低，如果参数中没传typeNames的话就会用它
     * });
     * wfsHelperInstance.GetPropertyValue({
     *   typeNames: "topp:states",
     *   valueReference: "STATE_NAME"
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<ILayer.LayerPropertyValue>} 单属性表。响应是 XML，经 x2js 解析后再返回。
     */
    GetPropertyValue(option: {
        typeNames?: string;
        valueReference: string;
    }) {
        return new Promise<ILayer.LayerPropertyValue>((resolve, reject) => {
            let realTypeNames = "";
            try {
                realTypeNames = this.resolveLayerName(option.typeNames);
            } catch (error) {
                reject(error);
                return;
            }
            const featureRequest = {
                service: "WFS",
                version: "2.0.0",
                request: "GetPropertyValue",
                typeNames: realTypeNames,
                valueReference: option.valueReference
            };
            const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
            fetchUtil.get<string>(fetchUrl, undefined, this.restXhrConfig).then(xmlString => {
                const jsonResult = x2js.xml2js<ILayer.LayerPropertyValue>(xmlString)
                resolve(jsonResult)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * 查询矢量Features（多用于简单查询，复杂查询条件的因为get请求本身的限制建议使用post协议的GetFeatureByPost方式）
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     *   workspace: "qhd",//这个工作空间优先级最低，如果参数中没传工作空间和图层名的话就会用它
     * });
     * wfsHelperInstance.GetFeature({
     *   propertyname: "name,gb",
     *   typename: "qhd:xzqh_xian",
     * }).then(res => {
     *   console.log(res)
     * })
     * 未传 version 时为 1.0.0。各版本都返回 GeoJSON，请求参数名固定为 typename、maxFeatures。
     * @return {Promise<ILayer.LayerPropertySheetInfo>}
     */
    GetFeature(queryOption?: {
        cql?: string;
        propertyname?: string;
        fid?: number | string;
        //图层名
        typename?: string;
        maxFeatures?: number | string;
        startIndex?: number | string;
        version?: IWfs.WfsVersion;
        extension?: Record<string, string | number | undefined>;
    }) {
        return new Promise<ILayer.LayerPropertySheetInfo>((resolve, reject) => {
            let typeName = "";
            try {
                typeName = this.resolveLayerName(queryOption?.typename);
            } catch (error) {
                reject(error);
                return;
            }
            const featureRequest: IWfs.GetFeatureParameters = {
                service: "WFS",
                version: queryOption?.version || "1.0.0",
                request: "GetFeature",
                typename: typeName,
                srsName: this.srsName,
                outputFormat: "application/json",
            };
            if (queryOption) {
                if (this.shouldSendQueryValue(queryOption.maxFeatures)) {
                    featureRequest.maxFeatures = queryOption.maxFeatures;
                }
                if (this.shouldSendQueryValue(queryOption.fid)) {
                    featureRequest.featureId = String(queryOption.fid);
                }
                if (queryOption.cql) {
                    featureRequest.CQL_FILTER = queryOption.cql;
                }
                if (queryOption.propertyname) {
                    featureRequest.propertyName = queryOption.propertyname;
                }
                if (this.shouldSendQueryValue(queryOption.startIndex)) {
                    featureRequest.startIndex = queryOption.startIndex;
                }
                if (
                    queryOption.extension &&
                    Object.prototype.toString.call(queryOption.extension) == "[object Object]"
                ) {
                    Object.assign(featureRequest, queryOption.extension);
                }
            }
            const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
            fetch(fetchUrl, {
                method: "GET",
                headers: new Headers({
                    Accept: "application/json;charset=utf-8",
                    ...this.restXhrConfig.headers,
                }),
                mode: "cors",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`WFS GetFeature request failed with status ${response.status}`);
                    }
                    const contentType = response.headers.get("content-type") || "";
                    if (/xml|html/i.test(contentType)) {
                        throw new Error(`WFS GetFeature 期望 JSON，实际 Content-Type 为 ${contentType}`);
                    }
                    return response.json();
                })
                .then((json) => {
                    resolve(json);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Post方式查询矢量图层Features（cql暂不支持TOUCHES|CROSSES|OVERLAPS|DWITHIN|BEYOND方法）
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     *   workspace: "qhd",//这个工作空间优先级最低，如果参数中没传的话就会用它
     * });
     * wfsHelperInstance.GetFeatureByPost({
     *   "workspace": "qhd",//工作空间（如果是默认的工作空间可以不传）
     *   "workspaceUri": "http://qhd",//工作空间uri（如果是默认的工作空间可以不传）
     *   "typename": "qhd:永久基本农田", 
     *   "startIndex": 0, 
     *   "maxFeatures": 10, 
     *   "cql": "type = '种植非粮食作' AND INTERSECTS (the_geom, MULTIPOLYGON(((119.149559 40.60191,119.1549 40.597565,...119.176018 40.609817))))"
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<ILayer.LayerPropertySheetInfo>}
     */
    GetFeatureByPost(option?: {
        cql?: string;
        //要显示的字段名（多字段的话用逗号分隔的字符串）
        propertyname?: string
        //图层名
        typename?: string
        //工作空间
        workspace?: string
        //工作空间uri
        workspaceUri?: string
        maxFeatures?: number
        startIndex?: number
    }) {
        let currentLayerName = "";
        try {
            currentLayerName = this.resolveLayerName(option?.typename);
        } catch (error) {
            return Promise.reject(error);
        }
        let xmlParam = "";
        try {
            xmlParam = creatFeatureRequestXml({
                srsName: this.srsName,
                featureNS: option?.workspaceUri || this.workspaceUri || "",
                featurePrefix: option?.workspace || this.workspace || "",
                featureTypes: [currentLayerName],
                outputFormat: 'application/json',
                propertyNames: option?.propertyname ? option?.propertyname.split(",") : undefined,
                startIndex: option?.startIndex,
                maxFeatures: option?.maxFeatures,
                cql: option?.cql
            })
        } catch (error) {
            return Promise.reject(error);
        }
        return fetchUtil.postXml<ILayer.LayerPropertySheetInfo>(`${this.url}`, xmlParam, this.restXhrConfig)
    }

    /**
     *  查询矢量图层字段信息
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     * });
     * wfsHelperInstance.DescribeFeatureType({
     *   typeName: "topp:states",
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<ILayer.LayerDescribeFeatureType>}
     */
    DescribeFeatureType(queryOption?: {
        typeName?: string;
    }) {

        interface wfsQueryDescribeFeatureTypeParams {
            service: "WFS";
            version: "1.0.0";
            request: "DescribeFeatureType";
            typeName: string;
            outputFormat: "application/json";
            // 添加索引签名，允许任意数量的额外属性
            [key: string]: string | number | undefined;
        }
        const featureRequest: wfsQueryDescribeFeatureTypeParams = {
            service: "WFS",
            version: "1.0.0",
            typeName: queryOption?.typeName || (this.workspace
                ? `${this.workspace}:${this.layer}`
                : this.layer),
            request: "DescribeFeatureType",
            outputFormat: "application/json",
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return fetchUtil.get<ILayer.LayerDescribeFeatureType>(fetchUrl, undefined, this.restXhrConfig)
    }

    /**
     *  矢量图层要素的新增、编辑、删除（写出前仍对调经纬度，和原来一样）
     * @example
     * import wfsHelper from 'geoserver-helper/wfs'
     * const wfsHelperInstance = new wfsHelper({
     *   url: "/geoserver/wfs",
     *   userName: "admin", //这个地方需要登录认证所以必须要传用户名和密码
     *   password: "geoserver",
     * });
     * wfsHelperInstance.Transaction({
     *   type:"modif",
     *   featurePrefix:"test",
     *   featureNS:"http://test",
     *   featureType:"test:layername",
     *   srsName: "EPSG:4326",
     *   features:yourFeature //可以是ol的格式也可以是json格式
     * }).then(res => {
     *   console.log(res)
     * })
     * @return {Promise<TransactionResponse | undefined>}
     */
    Transaction(option: IWfs.Transaction.FeatureTransactionOption) {
        const xmlParam = creatFeatureTransactionXml(option)
        return new Promise<TransactionResponse | undefined>((resolve, reject) => {
            fetchUtil.postXml<string>(`${this.url}`, xmlParam, this.restXhrConfig).then((res: string) => {
                resolve(formatFeatureTransactionResult(res))
            }).catch((err) => {
                reject(err)
            })
        })

    }
}
