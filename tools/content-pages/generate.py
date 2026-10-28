#!/usr/bin/env python3
"""Generate crawler-readable static guide pages into public/guides/.

The picker itself is a hash-routed SPA, so search engines only see a handful
of URLs. These static pages expose the same villager data as real,
indexable content: one page per personality, one per species, one Dream Team
archive, plus an index. Body text is English; villager names are shown in
English, Korean, and Japanese from villagers.json.

Usage: python3 tools/content-pages/generate.py
Outputs: public/guides/index.html, public/guides/personality/<slug>/index.html,
         public/guides/species/<slug>/index.html, public/guides/dream-teams/index.html
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
VILLAGERS = json.loads((REPO / "src" / "data" / "villagers.json").read_text(encoding="utf-8"))
COMBOS = yaml.safe_load((REPO / "tools" / "daily-combos" / "combos.yml").read_text(encoding="utf-8"))
OUT = REPO / "public" / "guides"
SITE = "https://villagertier.com"
UPDATED = "2026-10-28"

# "Uchi" is the internal name for the Sisterly personality; the data carries
# both labels, so merge them into one Sisterly guide.
PERSONALITY_MERGE = {"Uchi": "Sisterly"}

PERSONALITY_ORDER = [
    "Cranky", "Jock", "Lazy", "Normal", "Peppy", "Smug", "Snooty", "Sisterly",
]

PERSONALITY_DESC = {
    "Cranky": "Cranky villagers are gruff at first and warm up over time. They enjoy solitary hobbies, and they often talk about the old days.",
    "Jock": "Jock villagers love sports, fitness, and staying active. They are up early and always ready to train.",
    "Lazy": "Lazy villagers love food, naps, and a relaxed life. They are easygoing and fond of snacks, bugs, and daydreaming.",
    "Normal": "Normal villagers are kind, calm, and homemaking. They enjoy reading, cooking, and looking after the island.",
    "Peppy": "Peppy villagers are energetic and cheerful, with dreams of pop stardom. They love fashion, music, and gossip.",
    "Smug": "Smug villagers are polite, charming, and a little flirtatious. They enjoy refined hobbies and looking sharp.",
    "Snooty": "Snooty villagers care about fashion, beauty, and the finer things. They can sound aloof at first but warm up with friendship.",
    "Sisterly": "Sisterly villagers (also called Uchi) are caring big-sister types. They look out for the player and speak their mind.",
}

TIER_COLORS = {"S": "#f59e0b", "A": "#10b981", "B": "#3b82f6", "C": "#9ca3af"}

STYLE = """
body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;margin:0;color:#1f2937;background:#fff}
header{background:#158840;color:#fff;padding:16px 20px}
header a{color:#fff;text-decoration:none;font-weight:700}
header nav{margin-top:8px;font-size:14px}
header nav a{font-weight:400;margin-right:16px;opacity:.95}
main{max-width:960px;margin:0 auto;padding:28px 20px 48px}
h1{font-size:30px;line-height:1.25;margin:0 0 8px}
h2{font-size:22px;margin-top:36px}
.lead{font-size:17px;line-height:1.7;color:#374151}
.meta{font-size:13px;color:#6b7280}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-top:20px}
.card{border:1px solid #e5e7eb;border-radius:12px;padding:12px;text-align:center;background:#f9fafb}
.card img{width:96px;height:96px;object-fit:contain}
.card .en{font-weight:700;margin-top:6px}
.card .loc{font-size:13px;color:#4b5563}
.card .tag{font-size:12px;color:#6b7280;margin-top:4px}
.chip{display:inline-block;padding:2px 10px;border-radius:999px;color:#fff;font-weight:700;font-size:13px}
.day{border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-top:18px;background:#f9fafb}
.day ol{line-height:1.9}
footer{border-top:1px solid #e5e7eb;padding:20px;text-align:center;font-size:13px;color:#6b7280}
footer a{color:#158840}
a{color:#158840}
ul.cols{columns:2;line-height:2}
"""


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def shell(title: str, desc: str, path: str, body: str) -> str:
    canon = f"{SITE}{path}"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canon}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:type" content="article">
<style>{STYLE}</style>
</head>
<body>
<header>
<a href="/">villagertier.com</a>
<nav><a href="/">Home</a><a href="/acnh/">Animal Crossing picker</a><a href="/pokopia/">Pokopia picker</a><a href="/guides/">Villager guides</a></nav>
</header>
<main>
{body}
<p class="meta">Last updated {UPDATED}. Villager data: Animal Crossing: New Horizons, 407 villagers on this site.</p>
</main>
<footer>
<a href="/">villagertier.com</a> &middot; <a href="/acnh/">Animal Crossing picker</a> &middot; <a href="/pokopia/">Pokopia picker</a> &middot; <a href="/guides/">Villager guides</a>
</footer>
</body>
</html>
"""


def member_card(v: dict) -> str:
    names = v["names"]
    return (
        f'<div class="card"><img src="{html.escape(v["image"])}" alt="{html.escape(v["nameEn"])}" loading="lazy">'
        f'<div class="en">{html.escape(v["nameEn"])}</div>'
        f'<div class="loc">{html.escape(names.get("ko", ""))} / {html.escape(names.get("ja", ""))}</div>'
        f'<div class="tag">{html.escape(v["species"])} &middot; {html.escape(v["personality"])}</div></div>'
    )


def write(path: str, title: str, desc: str, body: str) -> Path:
    target = OUT / path.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(shell(title, desc, "/" + path.lstrip("/").removesuffix("index.html").rstrip("/") + "/", body), encoding="utf-8")
    return target


def main() -> int:
    by_personality: dict[str, list[dict]] = {}
    for v in VILLAGERS:
        key = PERSONALITY_MERGE.get(v["personality"], v["personality"])
        by_personality.setdefault(key, []).append(v)
    by_species: dict[str, list[dict]] = {}
    for v in VILLAGERS:
        by_species.setdefault(v["species"], []).append(v)
    for members in list(by_personality.values()) + list(by_species.values()):
        members.sort(key=lambda v: v["nameEn"])

    pages: list[tuple[str, str]] = []  # (url path, title) for the sitemap

    # Personality guides.
    pers_links = []
    for pers in PERSONALITY_ORDER:
        members = by_personality.get(pers, [])
        if not members:
            continue
        pslug = slug(pers)
        url = f"/guides/personality/{pslug}/"
        pers_links.append((url, pers, len(members)))
        cards = "".join(member_card(v) for v in members)
        body = (
            f"<h1>{pers} villagers in Animal Crossing: New Horizons</h1>"
            f'<p class="lead">{PERSONALITY_DESC[pers]}</p>'
            f"<p>There are {len(members)} {pers} villagers out of 407 on this site. "
            f"Use the picker to build a balanced island team around them.</p>"
            f'<div class="grid">{cards}</div>'
            f'<p><a href="/acnh/">Build your team with the Animal Crossing picker &rarr;</a></p>'
        )
        write(f"personality/{pslug}/index.html", f"{pers} villagers — Animal Crossing: New Horizons",
              f"All {len(members)} {pers} villagers in Animal Crossing: New Horizons, with names and portraits.",
              body)
        pages.append((url, f"{pers} villagers"))

    # Species guides.
    spec_links = []
    for species in sorted(by_species):
        members = by_species[species]
        sslug = slug(species)
        url = f"/guides/species/{sslug}/"
        spec_links.append((url, species, len(members)))
        cards = "".join(member_card(v) for v in members)
        body = (
            f"<h1>{species} villagers in Animal Crossing: New Horizons</h1>"
            f"<p>There are {len(members)} {species} villagers out of 407 on this site.</p>"
            f'<div class="grid">{cards}</div>'
            f'<p><a href="/acnh/">Build your team with the Animal Crossing picker &rarr;</a></p>'
        )
        write(f"species/{sslug}/index.html", f"{species} villagers — Animal Crossing: New Horizons",
              f"All {len(members)} {species} villagers in Animal Crossing: New Horizons, with names and portraits.",
              body)
        pages.append((url, f"{species} villagers"))

    # Dream Team archive from the card series content.
    by_name = {v["nameEn"]: v for v in VILLAGERS}
    day_blocks = []
    for day in COMBOS["days"]:
        items = []
        for m in day["members"]:
            v = by_name.get(m["name"])
            label = v["nameEn"] if v else m["name"]
            loc = ""
            if v:
                loc = f' <span class="loc">({html.escape(v["names"].get("ko", ""))} / {html.escape(v["names"].get("ja", ""))})</span>'
            color = TIER_COLORS.get(m["tier"], "#9ca3af")
            items.append(f'<li>{html.escape(label)}{loc} <span class="chip" style="background:{color}">{m["tier"]}</span></li>')
        day_blocks.append(
            f'<section class="day"><h2>Day {day["day"]} — {html.escape(day["theme"]["en"])} ({html.escape(day["theme"]["ja"])})</h2>'
            f"<ol>{''.join(items)}</ol></section>"
        )
    body = (
        "<h1>Dream Team archive — Animal Crossing villager combinations</h1>"
        '<p class="lead">The daily Dream Team series from @villagertier: ten-villager island teams '
        "built with the site's picker, which scores teams by tier ratings (S=4, A=3, B=2, C=1), "
        "balances all 8 personalities, and penalizes duplicate species. "
        "Tiers below are the illustrative ratings shown on each series card.</p>"
        f"{''.join(day_blocks)}"
        '<p><a href="/acnh/">Build your own dream team with the picker &rarr;</a></p>'
    )
    write("dream-teams/index.html", "Dream Team archive — Animal Crossing villager combinations",
          "The daily Dream Team series: ten-villager island teams by theme, with members and tier ratings.",
          body)
    pages.append(("/guides/dream-teams/", "Dream Team archive"))

    # Index.
    pers_items = "".join(f'<li><a href="{u}">{p} villagers</a> ({n})</li>' for u, p, n in pers_links)
    spec_items = "".join(f'<li><a href="{u}">{s} villagers</a> ({n})</li>' for u, s, n in spec_links)
    body = (
        "<h1>Animal Crossing villager guides</h1>"
        '<p class="lead">Browse all 407 Animal Crossing: New Horizons villagers by personality and species, '
        "and explore the daily Dream Team combinations. Every page is generated from the same data "
        "that powers the picker, so the lists stay in sync with the tool.</p>"
        "<h2>By personality</h2>"
        f'<ul class="cols">{pers_items}</ul>'
        "<h2>By species</h2>"
        f'<ul class="cols">{spec_items}</ul>'
        '<h2><a href="/guides/dream-teams/">Dream Team archive</a></h2>'
        "<p>Seven themed ten-villager teams from the daily series, with members and tier ratings.</p>"
        '<p><a href="/acnh/">Open the Animal Crossing picker &rarr;</a></p>'
    )
    write("index.html", "Animal Crossing villager guides — villagertier.com",
          "Browse all 407 Animal Crossing: New Horizons villagers by personality and species, plus the Dream Team archive.",
          body)
    pages.append(("/guides/", "Villager guides"))

    print(f"personalities: {len(pers_links)}, species: {len(spec_links)}, pages: {len(pages)}")
    print(json.dumps([p[0] for p in pages], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
