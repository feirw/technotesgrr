"""Generate PADA_TOURISM_MANAGEMENT_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "padaTourismManagementCurriculum.generated.ts"

HEADER = "/** ΠΑΔΑ · Διοίκησης Τουρισμού (Αιγάλεω) */"
TITLE = "Διοίκησης Τουρισμού"
SUBTITLE = "Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω"
EXTERNAL_URL = "https://tourism.uniwa.gr/courses/programma-spoydon/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PADA_TOURISM_MANAGEMENT_CURRICULUM: SchoolCurriculum = {{",
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
