import { expect, test } from 'vitest'
import restHelper from './rest.ts'

test('查询图层列表的接口是否通', async () => {
    const restHelperInstance = new restHelper({
        url: "/geoserver"
    })
    const res = await restHelperInstance.getLayersListApi("qhd")
    layers
    expect(Boolean(res.layers)).toBe(true)
})