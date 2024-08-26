/*
 * @Author: your name
 * @Date: 2024-08-25 15:33:39
 * @LastEditors: linyongxin linyongxin@ellipspace.com
 * @LastEditTime: 2024-08-26 10:15:10
 * @Description: 
 * @FilePath: \geoserver-helper\lib\wms.test.js
 */
import { expect, test } from 'vitest'
import wmsHelper from './wms.ts'
import { testOlGeoserverUrl } from './config/vitestConfig.ts'
test('获取wms能力集', async () => {
    const wmsHelperInstance = new wmsHelper({
        url: `${testOlGeoserverUrl}/ows`,
    });
    const res = await wmsHelperInstance.GetCapabilities()
    if (res) {
        expect(res).toHaveProperty("Capability")
        // expect(Boolean(res.Capability)).toBe(true)
    }

})