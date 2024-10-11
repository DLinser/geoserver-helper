/*
 * @Author: lyxstart
 * @Date: 2024-08-24 11:04:54
 * @LastEditors: linyongxin linyongxin@ellipspace.com
 * @LastEditTime: 2024-10-11 16:11:17
 * @Description: wfs测试类
 * @FilePath: \geoserver-helper\lib\wfs.test.js
 */
import { testQhdGeoserverUrl } from './config/vitestConfig.ts'
import { expect, test } from 'vitest'
import wfsHelper from './wfs.ts'
const wfsHelperInstance = new wfsHelper({
    url: `${testQhdGeoserverUrl}/ows`,
    userName: "admin",
    password: "geoserver",
});
test('使用wfs查询矢量图层要素', async () => {
    const res = await wfsHelperInstance.GetFeature({
        propertyname: "name,gb",
        typename: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    if (res) {
        expect(res).toHaveProperty("features")
        // expect(Boolean(res.features)).toBe(true)
    }

})

test('使用wfs的POST方式查询矢量图层要素', async () => {
    const res = await wfsHelperInstance.GetFeatureByPost({
        propertyname: "name,gb",
        typename: "qhd:xzqh_xian",
        cql: "gb like '1561303%'",
    });
    if (res) {
        expect(res).toHaveProperty("features")
    }
})

test('查询某个图层的字段信息', async () => {
    const res = await wfsHelperInstance.DescribeFeatureType({
        typeName: "qhd:xzqh_xian",
    });
    if (res) {
        expect(res).toHaveProperty("featureTypes")
    }
})

test('查询某个图层的某特定属性属性表', async () => {
    const res = await wfsHelperInstance.GetPropertyValue({
        typeNames: "qhd:xzqh_xian",
        valueReference: "name"
    });
    if (res) {
        expect(Boolean(res.ValueCollection)).toBe(true)
    }
})