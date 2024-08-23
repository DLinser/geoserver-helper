import { expect, test } from 'vitest'
import wfsHelper from './wfs.ts'
test('使用wfs查询矢量图层要素', async () => {
    const wfsHelperInstance = new wfsHelper({
        url: "http://192.168.0.110:8082/geoserver/ows"
    });
    const res = await wfsHelperInstance.queryFeatures({
        propertyname: "name,gb",
        typename: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    if (res) {
        console.log(res)
        expect(Boolean(res.features)).toBe(true)
    }

})

test('使用wfs的POST方式查询矢量图层要素', async () => {
    const wfsHelperInstance = new wfsHelper({
        url: "http://192.168.0.110:8082/geoserver/wfs"
    });
    const res = await wfsHelperInstance.queryFeaturesByPost({
        propertyname: "name,gb",
        typename: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    if (res) {
        console.log(res)
        expect(Boolean(res.features)).toBe(true)
    }

})