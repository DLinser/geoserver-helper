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
test('获取wms图例', async () => {
    const wmsHelperInstance = new wmsHelper({
        url: `${testOlGeoserverUrl}/ows`,
    });
    const res = await wmsHelperInstance.GetLegendGraphic({
        layer: "topp:states"
    })
    if (res) {
        expect(res).toHaveProperty("Legend")
    }
})