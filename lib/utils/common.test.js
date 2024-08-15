import { expect, test } from 'vitest'
import { formateObjToParamStr } from './common.ts'

test('测试对象转Query类型的字符串', () => {
    expect(formateObjToParamStr({
        name: "beauty",
        age: 18
    })).toBe("name=beauty&age=18")
})