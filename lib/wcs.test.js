import { expect, test } from 'vitest'
import wcsHelper from './wcs.ts'
import { testQhdGeoserverUrl } from './config/vitestConfig.ts'
const wcsHelperInstance = new wcsHelper({
    url: `${testQhdGeoserverUrl}/ows`,
});

test('获取wcs能力集', async () => {
    const res = await wcsHelperInstance.GetCapabilities();
    expect(res).toHaveProperty("Capabilities")
})

test('获取wcs某个影像描述', async () => {
    const res = await wcsHelperInstance.DescribeCoverage({
        version: "2.0.1",
        coverage: "nurc:Pk50095",
    });
    expect(res).toHaveProperty("CoverageDescriptions")
})