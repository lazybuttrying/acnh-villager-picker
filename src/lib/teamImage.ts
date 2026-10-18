import type { Tier } from '@/data/types'

export interface TeamImageMember {
  name: string
  image: string
  tier: Tier
}

const W = 1200
const H = 1200
const TIER_STYLE: Record<Tier, { bg: string; fg: string }> = {
  S: { bg: '#fbbf24', fg: '#451a03' },
  A: { bg: '#10b981', fg: '#ffffff' },
  B: { bg: '#3b82f6', fg: '#ffffff' },
  C: { bg: '#9ca3af', fg: '#ffffff' },
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Minimal sprout mark matching the site favicon (green rounded square, stem, two leaves, amber dot). */
function drawSprout(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  roundRect(ctx, x, y, s, s, s * 0.24)
  ctx.fillStyle = '#16a34a'
  ctx.fill()
  const u = s / 64
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4.5 * u
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + 32 * u, y + 50 * u)
  ctx.lineTo(x + 32 * u, y + 30 * u)
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.save()
  ctx.translate(x + 21 * u, y + 27 * u)
  ctx.rotate(-0.55)
  ctx.beginPath()
  ctx.ellipse(0, 0, 11 * u, 6 * u, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = '#bbf7d0'
  ctx.save()
  ctx.translate(x + 43 * u, y + 23 * u)
  ctx.rotate(0.55)
  ctx.beginPath()
  ctx.ellipse(0, 0, 11 * u, 6 * u, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(x + 32 * u, y + 47 * u, 4 * u, 0, Math.PI * 2)
  ctx.fill()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${src}`))
    img.src = src
  })
}

/**
 * Render a shareable team card (1200x1200 PNG).
 * Villager images are same-origin relative paths, so the canvas stays untainted.
 */
export async function drawTeamImage(
  members: TeamImageMember[],
  title: string,
  tagline: string,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#f0fdf4')
  bg.addColorStop(1, '#dcfce7')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Header band
  ctx.fillStyle = '#16a34a'
  ctx.fillRect(0, 0, W, 210)
  drawSprout(ctx, 56, 55, 100)
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText('villagertier.com', 180, 92)
  ctx.font = '600 44px system-ui, sans-serif'
  ctx.fillStyle = '#bbf7d0'
  ctx.fillText(title, 180, 158)

  // Member grid: 5 cols x 2 rows
  const cols = 5
  const cellW = (W - 96) / cols
  const top = 250
  const rowH = 330
  const images = await Promise.all(members.map((m) => loadImage(m.image)))

  members.forEach((m, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cx = 48 + col * cellW + cellW / 2
    const cy = top + row * rowH

    const imgSize = 176
    ctx.save()
    roundRect(ctx, cx - imgSize / 2, cy, imgSize, imgSize, 24)
    ctx.clip()
    ctx.drawImage(images[i], cx - imgSize / 2, cy, imgSize, imgSize)
    ctx.restore()

    // Tier chip
    const style = TIER_STYLE[m.tier]
    const chip = m.tier
    ctx.font = '700 30px system-ui, sans-serif'
    const tw = ctx.measureText(chip).width
    const cw = tw + 28
    const chx = cx - cw / 2
    const chy = cy + imgSize + 14
    roundRect(ctx, chx, chy, cw, 44, 22)
    ctx.fillStyle = style.bg
    ctx.fill()
    ctx.fillStyle = style.fg
    ctx.textAlign = 'center'
    ctx.fillText(chip, cx, chy + 23)
    ctx.textAlign = 'left'

    // Name
    ctx.fillStyle = '#14532d'
    ctx.font = '600 34px system-ui, sans-serif'
    const name = m.name.length > 9 ? `${m.name.slice(0, 9)}…` : m.name
    const nw = ctx.measureText(name).width
    ctx.fillText(name, cx - nw / 2, chy + 92)
  })

  // Footer
  ctx.fillStyle = '#15803d'
  ctx.font = '600 36px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(tagline, W / 2, H - 96)
  ctx.fillStyle = '#4d7c0f'
  ctx.font = '400 30px system-ui, sans-serif'
  ctx.fillText('villagertier.com', W / 2, H - 48)
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  })
}
