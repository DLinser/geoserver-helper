
import { formateObjToParamStr } from "./utils/common";
import { creatFeatureRequestXml } from "./utils/wfsXml";
import { type ILayer } from "./interface/layer"
import fetchUtil from './utils/fetch'
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
     * @description: 查询矢量Features
     * @return {*}
     */
    queryFeatures(queryOption?: {
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
     * @description: Post方式查询矢量图层Features
     * @return {*}
     */
    queryFeaturesByPost(option?: {
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
            count: option?.maxFeatures,
            cql: option?.cql
        })
        return fetchUtil.postXml<ILayer.LayerPropertySheetInfo>(`${this.url}`, xmlParam)
    }

    /**
     * @description: 查询矢量图层字段信息
     * @return {*}
     */
    getDescribeFeatureType(queryOption?: {
        typeName?: string;
    }) {
        return new Promise((resolve, reject) => {
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
}
