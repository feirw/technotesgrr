"""Generate AEGEAN_SAMOS_STATISTICS_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "aegeanSamosStatisticsCurriculum.generated.ts"

HEADER = "/** AUTO-GENERATED — Αιγαίου Στατιστικής & Αναλογιστικών-Χρηματοοικονομικών Μαθηματικών (Σάμος) */"
TITLE = "Στατιστικής και Αναλογιστικών-Χρηματοοικονομικών Μαθηματικών"
SUBTITLE = "Πανεπιστήμιο Αιγαίου · Σάμος"
EXTERNAL_URL = "https://www.actuar.aegean.gr/index.php/el/academics-el/undergraduate-programs-el"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AEGEAN_SAMOS_STATISTICS_CURRICULUM: SchoolCurriculum = {{",
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
