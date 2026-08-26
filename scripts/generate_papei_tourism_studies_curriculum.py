"""Generate PAPEI_TOURISM_STUDIES_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "papeiTourismStudiesCurriculum.generated.ts"

HEADER = "/** ΠΑΠΕΙ · Τουριστικών Σπουδών (Πειραιάς) */"
TITLE = "Τουριστικών Σπουδών"
SUBTITLE = "Πανεπιστήμιο Πειραιώς · Πειραιάς"
EXTERNAL_URL = "http://tourism.unipi.gr/curriculum/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAPEI_TOURISM_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
