import { expect, test } from 'vitest'
import wpsHelper from './wps.ts'
import fetchUtil from './utils/fetch'
import { testQhdGeoserverUrl } from './config/vitestConfig.ts'
const wpsHelperInstance = new wpsHelper(`${testQhdGeoserverUrl}/ows`);

test('离线：WPS 查询 XML 带上头，缺参数会抛错', () => {
    expect(() => wpsHelperInstance.formatQueryXmlString()).toThrow(/缺少必要的参数/)
    const queryXml = wpsHelperInstance.formatQueryXmlString({
        geoFile: "the_geom",
        cqlFilter: "STATE_NAME = 'California'",
        workspace: "topp",
        namespaceURL: "http://www.openplans.org/topp",
        typeName: "topp:states",
    })
    expect(queryXml.startsWith("<?xml")).toBe(false)
    expect(queryXml).toContain("<ows:Identifier>gs:Query</ows:Identifier>")
    expect(queryXml).toContain('xmlns:topp="http://www.openplans.org/topp"')
    expect(queryXml).toContain('typeName="topp:states"')
    expect(wpsHelperInstance.finishXML(queryXml).startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)

    const countXml = wpsHelperInstance.formatFeatureCountXmlString({
        workspace: "topp",
        workspaceURI: "http://www.openplans.org/topp",
        queryName: "topp:states",
        cql: "STATE_NAME = 'California'",
    })
    expect(countXml).toContain("<ows:Identifier>vec:Count</ows:Identifier>")
    expect(countXml).toContain("<ows:Identifier>vec:Query</ows:Identifier>")
    expect(countXml).toContain("STATE_NAME = 'California'")
})

test('离线：缓冲区、质心、简化 XML', () => {
    const bufferXml = wpsHelperInstance.formatBufferXmlString({
        workspace: "topp",
        workspaceURI: "http://www.openplans.org/topp",
        queryName: "topp:states",
        distance: 1000,
        attributeName: "buffer_m",
        cql: "STATE_NAME = 'California'",
    })
    expect(bufferXml).toContain("<ows:Identifier>vec:BufferFeatureCollection</ows:Identifier>")
    expect(bufferXml).toContain("<ows:Identifier>distance</ows:Identifier>")
    expect(bufferXml).toContain("<wps:LiteralData>1000</wps:LiteralData>")
    expect(bufferXml).toContain("<ows:Identifier>attributeName</ows:Identifier>")
    expect(bufferXml).toContain("<wps:LiteralData>buffer_m</wps:LiteralData>")
    expect(bufferXml).toContain("STATE_NAME = 'California'")

    const centroidXml = wpsHelperInstance.formatCentroidXmlString({
        workspace: "topp",
        workspaceURI: "http://www.openplans.org/topp",
        queryName: "topp:states",
        cql: "STATE_NAME = 'California'",
    })
    expect(centroidXml).toContain("<ows:Identifier>vec:Centroid</ows:Identifier>")
    expect(centroidXml).toContain("STATE_NAME = 'California'")

    const simplifyXml = wpsHelperInstance.formatSimplifyXmlString({
        workspace: "topp",
        workspaceURI: "http://www.openplans.org/topp",
        queryName: "topp:states",
        distance: 0.01,
        preserveTopology: true,
        cql: "STATE_NAME = 'California'",
    })
    expect(simplifyXml).toContain("<ows:Identifier>vec:Simplify</ows:Identifier>")
    expect(simplifyXml).toContain("<ows:Identifier>preserveTopology</ows:Identifier>")
    expect(simplifyXml).toContain("<wps:LiteralData>true</wps:LiteralData>")
    expect(simplifyXml).toContain("STATE_NAME = 'California'")
})

const qhdLayer = {
    workspace: "qhd",
    workspaceURI: "http://qhd",
    queryName: "qhd:xzqh_xian",
    cql: "gb like '1561303%'",
}
const wpsurl = `${testQhdGeoserverUrl}/ows?service=WPS&version=1.0.0`

function readWpsJson(res) {
    return typeof res === "string" ? JSON.parse(res) : res
}

test('使用wps对图层做缓冲区', async () => {
    const xml = wpsHelperInstance.formatBufferXmlString({
        ...qhdLayer,
        distance: 0.01,
    })
    const res = await fetchUtil.postXml(wpsurl, wpsHelperInstance.finishXML(xml))
    const jsonRes = readWpsJson(res)
    expect(jsonRes.features.length).toBe(7)
    expect(jsonRes.features[0].geometry.type).toMatch(/Polygon/)
})

test('使用wps计算图层质心', async () => {
    const xml = wpsHelperInstance.formatCentroidXmlString(qhdLayer)
    const res = await fetchUtil.postXml(wpsurl, wpsHelperInstance.finishXML(xml))
    const jsonRes = readWpsJson(res)
    expect(jsonRes.features.length).toBe(7)
    expect(jsonRes.features[0].geometry.type).toBe("Point")
})

test('使用wps简化图层要素', async () => {
    const xml = wpsHelperInstance.formatSimplifyXmlString({
        ...qhdLayer,
        distance: 0.01,
        preserveTopology: true,
    })
    const res = await fetchUtil.postXml(wpsurl, wpsHelperInstance.finishXML(xml))
    const jsonRes = readWpsJson(res)
    expect(jsonRes.features.length).toBe(7)
    expect(jsonRes.features[0].geometry.type).toMatch(/Polygon/)
})
test('使用wps计算某个图层的要素数量', async () => {
    const countXml = wpsHelperInstance.formatFeatureCountXmlString({
        workspace: "qhd",
        workspaceURI: "http://qhd",
        queryName: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    const finishXmlString = wpsHelperInstance.finishXML(countXml);
    const wpsurl = `${testQhdGeoserverUrl}/ows?service=WPS&version=1.0.0`;
    const res2 = await fetchUtil.postXml(wpsurl, finishXmlString)
    if (res2) {
        const jsonRes = JSON.parse(res2);
        expect(jsonRes).toBe(7)
    }
})

test('获取wps能力集', async () => {
    const res = await wpsHelperInstance.GetCapabilities();
    expect(res).toHaveProperty("Capabilities")
})

test('获取wps某个算子描述', async () => {
    const res = await wpsHelperInstance.DescribeProcess({
        identifier: "JTS:buffer"
    });
    expect(res).toHaveProperty("ProcessDescriptions")
})