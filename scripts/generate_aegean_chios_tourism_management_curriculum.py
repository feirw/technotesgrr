"""Generate AEGEAN_CHIOS_TOURISM_MANAGEMENT_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "aegeanChiosTourismManagementCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Αιγαίου · Οικονομικής και Διοίκησης Τουρισμού (Χίος) */"
TITLE = "Οικονομικής και Διοίκησης Τουρισμού"
SUBTITLE = "Πανεπιστήμιο Αιγαίου · Χίος"
EXTERNAL_URL = "https://www.tourem.aegean.gr/el/studies/undergraduate-studies/curriculum"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AEGEAN_CHIOS_TOURISM_MANAGEMENT_CURRICULUM: SchoolCurriculum = {{",
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
