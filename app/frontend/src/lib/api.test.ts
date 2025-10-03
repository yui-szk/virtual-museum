import { describe, expect, it } from 'vitest'
import { ItemSchema } from './types'

describe('ItemSchema', () => {
  it('parses a valid item', () => {
    const got = ItemSchema.parse({ id: 1, name: 'x', createdAt: new Date().toISOString() })
    expect(got.id).toBe(1)
  })
  it('rejects invalid item', () => {
    expect(() => ItemSchema.parse({ id: 'a' })).toThrow()
  })
})

