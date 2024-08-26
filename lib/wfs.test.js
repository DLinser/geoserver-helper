/*
 * @Author: lyxstart
 * @Date: 2024-08-24 11:04:54
 * @LastEditors: linyongxin linyongxin@ellipspace.com
 * @LastEditTime: 2024-08-26 10:51:10
 * @Description: wfs测试类
 * @FilePath: \geoserver-helper\lib\wfs.test.js
 */
import { testOlGeoserverUrl } from './config/vitestConfig.ts'
import { expect, test } from 'vitest'
import wfsHelper from './wfs.ts'
const wfsHelperInstance = new wfsHelper({
    url: `${testOlGeoserverUrl}/ows`
});
test('使用wfs查询矢量图层要素', async () => {
    const res = await wfsHelperInstance.GetFeature({
        propertyname: "STATE_NAME,STATE_ABBR",
        typename: "topp:states",
        cql: "STATE_NAME like 'CO%'",
    });
    if (res) {
        console.log(res)
        expect(res).toHaveProperty("features")
        // expect(Boolean(res.features)).toBe(true)
    }

})

test('使用wfs的POST方式查询矢量图层要素', async () => {
    const res = await wfsHelperInstance.GetFeatureByPost({
        propertyname: "STATE_NAME",
        typename: "topp:states",
        cql: "STATE_NAME like 'CO%'",
    });
    if (res) {
        expect(res).toHaveProperty("features")
    }
})

test('查询某个图层的字段信息', async () => {
    const res = await wfsHelperInstance.DescribeFeatureType({
        typeName: "topp:states",
    });
    if (res) {
        expect(res).toHaveProperty("featureTypes")
    }
})

test('查询某个图层的某特定属性属性表', async () => {
    const res = await wfsHelperInstance.GetPropertyValue({
        typeNames: "topp:states",
        valueReference: "STATE_NAME"
    });
    if (res) {
        expect(Boolean(res.ValueCollection)).toBe(true)
    }
})