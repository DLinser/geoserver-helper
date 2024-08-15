import { expect, test } from 'vitest'
import { sum } from './main.ts'

test('计算1+1是否等于2', () => {
    expect(sum(1, 2)).toBe(3)
})