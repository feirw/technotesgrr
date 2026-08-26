"""Generate AEGEAN_CHIOS_MEM_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "aegeanChiosMemCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Αιγαίου · Μηχανικών Οικονομίας και Διοίκησης (Χίος) */"
TITLE = "Μηχανικών Οικονομίας και Διοίκησης"
SUBTITLE = "Πανεπιστήμιο Αιγαίου · Χίος"
EXTERNAL_URL = "https://www.fme.aegean.gr/el/courses"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AEGEAN_CHIOS_MEM_CURRICULUM: SchoolCurriculum = {{",
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
