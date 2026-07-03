"""Generate PADA_INTERIOR_ARCHITECTURE_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "padaInteriorArchitectureCurriculum.generated.ts"

HEADER = "/** ΠΑΔΑ · Εσωτερικής Αρχιτεκτονικής (Αιγάλεω) */"
TITLE = "Εσωτερικής Αρχιτεκτονικής"
SUBTITLE = "Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω"
EXTERNAL_URL = "https://ia.uniwa.gr/courses/undergradute/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        "export const PADA_INTERIOR_ARCHITECTURE_CURRICULUM: SchoolCurriculum = {",
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
