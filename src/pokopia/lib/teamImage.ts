import type { Pokemon } from '../data/types'
import type { Tier } from '@/data/types'
import { pokemonName } from '../i18n'
import type { Locale } from '@/data/types'

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

/** Render a 1200x630 share card: 5x2 grid of artwork with names and tier chips. */
export async function renderTeamImage(
  team: { pokemon: Pokemon; tier?: Tier }[],
  opts: { title: string; tagline: string; locale: Locale },
): Promise<Blob | null> {
  const W = 1200
  const H = 630
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#14532d')
  grad.addColorStop(1, '#16a34a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(opts.title, 48, 72)
  ctx.font = '26px sans-serif'
  ctx.fillStyle = '#bbf7d0'
  ctx.fillText(opts.tagline, 48, 112)

  const cols = 5
  const cellW = (W - 96) / cols
  const cellH = 218
  const top = 140

  const images = await Promise.all(team.map(({ pokemon }) => loadImage(pokemon.image)))

  team.forEach(({ pokemon, tier }, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = 48 + col * cellW
    const y = top + row * (cellH + 24)

    ctx.fillStyle = 'rgba(255,255,255,0.94)'
    ctx.beginPath()
    ctx.roundRect(x, y, cellW - 12, cellH, 16)
    ctx.fill()

    const img = images[i]
    if (img) {
      const maxW = cellW - 52
      const maxH = 128
      const scale = Math.min(maxW / img.width, maxH / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, x + (cellW - 12 - dw) / 2, y + 10 + (maxH - dh) / 2, dw, dh)
    }

    ctx.fillStyle = '#14532d'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    const name = pokemonName(pokemon, opts.locale)
    ctx.fillText(name, x + (cellW - 12) / 2, y + 168, cellW - 28)

    if (tier) {
      const chipW = 44
      const chipX = x + (cellW - 12 - chipW) / 2
      ctx.fillStyle = TIER_BG[tier]
      ctx.beginPath()
      ctx.roundRect(chipX, y + 180, chipW, 30, 15)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText(tier, x + (cellW - 12) / 2, y + 202)
    }
    ctx.textAlign = 'left'
  })

  ctx.fillStyle = '#d1fae5'
  ctx.font = '24px sans-serif'
  ctx.fillText('villagertier.com/pokopia', 48, H - 28)

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}
