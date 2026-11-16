"""Generate static Pokopia guide pages under public/pokopia-guides/.

Mirrors the ACNH guides (tools/content-pages/generate.py) for the Pokopia
side of villagertier.com: one page per Pokemon (307), per specialty, per
ideal habitat and per type, plus an index and a rare-specialties roundup.
Body copy is English; Pokemon names appear in English, Korean and Japanese.
Artwork is hotlinked from the PokeAPI sprites CDN, as in the app itself.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
DATA = REPO / "src" / "pokopia" / "data" / "pokemon.json"
OUT = REPO / "public" / "pokopia-guides"
SITE = "https://villagertier.com"
BASE = "/pokopia-guides"

COVERAGE = [
    "Build", "Chop", "Water", "Burn", "Grow", "Fly", "Crush", "Generate",
    "Gather", "Search", "Trade", "Litter", "Recycle", "Bulldoze",
    "Teleport", "Hype",
]
HABITATS = ["Bright", "Warm", "Humid", "Cool", "Dark", "Dry"]

CSS = """
:root{--ink:#2b1c10;--mut:#7a6552;--acc:#e85d10;--bg:#fdfbf7;--card:#fff;--line:#f0e2d0;--chip:#fdebd9}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}
header.site{border-bottom:1px solid var(--line);background:#fff8f0}
header.site .in{max-width:960px;margin:0 auto;padding:12px 16px;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
header.site a{color:var(--acc);text-decoration:none;font-weight:600}
header.site nav{display:flex;gap:14px;font-size:14px}
header.site nav a{color:var(--mut);font-weight:500}
main{max-width:960px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:28px;margin:8px 0 4px}
h2{font-size:20px;margin:28px 0 8px}
.sub{color:var(--mut);margin:0 0 12px}
a{color:var(--acc)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}
.member{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 6px;text-align:center;text-decoration:none;color:var(--ink);display:block}
.member img{width:72px;height:72px;object-fit:contain}
.member span{display:block;font-size:12px;line-height:1.3;margin-top:2px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{background:var(--chip);border-radius:999px;padding:3px 10px;font-size:13px;text-decoration:none;color:var(--ink)}
.chip b{color:var(--acc)}
.facts{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.facts div{margin:4px 0}
.facts dt{display:inline;font-weight:700}
.facts dd{display:inline;margin:0}
.hero{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.hero img{width:160px;height:160px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:12px}
.cta{display:inline-block;background:var(--acc);color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:14px}
.note{background:#fff4e5;border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:14px}
footer.site{border-top:1px solid var(--line);color:var(--mut);font-size:13px}
footer.site .in{max-width:960px;margin:0 auto;padding:16px}
.textlist{columns:2;column-gap:28px;font-size:14px}
@media(min-width:720px){.textlist{columns:3}}
"""


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def shell(title: str, desc: str, path: str, body: str) -> str:
    canon = f"{SITE}{path}"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{canon}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:type" content="article">
<link rel="stylesheet" href="{BASE}/style.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WEQ0FJKYDL"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-WEQ0FJKYDL');</script>
</head>
<body>
<header class="site"><div class="in">
<a href="{BASE}/">Pokopia Guides</a>
<nav><a href="/pokopia/">Dream Town Picker</a><a href="/guides/">ACNH Guides</a><a href="/">villagertier.com</a></nav>
</div></header>
<main>
{body}
</main>
<footer class="site"><div class="in">
<p>Data: specialties and ideal habitats as listed by Serebii; artwork from the PokeAPI sprites CDN. Unofficial fan-made guide. Pokemon Pokopia is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc.</p>
</div></footer>
</body>
</html>
"""


def member_card(p: dict) -> str:
    name = esc(p["nameEn"])
    return (
        f'<a class="member" href="{BASE}/pokemon/{p["id"]}/">'
        f'<img src="{esc(p["image"])}" alt="{name}" loading="lazy" decoding="async" width="72" height="72">'
        f"<span>{name}</span></a>"
    )


def write(rel: str, title: str, desc: str, body: str) -> None:
    path = OUT / rel / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(shell(title, desc, f"{BASE}/{rel}/" if rel else f"{BASE}/", body), encoding="utf-8")


def main() -> int:
    pokemon = json.loads(DATA.read_text(encoding="utf-8"))
    pokemon.sort(key=lambda p: p["dex"])
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "style.css").write_text(CSS.strip() + "\n", encoding="utf-8")

    by_specialty: dict[str, list[dict]] = {}
    by_type: dict[str, list[dict]] = {}
    by_habitat: dict[str, list[dict]] = {}
    for p in pokemon:
        for s in p["specialties"]:
            by_specialty.setdefault(s, []).append(p)
        for t in p["types"]:
            by_type.setdefault(t, []).append(p)
        by_habitat.setdefault(p["habitat"], []).append(p)

    # --- Pokemon pages -------------------------------------------------
    for p in pokemon:
        types = ", ".join(
            f'<a href="{BASE}/type/{slug(t)}/">{esc(t)}</a>' for t in p["types"]
        )
        specs = []
        for s in p["specialties"]:
            if s == "???":
                specs.append("Unknown (???)")
            else:
                mark = " (town coverage)" if s in COVERAGE else ""
                specs.append(f'<a href="{BASE}/specialty/{slug(s)}/">{esc(s)}</a>{mark}')
        same_habitat = [q for q in by_habitat[p["habitat"]] if q["id"] != p["id"]][:8]
        same_links = ", ".join(
            f'<a href="{BASE}/pokemon/{q["id"]}/">{esc(q["nameEn"])}</a>' for q in same_habitat
        )
        body = f"""<div class="hero">
<img src="{esc(p['image'])}" alt="{esc(p['nameEn'])}" width="160" height="160" decoding="async">
<div>
<h1>{esc(p['nameEn'])}</h1>
<p class="sub">Korean: {esc(p['names']['ko'])}, Japanese: {esc(p['names']['ja'])}</p>
<dl class="facts">
<div><dt>Pokopia dex:</dt> <dd>#{p['dex']}</dd></div>
<div><dt>National dex:</dt> <dd>#{p['natId']}</dd></div>
<div><dt>Type:</dt> <dd>{types}</dd></div>
<div><dt>Specialties:</dt> <dd>{", ".join(specs)}</dd></div>
<div><dt>Ideal habitat:</dt> <dd><a href="{BASE}/habitat/{slug(p['habitat'])}/">{esc(p['habitat'])}</a></dd></div>
</dl>
</div>
</div>
<h2>Who else likes {esc(p['habitat'])}?</h2>
<p>{same_links} and <a href="{BASE}/habitat/{slug(p['habitat'])}/">everyone in this habitat</a>.</p>
<a class="cta" href="/pokopia/">Plan a town with {esc(p['nameEn'])}</a>"""
        desc = (
            f"{p['nameEn']} in Pokemon Pokopia: specialties {', '.join(p['specialties'])}, "
            f"ideal habitat {p['habitat']}, type {', '.join(p['types'])}. "
            "See who shares its habitat and plan your dream town."
        )
        write(f"pokemon/{p['id']}", f"{p['nameEn']} (Pokopia) — specialties and habitat", desc, body)

    # --- Specialty pages ----------------------------------------------
    for s in sorted(by_specialty):
        if s == "???":
            continue
        holders = by_specialty[s]
        cards = "".join(member_card(p) for p in holders)
        notes = []
        if s in COVERAGE:
            notes.append("This specialty counts toward town coverage: a working town wants all 16 coverage specialties present.")
        if len(holders) <= 2:
            notes.append(f"Rare specialty: only {len(holders)} Pokemon in Pokopia has it." if len(holders) == 1 else "Rare specialty: only 2 Pokemon in Pokopia have it.")
        note_html = "".join(f'<p class="note">{n}</p>' for n in notes)
        body = f"""<h1>{esc(s)}</h1>
<p class="sub">{len(holders)} Pokemon with the {esc(s)} specialty in Pokemon Pokopia.</p>
{note_html}
<div class="grid">{cards}</div>"""
        write(f"specialty/{slug(s)}", f"{s} specialty Pokemon (Pokopia)", f"All {len(holders)} Pokemon with the {s} specialty in Pokemon Pokopia.", body)

    # --- Habitat pages --------------------------------------------------
    for h in HABITATS:
        holders = by_habitat.get(h, [])
        covered = [s for s in COVERAGE if any(s in p["specialties"] for p in holders)]
        missing = [s for s in COVERAGE if s not in covered]
        covered_chips = " ".join(f'<span class="chip">{esc(s)}</span>' for s in covered)
        missing_chips = " ".join(f'<span class="chip">{esc(s)}</span>' for s in missing)
        cards = "".join(member_card(p) for p in holders)
        body = f"""<h1>{esc(h)} habitat</h1>
<p class="sub">{len(holders)} Pokemon feel at home in a {esc(h)} habitat in Pokemon Pokopia. Build this environment and they will come.</p>
<h2>Specialty coverage of this habitat alone</h2>
<p>Covered ({len(covered)}/16):</p>
<div class="chips">{covered_chips}</div>
<p>Missing:</p>
<div class="chips">{missing_chips}</div>
<h2>Pokemon who live here</h2>
<div class="grid">{cards}</div>"""
        write(f"habitat/{slug(h)}", f"{h} habitat Pokemon (Pokopia)", f"All {len(holders)} Pokemon whose ideal habitat is {h} in Pokemon Pokopia, and the specialty coverage they bring.", body)

    # --- Type pages ------------------------------------------------------
    for t in sorted(by_type):
        holders = by_type[t]
        cards = "".join(member_card(p) for p in holders)
        body = f"""<h1>{esc(t)} type</h1>
<p class="sub">{len(holders)} {esc(t)}-type Pokemon appear in Pokemon Pokopia.</p>
<div class="grid">{cards}</div>"""
        write(f"type/{slug(t)}", f"{t}-type Pokemon (Pokopia)", f"All {len(holders)} {t}-type Pokemon in Pokemon Pokopia.", body)

    # --- Rare specialties roundup ---------------------------------------
    rare = [(s, by_specialty[s]) for s in sorted(by_specialty) if s != "???" and len(by_specialty[s]) <= 2]
    sections = []
    for s, holders in rare:
        cards = "".join(member_card(p) for p in holders)
        sections.append(f'<h2>{esc(s)} ({len(holders)})</h2><div class="grid">{cards}</div>')
    body = f"""<h1>Rare specialties</h1>
<p class="sub">Some specialties belong to almost nobody. These {len(rare)} specialties have two holders or fewer in all of Pokemon Pokopia, so if you want one, there is exactly one place to get it.</p>
{"".join(sections)}"""
    write("rare-specialties", "Rare specialties in Pokopia", "The rarest specialties in Pokemon Pokopia and the only Pokemon who have them.", body)

    # --- Index ------------------------------------------------------------
    spec_chips = " ".join(
        f'<a class="chip" href="{BASE}/specialty/{slug(s)}/">{esc(s)} <b>{len(by_specialty[s])}</b></a>'
        for s in sorted(by_specialty)
        if s != "???"
    )
    habitat_cards = "".join(
        f'<a class="member" href="{BASE}/habitat/{slug(h)}/"><span style="font-size:15px;font-weight:700">{esc(h)}</span><span>{len(by_habitat.get(h, []))} Pokemon</span></a>'
        for h in HABITATS
    )
    type_chips = " ".join(
        f'<a class="chip" href="{BASE}/type/{slug(t)}/">{esc(t)} <b>{len(by_type[t])}</b></a>'
        for t in sorted(by_type)
    )
    by_habitat_lists = []
    for h in HABITATS:
        links = ", ".join(
            f'<a href="{BASE}/pokemon/{p["id"]}/">{esc(p["nameEn"])}</a>' for p in by_habitat.get(h, [])
        )
        by_habitat_lists.append(f"<h2>{esc(h)}</h2><p class=\"textlist\">{links}</p>")
    body = f"""<h1>Pokopia Guides</h1>
<p class="sub">Every Pokemon in Pokemon Pokopia, organized by what decides your town: specialties, ideal habitats and types.</p>
<p>In Pokopia, a Pokemon's specialty is a working ability. Build builds houses, Chop fells trees, Water waters crops, and a town only runs when the right specialties live in it. Pokemon also move in where the habitat suits them, so the environment you build decides who arrives. These pages collect all 307 Pokemon by specialty, habitat and type, so you can plan before you build.</p>
<h2>Browse by specialty</h2>
<div class="chips">{spec_chips}</div>
<p><a href="{BASE}/rare-specialties/">Rare specialties</a>: the ones almost nobody has.</p>
<h2>Browse by habitat</h2>
<div class="grid">{habitat_cards}</div>
<h2>Browse by type</h2>
<div class="chips">{type_chips}</div>
<h2>All Pokemon by habitat</h2>
{"".join(by_habitat_lists)}
<a class="cta" href="/pokopia/">Open the Dream Town Picker</a>"""
    write("", "Pokopia Guides — specialties, habitats and types", "Guides for all 307 Pokemon in Pokemon Pokopia, by specialty, ideal habitat and type.", body)

    total = 1 + len(pokemon) + len([s for s in by_specialty if s != "???"]) + len(HABITATS) + len(by_type) + 1
    print(f"pokopia guide pages: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
