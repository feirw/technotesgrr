"""Generate ASTE_CRETE_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "asteCreteCurriculum.generated.ts"

HEADER = "/** ΑΣΤΕ · Αστε Κρήτης (ΑΣΤΕΚ) — ΦΕΚ Β' 5510/15.10.2025 */"
TITLE = "Διοίκηση Τουριστικών και Ξενοδοχειακών Επιχειρήσεων"
SUBTITLE = "Ανώτατη Σχολή Τουριστικής Εκπαίδευσης · Αγ. Νικόλαος"
EXTERNAL_URL = "https://astecrete.edu.gr/curriculum/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const ASTE_CRETE_CURRICULUM: SchoolCurriculum = {{",
        f'  title: "{esc(TITLE)}",',
        f'  subtitle: "{esc(SUBTITLE)}",',
        f'  externalCoursesUrl: "{esc(EXTERNAL_URL)}",',
        "  semesters: [],",
        "};",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} (link-only stub)")


if __name__ == "__main__":
    main()
