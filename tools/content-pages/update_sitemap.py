"""Rebuild public/sitemap.xml from the pages that actually exist.

One source of truth for the sitemap: the three app entries plus every
static guide page under public/guides/ and public/pokopia-guides/.
Each section carries the date it last genuinely changed as <lastmod>,
so crawlers can prioritize what is new. Run after regenerating guides.
"""

from __future__ import annotations

from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
PUBLIC = REPO / "public"
SITE = "https://villagertier.com"

# (url path, lastmod, priority) for the app entries, in display order.
APPS = [
    ("/", "2026-11-12", "1.0"),
    ("/acnh/", "2026-11-12", "0.9"),
    ("/pokopia/", "2026-11-16", "0.9"),
]

# (directory, lastmod, index priority, detail prefix, detail priority)
SECTIONS = [
    ("guides", "2026-10-29", "0.8", "villager/", "0.6"),
    ("pokopia-guides", "2026-11-16", "0.8", "pokemon/", "0.6"),
]


def guide_entries() -> list[tuple[str, str, str]]:
    out: list[tuple[str, str, str]] = []
    for dirname, lastmod, index_prio, detail_prefix, detail_prio in SECTIONS:
        base = PUBLIC / dirname
        paths = []
        for page in base.rglob("index.html"):
            rel = page.parent.relative_to(base).as_posix()
            paths.append("" if rel == "." else rel + "/")
        for rel in sorted(paths):
            if rel == "":
                prio = index_prio
            elif rel.startswith(detail_prefix):
                prio = detail_prio
            else:
                prio = "0.7"
            out.append((f"/{dirname}/{rel}", lastmod, prio))
    return out


def main() -> int:
    entries = APPS + guide_entries()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<!-- Villager guide pages are static HTML, so crawlers can read them; the picker apps themselves are hash-routed SPAs. -->",
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for path, lastmod, prio in entries:
        lines += [
            "  <url>",
            f"    <loc>{SITE}{path}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            "    <changefreq>weekly</changefreq>",
            f"    <priority>{prio}</priority>",
            "  </url>",
        ]
    lines.append("</urlset>")
    (PUBLIC / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap urls: {len(entries)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
