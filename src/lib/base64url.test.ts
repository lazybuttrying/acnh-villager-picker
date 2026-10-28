import { describe, expect, it } from 'vitest'
import { decodeBase64Url, encodeBase64Url } from './base64url'

describe('base64url codec', () => {
  it('round-trips ASCII and non-ASCII input', () => {
    expect(decodeBase64Url(encodeBase64Url('cat10:S,hip04:A'))).toBe('cat10:S,hip04:A')
    expect(decodeBase64Url(encodeBase64Url('café'))).toBe('café')
  })

  it('produces URL-safe output', () => {
    expect(encodeBase64Url('>>>???<<<')).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('throws on malformed input', () => {
    expect(() => decodeBase64Url('!!!')).toThrow()
  })
})
