import { expect, test } from 'vitest'
import wpsHelper from './wps.ts'
import utils from './utils'
test('使用wps计算某个图层的要素数量', async () => {
    const wpsHelperInstance = new wpsHelper();
    const countXml = wpsHelperInstance.formatFeatureCountXmlString({
        workspace: "qhd",
        workspaceURI: "http://qhd",
        queryName: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    const finishXmlString = wpsHelperInstance.finishXML(countXml);
    const wpsurl = `http://192.168.0.110:8082/geoserver/ows?service=WPS&version=1.0.0`;
    const res2 = await utils.common.postXml(wpsurl, finishXmlString)
    if (res2) {
        const jsonRes = JSON.parse(res2);
        expect(jsonRes).toBe(7)
    }

})