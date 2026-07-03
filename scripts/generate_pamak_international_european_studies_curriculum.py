"""Generate PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "pamakInternationalEuropeanStudiesCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Μακεδονίας · Διεθνών και Ευρωπαϊκών Σπουδών (Θεσσαλονίκη) */"
TITLE = "Διεθνών και Ευρωπαϊκών Σπουδών"
SUBTITLE = "Πανεπιστήμιο Μακεδονίας · Θεσσαλονίκη"
EXTERNAL_URL = "https://www.uom.gr/ies/programma-spoydon"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAMAK_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
