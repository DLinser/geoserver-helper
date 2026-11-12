import { IWps } from "./interface/wps";
import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
import WPSServiceUtil from "./utils/wpsXml";
import X2JS from 'x2js';

const x2js = new X2JS();
interface xmlQueryOption {
    // 空间字段名（geom | the_geom | shap）
    geoFile: string;
    cqlFilter: string;
    workspace: string;
    //命名空间url
    namespaceURL: string;
    typeName: string;
    attributes?: string[];
}

export default class wpsHelper {
    url: string = "";
    constructor(url?: string | undefined) {
        if (url) {
            this.url = url;
        }
    }
    /**
     * @description: 设置请求url
     * @param {string} url 请求的url
     */
    setUrl(url: string) {
        this.url = url;
    }

    /**
     * @description: 获取能力集(不同version会有细微的不同)
     * @return {Promise<IWps.WPSCapabilities.WpsCapabilitiesResponse>} x2js 解析后的能力集（暂不支持 JSON 能力集）
     */
    GetCapabilities() {
        const requestParams = {
            service: "WPS",
            version: "1.0.0",
            request: "GetCapabilities"
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(requestParams)}`;
        // return fetchUtil.get<string>(fetchUrl)
        return new Promise<IWps.WPSCapabilities.WpsCapabilitiesResponse>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<IWps.WPSCapabilities.WpsCapabilitiesResponse>(xmlString)
                resolve(jsonResult)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * @description: 获取某个进程的描述
     * @return {Promise<IWps.DescribeProcess.DescribeProcessResponse>} x2js 解析后的进程描述
     */
    DescribeProcess(option: {
        identifier: string
    }) {
        const requestParams = {
            service: "WPS",
            version: "1.0.0",
            request: "DescribeProcess",
            identifier: option.identifier
        };
        const fetchUrl = `${this.url}${this.url.indexOf("?") > -1 ? "&" : "?"}${formateObjToParamStr(requestParams)}`;
        // return fetchUtil.get<string>(fetchUrl)
        return new Promise<IWps.DescribeProcess.DescribeProcessResponse>((resolve, reject) => {
            fetchUtil.get<string>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<IWps.DescribeProcess.DescribeProcessResponse>(xmlString)
                resolve(jsonResult)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * @description: 格式化xml请求字符串
     * @param {xmlQueryOption} option 参数
     * @return {String} 格式化后的XML参数
     */
    formatQueryXmlString(option: xmlQueryOption) {
        if (!option) {
            throw new Error("WPS formatQueryXmlString 缺少必要的参数");
        }
        const attributes = option.attributes ? option.attributes : [];
        let attrStr = "";
        for (let i = 0; i < attributes.length; i++) {
            attrStr += WPSServiceUtil.literalInput("attribute", attributes[i]);
        }
        attrStr += WPSServiceUtil.literalInput("attribute", option.geoFile);
        const inputs =
            WPSServiceUtil.layerFeatures(option.workspace, option.namespaceURL, option.typeName) +
            attrStr +
            WPSServiceUtil.complexInput(
                "filter",
                "text/plain; subtype=cql",
                option.cqlFilter ? option.cqlFilter : "1=1",
            );
        return WPSServiceUtil.process("gs:Query", inputs, "result", "application/json");
    }

    /**
     * 对子流程结果为FeatureCollection中的要素进行边界计算。
     * @param {XML} Subprocess 子流程Execute.
     * @returns {XML} Execute Execute
     */
    formatBoundsBySubprocessXmlString = function (Subprocess: string) {
        const features = WPSServiceUtil.referenceInput(
            "features",
            "text/xml",
            "http://geoserver/wps",
            Subprocess,
        );
        return WPSServiceUtil.process("gs:Bounds", features, "bounds");
    };

    /**
     * @description 矢量要素查询。
     * @param {Object} option 配置
     * @returns {XML} Execute Execute
     */
    formatVectorQueryXmlString = function (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        attributes?: string[];
        cql: string;
        outputMimiType?: string;
    }) {
        let attributeInputWithNameXml = "";
        if (option.attributes) {
            for (let i = 0; i < option.attributes.length; i++) {
                attributeInputWithNameXml += WPSServiceUtil.literalInput("attribute", option.attributes[i]);
            }
        }
        const cqlInputWithNameXml = option.cql
            ? WPSServiceUtil.complexInput("filter", "text/plain; subtype=cql", option.cql)
            : "";
        const inputs =
            WPSServiceUtil.layerFeatures(option.workspace, option.workspaceURI, option.queryName) +
            cqlInputWithNameXml +
            attributeInputWithNameXml;
        return WPSServiceUtil.process(
            "vec:Query",
            inputs,
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 对图层进行字段唯一值计算。
     * @param {Object} option 配置
     * @example
     * import wpsHelper from "geoserver-helper/wps";
     * import helperUtils from "geoserver-helper/utils";
     * const wpsHelperInstance = new wpsHelper(`${MAPSERVER}/ows`);
     * const xmlString = wpsHelperInstance.formatUniqueXmlString({
     *  workspace: "workspace",
     *  workspaceURI: "namespaceUri",
     *  queryName: "queryName",
     *  fieldName: "fieldName",
     *  outputMimiType: "application/json"
     * });
     * const finishXmlString = wpsHelperInstance.finishXML(xmlString);
      * helperUtils.request.postXml<unknown>(wpsurl, finishXmlString).then(res => {
      *  console.log(res)
      * })
      * @returns {XML} Execute Execute
     */
    formatUniqueXmlString = function (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        fieldName: string;
        outputMimiType?: string;
    }) {
        const inputs =
            WPSServiceUtil.layerFeatures(option.workspace, option.workspaceURI, option.queryName) +
            WPSServiceUtil.literalInput("attribute", option.fieldName);
        return WPSServiceUtil.process(
            "gs:Unique",
            inputs,
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 对图层要素数量统计计算。
     * @param {Object} option 配置
     * @returns {XML} Execute Execute
     */
    formatFeatureCountXmlString = (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        cql?: string;
        outputMimiType?: string;
    }) => {
        return WPSServiceUtil.process(
            "vec:Count",
            WPSServiceUtil.layerFeatures(
                option.workspace,
                option.workspaceURI,
                option.queryName,
                option.cql
                    ? this.formatVectorQueryXmlString({
                        workspace: option.workspace,
                        workspaceURI: option.workspaceURI,
                        queryName: option.queryName,
                        attributes: [],
                        cql: option.cql,
                        outputMimiType: "application/json",
                    })
                    : undefined,
            ),
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 对图层属性的统计计算。
     * @param {Object} option 配置
     * @example
     * import wpsHelper from "geoserver-helper/wps";
     * import helperUtils from "geoserver-helper/utils";
     * const wpsHelperInstance = new wpsHelper(`${MAPSERVER}/ows`);
     * const xmlString = wpsHelperInstance.formatAggregateXmlString({
     *  workspace: "workspace",
     *  workspaceURI: "namespaceUri",
     *  queryName: "queryName",
     *  groupByAttributes: "groupByAttributes",
     *  fieldName: "fieldName",
     *  functionName: "Sum",
     *  cql: "",
     *  outputMimiType: "application/json"
     * });
     * const finishXmlString = wpsHelperInstance.finishXML(xmlString);
     * helperUtils.request.postXml<unknown>(wpsurl, finishXmlString).then(res => {
     *  console.log(res)
     * })
     * @returns {XML} Execute Execute
     */
    formatAggregateXmlString = (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        fieldName?: string;
        groupByAttributes?: string;
        functionName: string;
        cql?: string;
        outputMimiType?: string;
    }) => {
        const inputs =
            WPSServiceUtil.layerFeatures(
                option.workspace,
                option.workspaceURI,
                option.queryName,
                option.cql
                    ? this.formatVectorQueryXmlString({
                        workspace: option.workspace,
                        workspaceURI: option.workspaceURI,
                        queryName: option.queryName,
                        attributes: [],
                        cql: option.cql,
                        outputMimiType: "application/json",
                    })
                    : undefined,
            ) +
            (option.fieldName ? WPSServiceUtil.literalInput("aggregationAttribute", option.fieldName) : "") +
            WPSServiceUtil.literalInput("function", option.functionName) +
            WPSServiceUtil.literalInput("singlePass", false) +
            (option.groupByAttributes ? WPSServiceUtil.literalInput("groupByAttributes", option.groupByAttributes) : "");
        return WPSServiceUtil.process(
            "vec:Aggregate",
            inputs,
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 对图层要素做缓冲区。
     * @param {Object} option 配置
     * @returns {XML} Execute Execute
     */
    formatBufferXmlString = (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        distance: number | string;
        attributeName?: string;
        cql?: string;
        outputMimiType?: string;
    }) => {
        const inputs =
            WPSServiceUtil.layerFeatures(
                option.workspace,
                option.workspaceURI,
                option.queryName,
                option.cql
                    ? this.formatVectorQueryXmlString({
                        workspace: option.workspace,
                        workspaceURI: option.workspaceURI,
                        queryName: option.queryName,
                        attributes: [],
                        cql: option.cql,
                        outputMimiType: "application/json",
                    })
                    : undefined,
            ) +
            WPSServiceUtil.literalInput("distance", option.distance) +
            (option.attributeName ? WPSServiceUtil.literalInput("attributeName", option.attributeName) : "");
        return WPSServiceUtil.process(
            "vec:BufferFeatureCollection",
            inputs,
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 计算图层要素质心。
     * @param {Object} option 配置
     * @returns {XML} Execute Execute
     */
    formatCentroidXmlString = (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        cql?: string;
        outputMimiType?: string;
    }) => {
        return WPSServiceUtil.process(
            "vec:Centroid",
            WPSServiceUtil.layerFeatures(
                option.workspace,
                option.workspaceURI,
                option.queryName,
                option.cql
                    ? this.formatVectorQueryXmlString({
                        workspace: option.workspace,
                        workspaceURI: option.workspaceURI,
                        queryName: option.queryName,
                        attributes: [],
                        cql: option.cql,
                        outputMimiType: "application/json",
                    })
                    : undefined,
            ),
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 简化图层要素。preserveTopology 不传时为 false，与进程默认值一致。
     * @param {Object} option 配置
     * @returns {XML} Execute Execute
     */
    formatSimplifyXmlString = (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        distance: number | string;
        preserveTopology?: boolean;
        cql?: string;
        outputMimiType?: string;
    }) => {
        const preserveTopology = option.preserveTopology === true ? "true" : "false";
        const inputs =
            WPSServiceUtil.layerFeatures(
                option.workspace,
                option.workspaceURI,
                option.queryName,
                option.cql
                    ? this.formatVectorQueryXmlString({
                        workspace: option.workspace,
                        workspaceURI: option.workspaceURI,
                        queryName: option.queryName,
                        attributes: [],
                        cql: option.cql,
                        outputMimiType: "application/json",
                    })
                    : undefined,
            ) +
            WPSServiceUtil.literalInput("distance", option.distance) +
            WPSServiceUtil.literalInput("preserveTopology", preserveTopology);
        return WPSServiceUtil.process(
            "vec:Simplify",
            inputs,
            "result",
            option.outputMimiType || "application/json",
        );
    };

    /**
     * 对已完成的Execute XML添加xml头文件。
     * @param {XML} xml 任意Execute格式的XML.
     * @returns {XML} xml 完整的XML
     */
    finishXML = function (xml: string) {
        const finishXML = WPSServiceUtil.headerXML + xml;
        return finishXML;
    };
}
