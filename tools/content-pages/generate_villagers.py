#!/usr/bin/env python3
"""Generate one static detail page per villager into public/guides/villager/.

Input data (all English-keyed by villager English name):
  - tools/content-pages/villagers_extra.json: merged Nookipedia nh_villager
    fields (birthday, sign, catchphrase, clothing, clothing_variation,
    umbrella, bag, book, food, drink, popsicle, fav_style1, fav_style2,
    fav_color1, fav_color2, hobby) plus ACNH Spreadsheet Villagers-tab
    fields (song, wallpaper, flooring, furniture list).
  - Names, portraits, species, personality, gender, and the 407 roster come
    from src/data/villagers.json (the picker canonical values).

Pages are minified single-line HTML sharing /guides/style.css to keep the
push payload small. Output: public/guides/villager/<slug>/index.html plus
public/guides/villagers/index.html (full roster index).

Usage: python3 tools/content-pages/generate_villagers.py
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
OUT = REPO / "public" / "guides" / "villager"
SITE = "https://villagertier.com"
UPDATED = "2026-10-29"

EXTRA_PATH = HERE / "villagers_extra.json"


def slug(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s


def esc(t) -> str:
    return html.escape("" if t is None else str(t))


def main() -> int:
    if not EXTRA_PATH.exists():
        print(f"missing input: {EXTRA_PATH} (convert the Nookipedia export first)")
        return 1
    extra = json.loads(EXTRA_PATH.read_text(encoding="utf-8"))
    roster = json.loads((REPO / "src" / "data" / "villagers.json").read_text(encoding="utf-8"))

    songs: dict[str, str] = {}

    slugs: dict[str, str] = {}
    for v in roster:
        s = slug(v["nameEn"])
        assert s not in slugs, f"duplicate slug: {s}"
        slugs[s] = v["nameEn"]

    missing = []
    index_items = []
    for v in sorted(roster, key=lambda x: x["nameEn"]):
        name = v["nameEn"]
        e = extra.get(name)
        if not e:
            missing.append(name)
            continue
        s = slug(name)
        names = v["names"]
        styles = " and ".join(x for x in [e.get("fav_style1"), e.get("fav_style2")] if x)
        colors = " and ".join(x for x in [e.get("fav_color1"), e.get("fav_color2")] if x)
        furniture = ", ".join(e.get("furniture") or [])
        rows = [
            ("Species", v["species"]),
            ("Personality", v["personality"]),
            ("Gender", v["gender"]),
            ("Birthday", e.get("birthday")),
            ("Star sign", e.get("sign")),
            ("Catchphrase", e.get("catchphrase")),
            ("Hobby", e.get("hobby")),
            ("Favorite styles", styles or None),
            ("Favorite colors", colors or None),
            ("Default clothing", (e.get("clothing") or "") + (f" ({e['clothing_variation']})" if e.get("clothing_variation") else "")),
            ("Default umbrella", e.get("umbrella")),
            ("Bag", e.get("bag")),
            ("Book", e.get("book")),
            ("Food", e.get("food")),
            ("Drink", e.get("drink")),
            ("Popsicle", e.get("popsicle")),
            ("Favorite song", e.get("song")),
            ("Wallpaper", e.get("wallpaper")),
            ("Flooring", e.get("flooring")),
            ("House furniture", furniture or None),
        ]
        facts = "".join(
            f"<tr><th>{k}</th><td>{esc(val)}</td></tr>" for k, val in rows if val
        )
        nook = "https://nookipedia.com/wiki/" + name.replace(" ", "_")
        body = (
            f"<h1>{esc(name)}</h1>"
            f"<p class=\"names\">{esc(names.get('ko', ''))} / {esc(names.get('ja', ''))}</p>"
            f"<img class=\"portrait\" src=\"{esc(v['image'])}\" alt=\"{esc(name)}\" width=\"160\" height=\"160\" decoding=\"async\">"
            f"<p class=\"lead\">{esc(name)} is a {esc(v['personality'])} "
            f"{esc(v['species'])} villager in Animal Crossing: New Horizons. "
            f"Villagers like gifts that match any of their favorite colors or styles.</p>"
            f"<table>{facts}</table>"
            f"<h2>Gift tip</h2><p>Give {esc(name)} clothing or furniture in "
            f"{esc(styles or 'their favorite styles')} and {esc(colors or 'their favorite colors')} "
            f"to score the best reaction. Nookipedia lists ideal clothing matches for this villager.</p>"
            f"<p><a href=\"{nook}\">Ideal clothing for {esc(name)} on Nookipedia &rarr;</a></p>"
            f"<p><a href=\"/acnh/\">Build a team with {esc(name)} in the picker &rarr;</a></p>"
        )
        title = f"{name} — favorite styles, colors, food, and gifts"
        desc = f"{name} ({names.get('ko', '')}) in Animal Crossing: New Horizons: favorite styles {styles}, favorite colors {colors}, hobby, default clothing, food, and gift tips."
        page = (
            "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
            f"<title>{esc(title)}</title><meta name=\"description\" content=\"{esc(desc)}\">"
            f"<link rel=\"canonical\" href=\"{SITE}/guides/villager/{s}/\">"
            "<link rel=\"stylesheet\" href=\"/guides/style.css\"></head><body>"
            "<header><a href=\"/\">villagertier.com</a><nav>"
            "<a href=\"/\">Home</a><a href=\"/acnh/\">Animal Crossing picker</a>"
            "<a href=\"/pokopia/\">Pokopia picker</a><a href=\"/guides/\">Villager guides</a>"
            "</nav></header><main>" + body +
            f"<p class=\"meta\">Last updated {UPDATED}. Data: Nookipedia (villager preferences) and "
            "<a href=\"https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4\">"
            "Data Spreadsheet for Animal Crossing New Horizons</a> (favorite song, house interior). "
            "Portraits: Nintendo.</p></main>"
            "<footer><a href=\"/\">villagertier.com</a> &middot; "
            "<a href=\"/acnh/\">Animal Crossing picker</a> &middot; "
            "<a href=\"/pokopia/\">Pokopia picker</a> &middot; "
            "<a href=\"/guides/\">Villager guides</a></footer></body></html>"
        )
        target = OUT / s / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding="utf-8")
        index_items.append((f"/guides/villager/{s}/", name))

    # Roster index.
    items = "".join(f"<li><a href=\"{u}\">{esc(n)}</a></li>" for u, n in index_items)
    idx = (
        "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        "<title>All villagers — Animal Crossing: New Horizons</title>"
        "<meta name=\"description\" content=\"All 407 Animal Crossing: New Horizons villagers with favorite styles, colors, food, and gift tips.\">"
        f"<link rel=\"canonical\" href=\"{SITE}/guides/villagers/\">"
        "<link rel=\"stylesheet\" href=\"/guides/style.css\"></head><body>"
        "<header><a href=\"/\">villagertier.com</a><nav>"
        "<a href=\"/\">Home</a><a href=\"/acnh/\">Animal Crossing picker</a>"
        "<a href=\"/pokopia/\">Pokopia picker</a><a href=\"/guides/\">Villager guides</a>"
        "</nav></header><main><h1>All villagers</h1>"
        "<p class=\"lead\">Every villager on this site, with a detail page covering favorite "
        "styles and colors, hobby, default clothing, food, drink, and gift tips.</p>"
        f"<ul class=\"cols\">{items}</ul>"
        f"<p class=\"meta\">Last updated {UPDATED}.</p></main>"
        "<footer><a href=\"/\">villagertier.com</a> &middot; "
        "<a href=\"/acnh/\">Animal Crossing picker</a> &middot; "
        "<a href=\"/pokopia/\">Pokopia picker</a> &middot; "
        "<a href=\"/guides/\">Villager guides</a></footer></body></html>"
    )
    roster_dir = REPO / "public" / "guides" / "villagers"
    roster_dir.mkdir(parents=True, exist_ok=True)
    (roster_dir / "index.html").write_text(idx, encoding="utf-8")

    print(f"pages: {len(index_items)}, missing extra data: {missing}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
