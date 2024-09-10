import { expect, test } from 'vitest'
import wpsHelper from './wps.ts'
import fetchUtil from './utils/fetch'
import { testQhdGeoserverUrl } from './config/vitestConfig.ts'
const wpsHelperInstance = new wpsHelper(`${testQhdGeoserverUrl}/ows`);
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