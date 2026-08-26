"""Generate DPTH_ALEXANDROUPOLI_PRESCHOOL_EDUCATION_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "dpthAlexandroupoliPreschoolEducationCurriculum.generated.ts"

HEADER = "/** ΔΠΘ · Επιστημών της Εκπαίδευσης στην Προσχολική Ηλικία (Αλεξανδρούπολη) */"
TITLE = "Επιστημών της Εκπαίδευσης στην Προσχολική Ηλικία"
SUBTITLE = "Δημοκρίτειο Πανεπιστήμιο Θράκης · Αλεξανδρούπολη"
EXTERNAL_URL = "https://psed.duth.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const DPTH_ALEXANDROUPOLI_PRESCHOOL_EDUCATION_CURRICULUM: SchoolCurriculum = {{",
        f'  title: "{esc(TITLE)}",',
        f'  subtitle: "{esc(SUBTITLE)}",',
        f'  externalCoursesUrl: "{esc(EXTERNAL_URL)}",',
        "  semesters: [],",
        "};",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
