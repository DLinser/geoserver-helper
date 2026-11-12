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

test('离线：GetFeature 固定参数名并带上认证', async () => {
    const calls = []
    // globalThis 是全局对象。这里临时换掉 fetch，避免测试去访问真实 GeoServer。
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (input, init) => {
        calls.push({ url: String(input), headers: init?.headers })
        return new Response(JSON.stringify({ type: "FeatureCollection", features: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
        })
    }
    try {
        const wfs = new wfsHelper({
            url: "https://example.com/geoserver/wfs",
            userName: "admin",
            password: "geoserver",
            srsName: "EPSG:3857",
        })
        await wfs.GetFeature({
            typename: "topp:states",
            propertyname: "STATE_NAME",
            maxFeatures: 5,
        })
        await wfs.GetFeature({
            typename: "topp:states",
            version: "2.0.0",
            maxFeatures: 5,
        })
        const v1 = new URL(calls[0].url).searchParams
        expect(v1.get("version")).toBe("1.0.0")
        expect(v1.get("typename")).toBe("topp:states")
        expect(v1.get("typeNames")).toBeNull()
        expect(v1.get("propertyName")).toBe("STATE_NAME")
        expect(v1.get("maxFeatures")).toBe("5")
        expect(v1.get("count")).toBeNull()
        expect(v1.get("srsName")).toBe("EPSG:3857")
        expect(new Headers(calls[0].headers).get("authorization")).toContain("Basic ")

        const v2 = new URL(calls[1].url).searchParams
        expect(v2.get("version")).toBe("2.0.0")
        expect(v2.get("typename")).toBe("topp:states")
        expect(v2.get("typeNames")).toBeNull()
        expect(v2.get("maxFeatures")).toBe("5")
        expect(v2.get("count")).toBeNull()
    } finally {
        globalThis.fetch = originalFetch
    }
})

test('离线：GetFeature 拒绝非 JSON 和缺失图层', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () => new Response("<ServiceException/>", {
        status: 200,
        headers: { "content-type": "text/xml" },
    })
    try {
        const wfs = new wfsHelper({ url: "https://example.com/geoserver/wfs" })
        await expect(wfs.GetFeature({ typename: "topp:states" })).rejects.toThrow(/期望 JSON/)
        await expect(wfs.GetFeature()).rejects.toThrow(/图层名/)
    } finally {
        globalThis.fetch = originalFetch
    }
})

test('离线：POST CQL 不再把 TOUCHES 当成 DISJOINT', async () => {
    const { creatFeatureRequestXml, creatFeatureTransactionXml } = await import("./utils/wfsXml.ts")
    expect(() => creatFeatureRequestXml({
        srsName: "EPSG:4326",
        featureNS: "http://www.openplans.org/topp",
        featurePrefix: "topp",
        featureTypes: ["topp:states"],
        outputFormat: "application/json",
        cql: "TOUCHES(the_geom, POINT(1 2))",
    })).toThrow(/TOUCHES/)
    expect(() => creatFeatureRequestXml({
        srsName: "EPSG:4326",
        featureNS: "http://www.openplans.org/topp",
        featurePrefix: "topp",
        featureTypes: ["topp:states"],
        outputFormat: "application/json",
        cql: "STATE_NAME = 'TOUCHES'",
    })).not.toThrow()

    const geographic = creatFeatureTransactionXml({
        type: "create",
        featurePrefix: "topp",
        featureNS: "http://www.openplans.org/topp",
        featureType: "states",
        srsName: "EPSG:4326",
        features: [{ type: "Point", coordinates: [118.1, 39.2], properties: { name: "a" } }],
    })
    const projected = creatFeatureTransactionXml({
        type: "create",
        featurePrefix: "topp",
        featureNS: "http://www.openplans.org/topp",
        featureType: "states",
        srsName: "EPSG:3857",
        features: [{ type: "Point", coordinates: [100, 200], properties: { name: "a" } }],
    })
    function readPos(xml) {
        const matched = xml.match(/<pos[^>]*>([^<]+)<\/pos>/)
        if (!matched) {
            throw new Error("XML 里没有坐标")
        }
        return matched[1].trim()
    }
    expect(readPos(geographic)).toBe("118.1 39.2")
    expect(readPos(projected)).toBe("200 100")
})
