import type { Tier } from '@/data/types'
import { pokemonName } from '../i18n'
import type { Locale } from '@/data/types'
import type { TeamEntry } from './shareTeam'

const TIER_BG: Record<Tier, string> = {
  S: '#fbbf24',
  A: '#10b981',
  B: '#3b82f6',
  C: '#9ca3af',
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/**
 * Render a share card grouped by house: one labeled row per house (up to 4
 * residents each), on the warm Pokopia gradient. Height grows with houses.
 */
export async function renderTeamImage(
  houses: TeamEntry[][],
  opts: { title: string; tagline: string; locale: Locale; houseLabel: (n: number) => string },
): Promise<Blob | null> {
  const W = 1200
  const HEADER = 136
  const BLOCK = 224
  const H = HEADER + houses.length * BLOCK + 52
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#7c2d12')
  grad.addColorStop(1, '#ea580c')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(opts.title, 48, 66)
  ctx.font = '26px sans-serif'
  ctx.fillStyle = '#fed7aa'
  ctx.fillText(opts.tagline, 48, 106)

  const flat = houses.flat()
  const images = await Promise.all(flat.map(({ pokemon }) => loadImage(pokemon.image)))
  const imgById = new Map(flat.map(({ pokemon }, i) => [pokemon.id + i, images[i]]))
  let cursor = 0

  const cardW = (W - 96 - 3 * 12) / 4
  const cardH = 176

  houses.forEach((house, hi) => {
    const top = HEADER + hi * BLOCK
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(opts.houseLabel(hi + 1), 48, top + 28)

    house.forEach(({ pokemon, tier }, i) => {
      const x = 48 + i * (cardW + 12)
      const y = top + 44
      const img = imgById.get(pokemon.id + cursor)
      cursor++

      ctx.fillStyle = 'rgba(255,255,255,0.94)'
      ctx.beginPath()
      ctx.roundRect(x, y, cardW, cardH, 16)
      ctx.fill()

      if (img) {
        const maxW = cardW - 40
        const maxH = 104
        const scale = Math.min(maxW / img.width, maxH / img.height)
        const dw = img.width * scale
        const dh = img.height * scale
        ctx.drawImage(img, x + (cardW - dw) / 2, y + 8 + (maxH - dh) / 2, dw, dh)
      }

      ctx.fillStyle = '#7c2d12'
      ctx.font = 'bold 23px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(pokemonName(pokemon, opts.locale), x + cardW / 2, y + 140, cardW - 20)

      if (tier) {
        const chipW = 42
        ctx.fillStyle = TIER_BG[tier]
        ctx.beginPath()
        ctx.roundRect(x + (cardW - chipW) / 2, y + 148, chipW, 26, 13)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 18px sans-serif'
        ctx.fillText(tier, x + cardW / 2, y + 167)
      }
      ctx.textAlign = 'left'
    })
  })

  ctx.fillStyle = '#ffedd5'
  ctx.font = '24px sans-serif'
  ctx.fillText('villagertier.com/pokopia', 48, H - 20)

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}
