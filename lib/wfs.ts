
import { formateObjToParamStr } from "./utils/common";
import { creatFeatureRequestXml } from "./utils/wfsXml";
import { type ILayer } from "./interface/layer"
import fetchUtil from './utils/fetch'
import X2JS from 'x2js';

const x2js = new X2JS();
export default class wfsHelper {
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
     * @description: 获取能力集(不同version会有细微的不同)
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
     * @description: 查询某个图层的某个字段的属性(类似GetFeature查询但是只能查某个单一属性，并且无法加条件筛选)
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
     * @description: 查询矢量Features（多用于简单查询，复杂查询条件的因为get请求本身的限制建议使用post协议的GetFeatureByPost方式）
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
     * @description: Post方式查询矢量图层Features（cql暂不支持TOUCHES|CROSSES|OVERLAPS|DWITHIN|BEYOND方法）
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
     * @description: 查询矢量图层字段信息
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


}
