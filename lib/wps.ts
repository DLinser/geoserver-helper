/**
 * @description 对完整的XML发送wps 的 http post 请求。
 * @param {XML} finishXML 完整的XML.
 * @param {function} callback 回调函数
 * @returns {requestCallback} callback 回调函数
 */
import { IWps } from "./interface/wps";
import { formateObjToParamStr } from "./utils/common";
import fetchUtil from './utils/fetch'
import X2JS from 'x2js';

const x2js = new X2JS();

const WPSServiceUtil = {
    organization: {
        headerXML: '<?xml version="1.0" encoding="UTF-8"?>',
        Excute: function (xml: string) {
            const excute =
                '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
                xml +
                "</wps:Execute>";
            return excute;
        },
        Identifier: function (Identifier: string) {
            const str = "<ows:Identifier>" + Identifier + "</ows:Identifier>";
            return str;
        },
        DataInputs: function (xml: string) {
            const str = "<wps:DataInputs>" + xml + "</wps:DataInputs>";
            return str;
        },
        InputName: function (InputName: string, InputData: string) {
            const str =
                "<wps:Input>" +
                "<ows:Identifier>" +
                InputName +
                "</ows:Identifier>" +
                InputData +
                "</wps:Input>";
            return str;
        },
        ResponseForm: function (outputName: string, mimeType?: string) {
            let outputtype = "";
            if (mimeType) {
                outputtype = 'mimeType="' + mimeType + '"';
            }
            const str =
                "<wps:ResponseForm>" +
                "<wps:RawDataOutput " +
                outputtype +
                ">" +
                "<ows:Identifier>" +
                outputName +
                "</ows:Identifier>" +
                "</wps:RawDataOutput>" +
                "</wps:ResponseForm>";
            return str;
        },
    },
    createInputData: {
        TEXT: function (mimeType: string, value: string) {
            const inputData =
                "<wps:Data>" +
                `<wps:ComplexData mimeType="${mimeType}">` +
                "<![CDATA[" +
                value +
                "]]>" +
                "</wps:ComplexData>" +
                "</wps:Data>";
            return inputData;
        },
        REFERENCE: function (
            type: string,
            mimeType: string,
            url: string,
            value: string,
        ) {
            let inputData = "";
            if (type == "GET") {
                inputData =
                    '<wps:Reference mimeType="' +
                    mimeType +
                    '" xlink:href="' +
                    url +
                    '" method="GET"/>';
            } else {
                value = value ? value : "";
                inputData =
                    '<wps:Reference mimeType="' +
                    mimeType +
                    '" xlink:href="' +
                    url +
                    '" method="POST">' +
                    "<wps:Body><![CDATA[" +
                    value +
                    "]]></wps:Body>" +
                    "</wps:Reference>";
            }
            return inputData;
        },
        SUBPROCESS: function () { },
        VECTOR_LAYER: function (
            workspace: string,
            workspaceURL: string,
            queryName: string,
        ) {
            const inputData =
                '<wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">' +
                "<wps:Body>" +
                '<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:' +
                workspace +
                '="' +
                workspaceURL +
                '">' +
                '<wfs:Query typeName="' +
                queryName +
                '"/>' +
                "</wfs:GetFeature>" +
                "</wps:Body>" +
                "</wps:Reference>";
            return inputData;
        },
        // RASTER: function(){
        // 	inputData = '<wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">';
        // }
    },
};
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
     * @return {string} 能力集（暂不支持json格式）
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
            fetchUtil.get<any>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<IWps.WPSCapabilities.WpsCapabilitiesResponse>(xmlString)
                resolve(jsonResult)
            }).catch(() => {
                reject
            })
        })
    }

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
            fetchUtil.get<any>(fetchUrl).then(xmlString => {
                const jsonResult = x2js.xml2js<IWps.DescribeProcess.DescribeProcessResponse>(xmlString)
                resolve(jsonResult)
            }).catch(() => {
                reject
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
            return console.log("缺少必要的参数");
        }
        const _geoFile = option.geoFile;
        const _cqlFilter = option.cqlFilter ? option.cqlFilter : "1=1";
        const _workspace = option.workspace;
        const _namespaceURL = option.namespaceURL;
        const _typeName = option.typeName;
        const _attributes = option.attributes ? option.attributes : [];
        let attrStr = "";
        for (let i = 0; i < _attributes.length; i++) {
            attrStr +=
                "<wps:Input>" +
                "<ows:Identifier>attribute</ows:Identifier>" +
                "<wps:Data>" +
                "<wps:LiteralData>" +
                _attributes[i] +
                "</wps:LiteralData>" +
                "</wps:Data>" +
                "</wps:Input>";
        }
        attrStr +=
            "<wps:Input>" +
            "<ows:Identifier>attribute</ows:Identifier>" +
            "<wps:Data>" +
            "<wps:LiteralData>" +
            _geoFile +
            "</wps:LiteralData>" +
            "</wps:Data>" +
            "</wps:Input>";
        const xmlStr =
            '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
            "<ows:Identifier>gs:Query</ows:Identifier>" +
            "<wps:DataInputs>" +
            "<wps:Input>" +
            "<ows:Identifier>features</ows:Identifier>" +
            '<wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">' +
            "<wps:Body>" +
            '<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:' +
            _workspace +
            '="' +
            _namespaceURL +
            '">' +
            '<wfs:Query typeName="' +
            _typeName +
            '"/>' +
            "</wfs:GetFeature>" +
            "</wps:Body>" +
            "</wps:Reference>" +
            "</wps:Input>" +
            attrStr +
            "<wps:Input>" +
            "<ows:Identifier>filter</ows:Identifier>" +
            "<wps:Data>" +
            '<wps:ComplexData mimeType="text/plain; subtype=cql">' +
            "<![CDATA[" +
            _cqlFilter +
            "]]>" +
            "</wps:ComplexData>" +
            "</wps:Data>" +
            "</wps:Input>" +
            "</wps:DataInputs>" +
            "<wps:ResponseForm>" +
            '<wps:RawDataOutput mimeType="application/json">' +
            "<ows:Identifier>result</ows:Identifier>" +
            "</wps:RawDataOutput>" +
            "</wps:ResponseForm>" +
            "</wps:Execute>";

        return xmlStr;
    }

    /**
     * 对子流程结果为FeatureCollection中的要素进行边界计算。
     * @param {XML} Subprocess 子流程Execute.
     * @returns {XML} Execute Execute
     */
    formatBoundsBySubprocessXmlString = function (Subprocess: string) {
        const str =
            "<wps:Input>" +
            "<ows:Identifier>features</ows:Identifier>" +
            '<wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wps" method="POST">' +
            "<wps:Body>" +
            Subprocess +
            "</wps:Body>" +
            "</wps:Reference>" +
            "</wps:Input>";

        const xml =
            WPSServiceUtil.organization.Identifier("gs:Bounds") +
            WPSServiceUtil.organization.DataInputs(str) +
            WPSServiceUtil.organization.ResponseForm("bounds");

        return WPSServiceUtil.organization.Excute(xml);
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
        const layerInputXml = WPSServiceUtil.createInputData.VECTOR_LAYER(
            option.workspace,
            option.workspaceURI,
            option.queryName,
        );
        const layerInputWithNameXml = WPSServiceUtil.organization.InputName(
            "features",
            layerInputXml,
        );

        let attributeInputWithNameXml = "";

        if (option.attributes) {
            for (let i = 0; i < option.attributes.length; i++) {
                const attributeInputXml = `<wps:Data><wps:LiteralData>${option.attributes[i]}</wps:LiteralData></wps:Data>`;
                attributeInputWithNameXml += WPSServiceUtil.organization.InputName(
                    "attribute",
                    attributeInputXml,
                );
            }
        }

        let cqlInputWithNameXml = "";
        if (option.cql) {
            const cqlInputXml = WPSServiceUtil.createInputData.TEXT(
                "text/plain; subtype=cql",
                option.cql,
            );
            cqlInputWithNameXml = WPSServiceUtil.organization.InputName(
                "filter",
                cqlInputXml,
            );
        }

        const xml =
            WPSServiceUtil.organization.Identifier("vec:Query") + // 工具标识符
            WPSServiceUtil.organization.DataInputs(
                layerInputWithNameXml + cqlInputWithNameXml + attributeInputWithNameXml,
            ) + // 参数
            WPSServiceUtil.organization.ResponseForm(
                "result",
                option.outputMimiType || "application/json",
            );

        return WPSServiceUtil.organization.Excute(xml);
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
     * helperUtils.request.postXml<any>(wpsurl, finishXmlString).then(res => {
     *  cons
     * @returns {XML} Execute Execute
     */
    formatUniqueXmlString = function (option: {
        workspace: string;
        workspaceURI: string;
        queryName: string;
        fieldName: string;
        outputMimiType?: string;
    }) {
        const layerInputXml = WPSServiceUtil.createInputData.VECTOR_LAYER(
            option.workspace,
            option.workspaceURI,
            option.queryName,
        );
        const layerInputWithNameXml = WPSServiceUtil.organization.InputName(
            "features",
            layerInputXml,
        );
        const attributeInputXml = `<wps:Data><wps:LiteralData>${option.fieldName}</wps:LiteralData></wps:Data>`;
        const attributeWithNameXml = WPSServiceUtil.organization.InputName(
            "attribute",
            attributeInputXml,
        );
        const xml =
            WPSServiceUtil.organization.Identifier("gs:Unique") + // 工具标识符
            WPSServiceUtil.organization.DataInputs(
                layerInputWithNameXml + attributeWithNameXml,
            ) + // 参数
            WPSServiceUtil.organization.ResponseForm(
                "result",
                option.outputMimiType || "application/json",
            );

        return WPSServiceUtil.organization.Excute(xml);
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
        let layerInputWithNameXml = "";
        if (option.cql) {
            const featureQueryString = this.formatVectorQueryXmlString({
                workspace: option.workspace,
                workspaceURI: option.workspaceURI,
                queryName: option.queryName,
                attributes: [],
                cql: option.cql,
                outputMimiType: "application/json",
            });
            const featureQuerySubprocess =
                '<wps:Reference mimeType="application/json" xlink:href="http://geoserver/wps" method="POST">' +
                "<wps:Body>" +
                featureQueryString +
                "</wps:Body>" +
                "</wps:Reference>";
            layerInputWithNameXml = WPSServiceUtil.organization.InputName(
                "features",
                featureQuerySubprocess,
            );
        } else {
            const layerInputXml = WPSServiceUtil.createInputData.VECTOR_LAYER(
                option.workspace,
                option.workspaceURI,
                option.queryName,
            );
            layerInputWithNameXml = WPSServiceUtil.organization.InputName(
                "features",
                layerInputXml,
            );
        }
        const xml =
            WPSServiceUtil.organization.Identifier("vec:Count") + // 工具标识符
            WPSServiceUtil.organization.DataInputs(layerInputWithNameXml) + // 参数
            WPSServiceUtil.organization.ResponseForm(
                "result",
                option.outputMimiType || "application/json",
            );

        return WPSServiceUtil.organization.Excute(xml);
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
     * helperUtils.request.postXml<any>(wpsurl, finishXmlString).then(res => {
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
        let layerInputWithNameXml = "";
        if (option.cql) {
            const featureQueryString = this.formatVectorQueryXmlString({
                workspace: option.workspace,
                workspaceURI: option.workspaceURI,
                queryName: option.queryName,
                attributes: [],
                cql: option.cql,
                outputMimiType: "application/json",
            });
            const featureQuerySubprocess =
                '<wps:Reference mimeType="application/json" xlink:href="http://geoserver/wps" method="POST">' +
                "<wps:Body>" +
                featureQueryString +
                "</wps:Body>" +
                "</wps:Reference>";
            layerInputWithNameXml = WPSServiceUtil.organization.InputName(
                "features",
                featureQuerySubprocess,
            );
        } else {
            const layerInputXml = WPSServiceUtil.createInputData.VECTOR_LAYER(
                option.workspace,
                option.workspaceURI,
                option.queryName,
            );
            layerInputWithNameXml = WPSServiceUtil.organization.InputName(
                "features",
                layerInputXml,
            );
        }

        let fieldInputWithNameXml = "";
        if (option.fieldName) {
            const fieldInputXml = `<wps:Data><wps:LiteralData>${option.fieldName}</wps:LiteralData></wps:Data>`;
            fieldInputWithNameXml = WPSServiceUtil.organization.InputName(
                "aggregationAttribute",
                fieldInputXml,
            );
        }

        const functionInputXml = `<wps:Data><wps:LiteralData>${option.functionName}</wps:LiteralData></wps:Data>`;
        const functionInputWithNameXml = WPSServiceUtil.organization.InputName(
            "function",
            functionInputXml,
        );
        const singlePassInputXml = `<wps:Data><wps:LiteralData>false</wps:LiteralData></wps:Data>`;
        const singlePassInputWithNameXml = WPSServiceUtil.organization.InputName(
            "singlePass",
            singlePassInputXml,
        );
        let groupByAttributesInputWithNameXml = "";
        if (option.groupByAttributes) {
            const groupByAttributesInputXml = `<wps:Data><wps:LiteralData>${option.groupByAttributes}</wps:LiteralData></wps:Data>`;
            groupByAttributesInputWithNameXml = WPSServiceUtil.organization.InputName(
                "groupByAttributes",
                groupByAttributesInputXml,
            );
        }
        const xml =
            WPSServiceUtil.organization.Identifier("vec:Aggregate") + // 工具标识符
            WPSServiceUtil.organization.DataInputs(
                layerInputWithNameXml +
                fieldInputWithNameXml +
                functionInputWithNameXml +
                singlePassInputWithNameXml +
                groupByAttributesInputWithNameXml,
            ) + // 参数
            WPSServiceUtil.organization.ResponseForm(
                "result",
                option.outputMimiType || "application/json",
            );

        return WPSServiceUtil.organization.Excute(xml);
    };

    /**
     * 对已完成的Execute XML添加xml头文件。
     * @param {XML} xml 任意Execute格式的XML.
     * @returns {XML} xml 完整的XML
     */
    finishXML = function (xml: string) {
        const finishXML = WPSServiceUtil.organization.headerXML + xml;
        return finishXML;
    };
}
