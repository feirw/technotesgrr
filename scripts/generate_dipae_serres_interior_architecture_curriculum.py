"""Generate DIPAE_SERRES_INTERIOR_ARCHITECTURE_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "dipaeSerresInteriorArchitectureCurriculum.generated.ts"

HEADER = "/** ΔΙΠΑΕ · Εσωτερικής Αρχιτεκτονικής (Σέρρες) */"
TITLE = "Εσωτερικής Αρχιτεκτονικής"
SUBTITLE = "Διεθνές Πανεπιστήμιο της Ελλάδας · Σέρρες"
EXTERNAL_URL = "https://ia.ihu.gr/programea/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        "export const DIPAE_SERRES_INTERIOR_ARCHITECTURE_CURRICULUM: SchoolCurriculum = {",
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
