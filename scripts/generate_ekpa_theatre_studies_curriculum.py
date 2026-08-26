"""Generate EKPA_THEATRE_STUDIES_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "ekpaTheatreStudiesCurriculum.generated.ts"

HEADER = "/** ΕΚΠΑ · Θεατρικών Σπουδών (Αθήνα) */"
TITLE = "Θεατρικών Σπουδών"
SUBTITLE = "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών · Αθήνα"
EXTERNAL_URL = "https://www.theatre.uoa.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const EKPA_THEATRE_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
