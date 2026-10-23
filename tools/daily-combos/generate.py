#!/usr/bin/env python3
"""Generate Daily Dream Team cards (JP + EN) from combos.yml.

Usage:
    python3 generate.py              # all days, both languages
    python3 generate.py 3            # Day 3 only
    python3 generate.py 3 --lang en  # Day 3, English only

Content lives in combos.yml (themes + members + tiers). Villager portraits
and localized names come from the villagertier.com app repo
(src/data/villagers.json + public/villagers/*.png). Output: day{n}-ja.png
and day{n}-en.png next to this script. Design matches the original cards:
1200x1200, green background, 5x2 portrait tiles with tier chips.
"""
import argparse
import json
import sys
from pathlib import Path

import yaml
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
# When this script lives in the app repo (tools/daily-combos), the repo root
# is two levels up. Otherwise fall back to the standard clone location.
_repo_root = HERE.parent.parent
APP_REPO = (
    _repo_root
    if (_repo_root / "src" / "data" / "villagers.json").exists()
    else Path.home() / "workspace" / "acnh-villager-picker"
)
VILLAGERS_JSON = APP_REPO / "src" / "data" / "villagers.json"
PORTRAIT_DIR = APP_REPO / "public"
LOGO = HERE / "logo.png"
FONT_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"

W = H = 1200
BG = (21, 136, 64)
TILE = (237, 245, 240)
WHITE = (255, 255, 255)
TITLE_LIGHT = (185, 228, 197)
NAME_COLOR = (20, 83, 45)
CHIP = {
    "S": (251, 191, 36),
    "A": (16, 185, 129),
    "B": (59, 130, 246),
    "C": (156, 163, 175),
}

MARGIN = 56
TILE_W, TILE_H = 207, 318
GAP = 13
GRID_Y = 388

_fw_digits = str.maketrans("０１２３４５６７８９", "0123456789")


def font(size):
    return ImageFont.truetype(FONT_BOLD, size, index=0)


def ja_name(raw):
    # Cards use halfwidth digits (data has fullwidth, e.g. Kid Cat １ごう).
    return raw.translate(_fw_digits)


def load_villagers():
    data = json.loads(VILLAGERS_JSON.read_text(encoding="utf-8"))
    return {v["nameEn"]: v for v in data}


def fit_text(draw, text, size, max_w):
    f = font(size)
    while size > 16 and draw.textlength(text, font=f) > max_w:
        size -= 2
        f = font(size)
    return f


def paste_portrait(card, villager, box):
    path = PORTRAIT_DIR / villager["image"].lstrip("/")
    img = Image.open(path).convert("RGBA")
    img.thumbnail((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    x = box[0] + (box[2] - box[0] - img.width) // 2
    y = box[3] - img.height  # bottom-aligned, like the originals
    card.paste(img, (x, y), img)


def render(day, lang, series, villagers):
    card = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(card)

    logo = Image.open(LOGO).convert("RGBA").resize((106, 106), Image.LANCZOS)
    card.paste(logo, (57, 53), logo)
    d.text((192, 74), "villagertier.com", font=font(47), fill=WHITE)

    d.text((MARGIN, 196), series["title"][lang], font=font(66), fill=TITLE_LIGHT)
    title2 = f"Day {day['day']} — {day['theme'][lang]}"
    d.text((MARGIN, 286), title2, font=fit_text(d, title2, 74, W - 2 * MARGIN), fill=WHITE)

    for i, member in enumerate(day["members"]):
        v = villagers[member["name"]]
        col, row = i % 5, i // 5
        x = MARGIN + col * (TILE_W + GAP)
        y = GRID_Y + row * (TILE_H + GAP)
        d.rounded_rectangle([x, y, x + TILE_W, y + TILE_H], radius=18, fill=TILE)
        paste_portrait(card, v, (x + 10, y + 10, x + TILE_W - 10, y + 208))

        name = ja_name(v["names"]["ja"]) if lang == "ja" else v["names"]["en"]
        nf = fit_text(d, name, 31, TILE_W - 12)
        nw = d.textlength(name, font=nf)
        d.text((x + (TILE_W - nw) / 2, y + 216), name, font=nf, fill=NAME_COLOR)

        tier = member["tier"]
        cx, cy = x + TILE_W // 2, y + 272
        d.rounded_rectangle([cx - 29, cy, cx + 29, cy + 36], radius=18, fill=CHIP[tier])
        tf = font(24)
        tw = d.textlength(tier, font=tf)
        d.text((cx - tw / 2, cy + 4), tier, font=tf, fill=WHITE)

    d.text((MARGIN, 1092), series["footer"][lang], font=font(35), fill=WHITE)
    out = HERE / f"day{day['day']}-{lang}.png"
    card.save(out)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("day", nargs="?", type=int, help="day number (default: all)")
    ap.add_argument("--lang", choices=["ja", "en", "all"], default="all")
    args = ap.parse_args()

    cfg = yaml.safe_load((HERE / "combos.yml").read_text(encoding="utf-8"))
    villagers = load_villagers()
    langs = ["ja", "en"] if args.lang == "all" else [args.lang]

    made = []
    for day in cfg["days"]:
        if args.day and day["day"] != args.day:
            continue
        for member in day["members"]:
            if member["name"] not in villagers:
                sys.exit(f"unknown villager in combos.yml: {member['name']}")
        for lang in langs:
            made.append(render(day, lang, cfg["series"], villagers))
    for p in made:
        print("wrote", p.name)


if __name__ == "__main__":
    main()
