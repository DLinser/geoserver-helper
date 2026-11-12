const headerXML = '<?xml version="1.0" encoding="UTF-8"?>';

function tag(name: string, body: string) {
    return `<${name}>${body}</${name}>`;
}

function input(name: string, data: string) {
    return tag("wps:Input", tag("ows:Identifier", name) + data);
}

function responseForm(outputName: string, mimeType?: string) {
    const mime = mimeType ? ` mimeType="${mimeType}"` : "";
    return tag(
        "wps:ResponseForm",
        `<wps:RawDataOutput${mime}>${tag("ows:Identifier", outputName)}</wps:RawDataOutput>`,
    );
}

function literalInput(name: string, value: string | number | boolean) {
    const data = tag("wps:Data", tag("wps:LiteralData", String(value)));
    return input(name, data);
}

function complexInput(name: string, mimeType: string, value: string) {
    const data = tag(
        "wps:Data",
        `<wps:ComplexData mimeType="${mimeType}"><![CDATA[${value}]]></wps:ComplexData>`,
    );
    return input(name, data);
}

function referenceBody(mimeType: string, href: string, body: string) {
    return `<wps:Reference mimeType="${mimeType}" xlink:href="${href}" method="POST"><wps:Body>${body}</wps:Body></wps:Reference>`;
}

function referenceInput(name: string, mimeType: string, href: string, body: string) {
    return input(name, referenceBody(mimeType, href, body));
}

function vectorLayer(workspace: string, workspaceURL: string, queryName: string) {
    const getFeature =
        `<wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:${workspace}="${workspaceURL}">` +
        `<wfs:Query typeName="${queryName}"/></wfs:GetFeature>`;
    return referenceBody("text/xml", "http://geoserver/wfs", getFeature);
}

function layerFeatures(
    workspace: string,
    workspaceURL: string,
    queryName: string,
    queryExecuteXml?: string,
) {
    if (queryExecuteXml) {
        return input("features", referenceBody("application/json", "http://geoserver/wps", queryExecuteXml));
    }
    return input("features", vectorLayer(workspace, workspaceURL, queryName));
}

function processXml(processIdentifier: string, inputs: string, outputName: string, mimeType?: string) {
    const body =
        tag("ows:Identifier", processIdentifier) +
        tag("wps:DataInputs", inputs) +
        responseForm(outputName, mimeType);
    return '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
        body +
        "</wps:Execute>";
}

const WPSServiceUtil = {
    headerXML,
    literalInput,
    complexInput,
    referenceInput,
    layerFeatures,
    process: processXml,
};

export default WPSServiceUtil;
