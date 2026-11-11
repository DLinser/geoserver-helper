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

test('获取wms地图', async () => {
    const wmsHelperInstance = new wmsHelper({
        url: `${testOlGeoserverUrl}/ows`,
    });
    const res = await wmsHelperInstance.GetMap({
        layers: "topp:states",
        bbox: "-124.73,24.96,-66.97,49.37",
        width: 512,
        height: 256,
        format: "image/png",
        transparent: true,
    })
    if (res) {
        expect(res).toBeInstanceOf(Blob)
    }
})

test('使用wms查询要素信息', async () => {
    const wmsHelperInstance = new wmsHelper({
        url: `${testOlGeoserverUrl}/ows`,
    });
    const res = await wmsHelperInstance.GetFeatureInfo({
        layers: "topp:states",
        bbox: "-124.73,24.96,-66.97,49.37",
        width: 256,
        height: 256,
        x: 128,
        y: 128,
    })
    if (res) {
        expect(res).toHaveProperty("features")
    }
})