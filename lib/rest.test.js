import { expect, test } from 'vitest'
import restHelper from './rest.ts'
const restHelperInstance = new restHelper({
    //vitest 不支持代理模式 默认允许跨域
    url: "http://192.168.0.110:8082/geoserver"
})
test('查询图层列表的接口是否通', async () => {
    const res = await restHelperInstance.getLayerListApi("qhd")
    expect(Boolean(res.layers)).toBe(true)
})

test('查询单图层详情接口是否通', async () => {
    const res = await restHelperInstance.getLayerInfoApi("qhd:xzqh_shi")
    expect(Boolean(res.layer)).toBe(true)
})

test('查询单图层切片任务接口是否通', async () => {
    const res = await restHelperInstance.getLayerCacheTasksApi("qhd:xzqh_shi")
    expect(Boolean(res["long-array-array"])).toBe(true)
})

test('查询工作空间列表的接口是否通', async () => {
    const res = await restHelperInstance.getWorkspaceListApi()
    expect(Boolean(res.workspaces)).toBe(true)
})

test('查询单个工作空间详情的接口是否通', async () => {
    const res = await restHelperInstance.getWorkspaceInfoApi("qhd")
    expect(Boolean(res.workspace)).toBe(true)
})

test('查询单个命名空间详情的接口是否通', async () => {
    const res = await restHelperInstance.getNamespacesInfoApi("qhd")
    expect(Boolean(res.namespace)).toBe(true)
})


// test('查询单图层编辑接口是否通', async () => {
//     const currentLayerModifyInfo = {
//         defaultStyle: {
//             name: "qhd:xzqh_shi",
//             // name: "polygon",
//         },
//     }
//     const res = await restHelperInstance.modifyLayerApi("xzqh_shi",
//         currentLayerModifyInfo,
//         "qhd")
//     expect(res).toBe("")
// })
