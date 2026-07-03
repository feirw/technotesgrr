"""Generate PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "papeiInternationalEuropeanStudiesCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Πειραιώς · Διεθνών και Ευρωπαϊκών Σπουδών */"
TITLE = "Διεθνών και Ευρωπαϊκών Σπουδών"
SUBTITLE = "Πανεπιστήμιο Πειραιώς · Πειραιάς"
EXTERNAL_URL = "https://des-unipi.gr/%cf%80%cf%81%ce%bf%cf%80%cf%84%cf%85%cf%87%ce%b9%ce%b1%ce%ba%ce%bf/%cf%80%ce%b5%cf%81%ce%b9%ce%b3%cf%81%ce%b1%ce%bc%ce%bc%ce%b1%cf%84%ce%b1-%ce%bc%ce%b1%ce%b8%ce%b7%ce%bc%ce%b1%cf%84%cf%89%ce%bd/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAPEI_INTERNATIONAL_EUROPEAN_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
