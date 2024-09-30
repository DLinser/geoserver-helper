import { expect, test } from 'vitest'
import restHelper from './rest.ts'
import { testQhdGeoserverUrl } from './config/vitestConfig.ts'
const restHelperInstance = new restHelper({
    //vitest 不支持代理模式 默认允许跨域
    url: testQhdGeoserverUrl,
    userName: "admin",
    password: "geoserver",
})
test('查询图层列表的接口是否通', async () => {
    const res = await restHelperInstance.getLayerListApi("topp")
    expect(Boolean(res.layers)).toBe(true)
})

test('查询单图层详情接口是否通', async () => {
    const res = await restHelperInstance.getLayerInfoApi("topp:states")
    expect(Boolean(res.layer)).toBe(true)
})

test('查询单图层切片任务接口是否通', async () => {
    const res = await restHelperInstance.getLayerCacheTasksApi("topp:states")
    // expect(Boolean(res["long-array-array"])).toBe(true)
    expect(res).toHaveProperty("long-array-array")
})

test('查询工作空间列表的接口是否通', async () => {
    const res = await restHelperInstance.getWorkspaceListApi()
    expect(Boolean(res.workspaces)).toBe(true)
})

test('查询单个工作空间详情的接口是否通', async () => {
    const res = await restHelperInstance.getWorkspaceInfoApi("topp")
    expect(Boolean(res.workspace)).toBe(true)
})

test('查询单个命名空间详情的接口是否通', async () => {
    const res = await restHelperInstance.getNamespacesInfoApi("topp")
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

test('查询矢量数据存储列表接口是否通', async () => {
    const res = await restHelperInstance.getDatastoreListApi("qhd")
    expect(Boolean(res.dataStores)).toBe(true)
})
test('查询栅格数据存储列表接口是否通', async () => {
    const res = await restHelperInstance.getCoveragestoresListApi("qhd")
    expect(Boolean(res.coverageStores)).toBe(true)
})

test('服务器状态接口是否通', async () => {
    const res = await restHelperInstance.getSystemStatus()
    expect(Boolean(res.metrics)).toBe(true)
})
test('服务器版本接口是否通', async () => {
    const res = await restHelperInstance.getVersion()
    expect(Boolean(res.about)).toBe(true)
})

test('服务器字体接口是否通', async () => {
    const res = await restHelperInstance.getFonts()
    expect(Boolean(res.fonts)).toBe(true)
})

test('获取server日志配置', async () => {
    const res = await restHelperInstance.getLoggingConfig()
    expect(Boolean(res.logging)).toBe(true)
})

test('获取超级管理员密码', async () => {
    const res = await restHelperInstance.getMasterPassword()
    expect(Boolean(res.oldMasterPassword)).toBe(true)
})
test('获取角色列表', async () => {
    const res = await restHelperInstance.getRoles()
    expect(res).toHaveProperty("roles")
})

test('获取图层的数据校验规则', async () => {
    const res = await restHelperInstance.getSecurityRulesOfLayersBased()
    expect(Boolean(res)).toBe(true)
})



