import { describe, expect, it } from 'vitest'
import { decodeTeam, encodeTeam } from './shareTeam'

describe('shareTeam codec', () => {
  it('round-trips a team', () => {
    const members = [
      { id: 'cat10', tier: 'S' as const },
      { id: 'hip04', tier: 'A' as const },
      { id: 'chn00', tier: 'C' as const },
    ]
    expect(decodeTeam(encodeTeam(members))).toEqual(members)
  })

  it('produces URL-safe codes', () => {
    const members = Array.from({ length: 10 }, (_, i) => ({
      id: `cat${i}`,
      tier: 'S' as const,
    }))
    expect(encodeTeam(members)).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('rejects garbage input', () => {
    expect(decodeTeam('')).toBeNull()
    expect(decodeTeam('!!!not-valid!!!')).toBeNull()
    expect(decodeTeam('aGVsbG8=')).toBeNull() // 'hello' — no id:tier pairs
  })

  it('rejects unknown tiers', () => {
    expect(decodeTeam(btoa('cat10:Z'))).toBeNull()
  })

  it('rejects empty or oversized teams', () => {
    expect(decodeTeam(encodeTeam([]))).toBeNull()
    const big = Array.from({ length: 11 }, (_, i) => ({ id: `cat${i}`, tier: 'S' as const }))
    expect(decodeTeam(encodeTeam(big))).toBeNull()
  })
})
