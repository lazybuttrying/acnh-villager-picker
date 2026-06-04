<!--
  DESIGN.md — Animal Crossing Villager Picker
  A plain-markdown design system spec. This document is read by AI agents to
  generate UI that is visually consistent with the existing app.
  Source of truth: src/index.css, tailwind.config.js, src/components/ui/*,
  src/components/eval/VillagerCard.tsx, src/components/viz/RecommendPanel.tsx.
  Format: Stitch DESIGN.md (https://stitch.withgoogle.com/docs/design-md/specification/)
  with the awesome-design-md extended sections.
-->

# Animal Crossing Villager Picker — Design System

> A browser-only tool that helps Animal Crossing: New Horizons players rate the
> 391 villagers (S/A/B/C) and get a recommended "dream team" that balances their
> favorites with personality and species diversity. No install, no login.
>
> **This document is read by AI agents to generate consistent UI.** Prefer the
> tokens and classes below over inventing new values.

---

## 1. Visual Theme & Atmosphere

- **Mood:** Cozy, organic, nature-inspired — the calm of an Animal Crossing
  island. Friendly, approachable, never corporate.
- **Core palette:** A grounded **teal/forest-green** base lifted by a warm
  **amber/gold** accent. Green carries the brand; amber signals the top tier and
  hover warmth.
- **Density:** Medium. The tool is data-dense (a 391-card grid, a recommendation
  panel) but breathes through generous card padding and a roomy container.
- **Shape language:** Rounded everything — `rounded-xl` cards, `rounded-md`
  controls, `rounded-full` pills and state dots. Soft `shadow-sm` surfaces, not
  hard edges.
- **Theming:** Fully tokenized for **light and dark** via CSS variables. Never
  hard-code a color that has a token.
- **Philosophy:** _Semantic tokens first, diversity over repetition, state shown
  with rings not shadows._

---

## 2. Color Palette & Roles

All colors are CSS custom properties in `src/index.css`, consumed as
`hsl(var(--token))` and surfaced as Tailwind classes via `tailwind.config.js`.
Values are **`H S% L%`** triplets (the `hsl()` wrapper is applied by Tailwind).

### Core tokens

| Token | Role | Light | Dark | Tailwind |
|---|---|---|---|---|
| `--background` | App canvas | `150 30% 98%` (≈`#f6fbf8`) | `160 25% 10%` (≈`#13201c`) | `bg-background` |
| `--foreground` | Primary text | `160 25% 15%` (≈`#1d302a`) | `150 20% 95%` (≈`#eef7f1`) | `text-foreground` |
| `--card` | Card surface | `0 0% 100%` | `160 22% 13%` | `bg-card` / `text-card-foreground` |
| `--popover` | Popover/menu surface | `0 0% 100%` | `160 22% 13%` | `bg-popover` |
| `--primary` | Brand, buttons, focus ring | `150 45% 40%` (≈`#389466`) | `150 50% 50%` (≈`#40bf80`) | `bg-primary` / `text-primary-foreground` |
| `--secondary` | Muted green surfaces | `150 20% 92%` | `160 15% 20%` | `bg-secondary` |
| `--muted` | Subtle fills | `150 15% 94%` | `160 15% 20%` | `bg-muted` |
| `--muted-foreground` | Secondary text, labels | `160 10% 40%` | `150 10% 65%` | `text-muted-foreground` |
| `--accent` | Hover wash, warmth | `40 90% 90%` (≈`#fcedcf`) | `40 50% 25%` | `bg-accent` / `text-accent-foreground` |
| `--destructive` | Danger, exclude | `0 75% 55%` (≈`#e03b3b`) | `0 60% 50%` | `bg-destructive` |
| `--border` / `--input` | Hairlines, fields | `150 15% 88%` | `160 15% 24%` | `border` / `border-input` |
| `--ring` | Focus ring | `150 45% 40%` | `150 50% 50%` | `ring-ring` |

> `--ring` tracks `--primary`. Every interactive element gets
> `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### Tier & state colors (fixed palette, not tokenized)

Defined in `src/components/eval/VillagerCard.tsx` and
`src/components/viz/RecommendPanel.tsx`. These are intentional raw Tailwind
colors (identical in light and dark) so the tier scale stays recognizable.

| Meaning | Class | Swatch |
|---|---|---|
| Tier **S** (score 4) | `bg-amber-400 text-amber-950` | gold |
| Tier **A** (score 3) | `bg-emerald-500 text-white` | green |
| Tier **B** (score 2) | `bg-blue-500 text-white` | blue |
| Tier **C** (score 1) | `bg-gray-400 text-white` | gray |
| **Rated** card | `ring-2 ring-primary` | green ring |
| **Current resident** | `ring-2 ring-sky-500` | sky ring |
| **Excluded** card | `opacity-50 ring-2 ring-destructive/60 grayscale` | dimmed red ring |

---

## 3. Typography Rules

- **Font family:** System UI stack (no web font loaded). Body sets
  `font-feature-settings: 'rlig' 1, 'calt' 1;` (`src/index.css`).
- **Numbers:** Always `tabular-nums` for scores, counts, and tier values so
  columns align.
- **Weights:** `font-medium` (controls), `font-semibold` (titles), `font-bold`
  (headings). Headings add `tracking-tight`.

### Scale — in-app (tool)

| Use | Classes |
|---|---|
| App title (header) | `text-lg font-bold tracking-tight sm:text-xl` |
| Card / section title | `text-sm font-semibold` |
| Body / item text | `text-sm` |
| Label / filter / meta | `text-xs font-medium` |
| Compact tier badge | `text-[10px] leading-none` |

### Scale — landing page (`src/components/landing/LandingPage.tsx`)

The marketing/about view runs one step larger for impact:

| Use | Classes |
|---|---|
| Hero `h1` | `text-4xl font-bold tracking-tight sm:text-5xl` |
| Section `h2` | `text-2xl font-bold` |
| Tagline | `text-xl font-medium text-primary` |
| Body | `text-base` / `text-lg text-muted-foreground` |

---

## 4. Component Stylings

UI primitives live in `src/components/ui/` (shadcn-style, built on Radix +
`class-variance-authority`). Customize via `className`; do not fork.

### Button — `ui/button.tsx`
Base: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50`

| Variant | Classes |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |

| Size | Classes |
|---|---|
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 rounded-md px-3` |
| `lg` | `h-11 rounded-md px-8` |
| `icon` | `h-10 w-10` |

### Other primitives

| Component | Base style |
|---|---|
| **Card** (`card.tsx`) | `rounded-xl border bg-card text-card-foreground shadow-sm`; header/content padding `p-6` (content `pt-0`) |
| **Badge** (`badge.tsx`) | `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`; variants `default/secondary/destructive/outline` |
| **Input** (`input.tsx`) | `h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm` + focus ring |
| **Toggle** (`toggle.tsx`) | `rounded-md text-sm font-medium`; active `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground` |
| **Select** (`select.tsx`) | Trigger `h-10 rounded-md border border-input`; content `rounded-md border bg-popover shadow-md` |
| **Popover** (`popover.tsx`) | `w-72 rounded-md border bg-popover p-4 shadow-md` + fade/zoom-in |
| **Tooltip** (`tooltip.tsx`) | `rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground` |
| **Sheet** (`sheet.tsx`) | Mobile drawer; `fixed z-50 bg-background shadow-lg`, bottom slide-in |
| **Separator** (`separator.tsx`) | `h-[1px] w-full bg-border` (or `w-[1px] h-full`) |

### Domain widgets
- **Tier button** — small pill using the tier palette above; selected state via the `TIER_ACTIVE` map. Click an active tier again to clear.
- **Villager card** (`eval/VillagerCard.tsx`) — image with `🚫` exclude (top-left) and `🏠` resident (top-right) toggles; whole card reflects state through rings (§2).

---

## 5. Layout Principles

- **Spacing:** Tailwind 4px scale. Common gaps `gap-1 / 1.5 / 2 / 3 / 4 / 6`.
- **Container:** `center: true`, `padding: 2rem`, max width `2xl: 1400px`
  (`tailwind.config.js`). Wrap page content in `container`.
- **Radius scale** (`--radius: 0.75rem`): `rounded-lg` = 0.75rem (cards, popovers),
  `rounded-md` = 0.5rem (inputs, buttons), `rounded-sm` = 0.25rem (checkboxes),
  `rounded-full` (icon buttons, pills, state dots). Cards themselves use
  `rounded-xl`.
- **Card pattern:** `rounded-xl border bg-card text-card-foreground shadow-sm`
  with `p-4`–`p-6` inner padding.
- **Two-pane app shell (lg+):** `main` is
  `grid grid-cols-1 gap-6 lg:grid-cols-[1fr_24rem]` — content left, a 24rem
  recommendation panel right as a sticky `aside` (`lg:sticky lg:top-20`).
- **Villager grid:** `grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4`.
- **Header:** `sticky top-0 z-20 border-b bg-background/90 backdrop-blur`.

---

## 6. Depth & Elevation

Surfaces use a restrained, three-step shadow ramp; **state is shown with rings,
not shadow.**

| Level | Shadow | Used for |
|---|---|---|
| Base | `shadow-sm` | Cards, resting surfaces |
| Raised | `shadow-md` | Popover, Select content, Tooltip; card `hover:shadow-md` |
| Overlay | `shadow-lg` | Sheet drawer, mobile floating action button |

**Z-index layers:** `z-10` in-card buttons → `z-20` sticky header → `z-30`
mobile recommendation drawer/FAB → `z-50` Radix overlays (Sheet, Popover,
Select, Tooltip).

State emphasis (selected / resident / excluded) always uses `ring-2 ring-*`
(see §2), never elevation — so a card can be both elevated on hover and stateful.

---

## 7. Do's and Don'ts

**Do**
- ✅ Use semantic tokens (`bg-background`, `text-foreground`, `bg-primary`,
  `bg-card`, `text-muted-foreground`, `border`). They adapt to dark mode for free.
- ✅ Express selection/state with `ring-2 ring-{primary|sky-500|destructive/60}`.
- ✅ Reuse `src/components/ui/*` primitives and their variants.
- ✅ On mobile, move secondary panels into a bottom **Sheet** + floating trigger.
- ✅ Keep numbers `tabular-nums`; keep corners rounded.

**Don't**
- ❌ Hard-code hex/`hsl` for anything that has a token, or introduce a new brand
  color (the tier palette in §2 is the only allowed raw-color exception).
- ❌ Use shadow to signal selection — that's the ring's job.
- ❌ Apply the larger landing-page type scale inside the dense tool UI (or vice
  versa).
- ❌ Default to purple/blue "AI" gradients or pure-white sections — the theme is
  warm teal-green.
- ❌ Force the desktop two-pane sidebar onto small screens.

---

## 8. Responsive Behavior

Mobile-first. Breakpoints: `sm` 640px · `md` 768px · `lg` 1024px · `2xl` 1400px.

| Breakpoint | Behavior |
|---|---|
| Base (mobile) | 2-col villager grid; full-width filters/inputs (`w-full`); recommendation panel hidden, reached via a bottom **Sheet** opened by a floating button (`fixed bottom-4 left-1/2 z-30 -translate-x-1/2`, `max-h-[88vh]`). |
| `sm` (640) | Inputs settle to fixed widths (`sm:w-64`); grid → 3 columns. |
| `md` (768) | Villager grid → 4 columns. |
| `lg` (1024) | Two-pane shell: content + sticky 24rem `aside` panel; mobile Sheet/FAB hidden. |

- **Touch targets:** keep ≥ 44px (default Button heights `h-10`/`h-11` comply).
- **Sticky regions:** header `top-0`; desktop panel `lg:top-20` with internal
  `overflow-y-auto`.

---

## 9. Agent Prompt Guide

### Quick token reference (paste into a component or `:root`)

```css
/* light */
--background:150 30% 98%; --foreground:160 25% 15%;
--card:0 0% 100%; --primary:150 45% 40%; --primary-foreground:0 0% 100%;
--secondary:150 20% 92%; --muted:150 15% 94%; --muted-foreground:160 10% 40%;
--accent:40 90% 90%; --destructive:0 75% 55%;
--border:150 15% 88%; --ring:150 45% 40%; --radius:0.75rem;
/* dark */
--background:160 25% 10%; --foreground:150 20% 95%;
--card:160 22% 13%; --primary:150 50% 50%; --accent:40 50% 25%;
--border:160 15% 24%; --ring:150 50% 50%;
```

```
Tiers:  S bg-amber-400/text-amber-950 · A bg-emerald-500/white ·
        B bg-blue-500/white · C bg-gray-400/white
```

### Five rules to keep output on-brand
1. Semantic tokens only; never a raw hex that has a token.
2. Cards = `rounded-xl border bg-card shadow-sm`; controls = `rounded-md`.
3. State via `ring-2 ring-*`, not shadow.
4. Cozy teal-green base, warm amber accent; no purple gradients.
5. Mobile = Sheet drawer; desktop = sticky `lg:grid-cols-[1fr_24rem]` panel.

### Example prompts
- _"Add a settings panel as a Card (`rounded-xl border bg-card shadow-sm`, `p-6`)
  with a `default` primary Button and an `outline` secondary Button, matching the
  cozy teal theme. Support light and dark via semantic tokens."_
- _"Build a stats row of four cells: big `text-3xl font-bold tabular-nums
  text-primary` numbers over `text-sm text-muted-foreground` labels, inside the
  `container`, responsive `grid-cols-2 sm:grid-cols-4`."_
- _"Create a filter toolbar using Input (search), Select (category), and Toggle
  buttons, all `h-10` / `rounded-md`, full-width on mobile and `sm:w-auto` on
  desktop."_

---

<sub>Generated from source: `src/index.css`, `tailwind.config.js`,
`src/components/ui/*`, `src/components/eval/VillagerCard.tsx`,
`src/components/viz/RecommendPanel.tsx`. See `preview.html` /
`preview-dark.html` for a visual catalog. Stack: React 19 · Vite 8 ·
TypeScript 6 · Tailwind 3.4 · Radix UI · lucide-react · recharts.</sub>
