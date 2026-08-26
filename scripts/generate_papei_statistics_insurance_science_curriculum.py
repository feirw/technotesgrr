"""Generate PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "papeiStatisticsInsuranceScienceCurriculum.generated.ts"

HEADER = "/** AUTO-GENERATED — ΠΑΠΕΙ Στατιστικής και Ασφαλιστικής Επιστήμης (2024–25+) */"
TITLE = "Στατιστικής και Ασφαλιστικής Επιστήμης"
SUBTITLE = "Πανεπιστήμιο Πειραιώς · Πειραιάς"
EXTERNAL_URL = "https://www.unipi.gr/odigos-spoudwn-dpt-stat/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAPEI_STATISTICS_INSURANCE_SCIENCE_CURRICULUM: SchoolCurriculum = {{",
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
