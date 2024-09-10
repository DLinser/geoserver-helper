
import { formateObjToParamStr } from "./utils/common";
import { creatFeatureRequestXml, creatFeatureTransactionXml, formatFeatureTransactionResult } from "./utils/wfsXml";
import { type ILayer } from "./interface/layer"
import fetchUtil from './utils/fetch'
import X2JS from 'x2js';
import { IWfs } from "./interface/wfs";
import { TransactionResponse } from "ol/format/WFS";

const x2js = new X2JS();
export default class wfsHelper {
    private restXhrConfig: Record<string, any> = {
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
     * @return {string} 能力集（暂不支持json格式）
     */
    GetCapabilities(option: {
        version: string
    } = {
            version: "1.0.0"
        }) {
        const featureRequest = {
            service: "WFS",
            version: option.version,
            request: "GetCapabilities"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        // return fetchUtil.get<string>(fetchUrl)
        return new Promise<ILayer.LayerPropertyValue>((resolve, reject) => {
            fetchUtil.get<any>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<any>(xmlString)
                resolve(jsonResult)
            }).catch(() => {
                reject
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
     * @return {ILayer.LayerPropertyValue} 单属性表
     */
    GetPropertyValue(option: {
        typeNames?: string;
        valueReference: string;
    }) {
        const realTypeNames = option.typeNames ? option.typeNames : this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer
        const featureRequest = {
            service: "WFS",
            version: "2.0.0",
            request: "GetPropertyValue",
            typeNames: realTypeNames,
            valueReference: option.valueReference
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return new Promise<ILayer.LayerPropertyValue>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<ILayer.LayerPropertyValue>(xmlString)
                resolve(jsonResult)
            }).catch(() => {
                reject
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
     * @return {*}
     */
    GetFeature(queryOption?: {
        cql?: string;
        propertyname?: string;
        fid?: number | string;
        //图层名
        typename?: string;
        maxFeatures?: number | string;
        startIndex?: number | string;
        extension?: Record<string, string | number>;
    }) {
        return new Promise<ILayer.LayerPropertySheetInfo>((resolve, reject) => {
            interface wfsQueryParams {
                service: "WFS";
                version: "1.0.0";
                request: "GetFeature";
                srsName: string;
                typename: string;
                outputFormat: "application/json";
                featureId?: string;
                CQL_FILTER?: string;
                propertyname?: string;
                maxFeatures?: number | string;
                startIndex?: number | string;
            }
            // 使用索引签名来允许任意数量的额外属性
            interface ExtendedWfsQueryParams extends wfsQueryParams {
                [key: string]: string | number | undefined; // 这里允许任意类型的额外属性
            }
            let featureRequest: ExtendedWfsQueryParams = {
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                srsName: this.srsName,
                typename: this.workspace
                    ? `${this.workspace}:${this.layer}`
                    : this.layer,
                outputFormat: "application/json",
            };
            if (queryOption) {
                if (queryOption.fid) {
                    featureRequest.featureId = String(queryOption.fid);
                }
                if (queryOption.cql) {
                    featureRequest.CQL_FILTER = queryOption.cql;
                }
                if (queryOption.typename) {
                    featureRequest.typename = queryOption.typename;
                } else {
                    featureRequest.typename = this.workspace
                        ? `${this.workspace}:${this.layer}`
                        : this.layer
                }
                if (queryOption.propertyname) {
                    featureRequest.propertyname = queryOption.propertyname;
                }
                if (queryOption.maxFeatures) {
                    featureRequest.maxFeatures = queryOption.maxFeatures;
                }
                if (queryOption.startIndex) {
                    featureRequest.startIndex = queryOption.startIndex;
                }
                if (
                    queryOption.extension &&
                    Object.prototype.toString.call(queryOption.extension) ==
                    "[object Object]"
                ) {
                    featureRequest = {
                        ...featureRequest,
                        ...queryOption.extension,
                    };
                }
            }
            const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
            fetch(fetchUrl, {
                method: "GET",
                headers: new Headers({
                    Accept: "application/json;charset=utf-8",
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                mode: "cors",
            })
                .then(function (response) {
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
     * @return {*}
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
        const currentLayerName = option?.typename || (this.workspace
            ? `${this.workspace}:${this.layer}`
            : this.layer);
        const xmlParam = creatFeatureRequestXml({
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
        return fetchUtil.postXml<ILayer.LayerPropertySheetInfo>(`${this.url}`, xmlParam)
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
     * @return {*}
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
            typeName: "",
            request: "DescribeFeatureType",
            outputFormat: "application/json",
        };
        if (queryOption?.typeName) {
            featureRequest.typeName = queryOption?.typeName
        } else {
            featureRequest.typeName = this.workspace
                ? `${this.workspace}:${this.layer}`
                : this.layer
        }
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(featureRequest)}`;
        return fetchUtil.get<ILayer.LayerDescribeFeatureType>(fetchUrl)
    }

    /**
     *  矢量图层要素的新增、编辑、删除 （features在内部已经加了经纬度反转，不用再次处理）
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
