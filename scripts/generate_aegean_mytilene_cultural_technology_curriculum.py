"""Generate AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "aegeanMytileneCulturalTechnologyCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Αιγαίου · Πολιτισμικής Τεχνολογίας και Επικοινωνίας (Μυτιλήνη) */"
TITLE = "Πολιτισμικής Τεχνολογίας & Επικοινωνίας"
SUBTITLE = "Πανεπιστήμιο Αιγαίου · Μυτιλήνη"
EXTERNAL_URL = "https://www.ct.aegean.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AEGEAN_MYTILENE_CULTURAL_TECHNOLOGY_CURRICULUM: SchoolCurriculum = {{",
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
