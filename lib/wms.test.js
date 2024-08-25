/*
 * @Author: your name
 * @Date: 2024-08-25 15:33:39
 * @LastEditors: 林永鑫
 * @LastEditTime: 2024-08-25 15:39:03
 * @Description: 
 * @FilePath: \geoserver-helper\lib\wms.test.js
 */
import { expect, test } from 'vitest'
import wmsHelper from './wms.ts'
test('获取wms能力集', async () => {
    const wmsHelperInstance = new wmsHelper({
        url: "http://124.232.190.101:30500/geoserver/ows",
      });
    const res = await wmsHelperInstance.GetCapabilities()
    if (res) {
        expect(Boolean(res.Capability)).toBe(true)
    }

})