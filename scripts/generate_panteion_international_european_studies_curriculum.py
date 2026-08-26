"""Generate PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "panteionInternationalEuropeanStudiesCurriculum.generated.ts"

HEADER = "/** Πάντειο · Διεθνών και Ευρωπαϊκών Σπουδών (Αθήνα) */"
TITLE = "Διεθνών και Ευρωπαϊκών Σπουδών"
SUBTITLE = "Πάντειο Πανεπιστήμιο Κοινωνικών & Πολιτικών Επιστημών · Αθήνα"
EXTERNAL_URL = "https://deps.panteion.gr/?page_id=77759"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PANTEION_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
