/*
 * @Author: your name
 * @Date: 2024-08-24 11:04:54
 * @LastEditors: 林永鑫
 * @LastEditTime: 2024-08-24 21:06:14
 * @Description: 
 * @FilePath: \geoserver-helper\lib\wfs.test.js
 */
import { expect, test } from 'vitest'
import wfsHelper from './wfs.ts'
const wfsHelperInstance = new wfsHelper({
    url: "http://192.168.0.110:8082/geoserver/ows"
});
test('使用wfs查询矢量图层要素', async () => {
    const res = await wfsHelperInstance.GetFeature({
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
    const res = await wfsHelperInstance.GetFeatureByPost({
        propertyname: "name,gb",
        typename: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    if (res) {
        expect(Boolean(res.features)).toBe(true)
    }
})

test('查询某个图层的字段信息', async () => {
    const res = await wfsHelperInstance.DescribeFeatureType({
        typeName: "qhd:xzqh_xian",
    });
    if (res) {
        expect(Boolean(res.featureTypes)).toBe(true)
    }
})

test('查询某个图层的某特定属性属性表', async () => {
    const res = await wfsHelperInstance.GetPropertyValue({
        typeNames: "qhd:xzqh_xian",
        valueReference:"name"
    });
    if (res) {
        expect(Boolean(res.featureTypes)).toBe(true)
    }
})