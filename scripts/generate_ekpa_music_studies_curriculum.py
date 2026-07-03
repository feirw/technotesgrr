"""Generate EKPA_MUSIC_STUDIES_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "ekpaMusicStudiesCurriculum.generated.ts"

HEADER = "/** ΕΚΠΑ · Μουσικών Σπουδών (Αθήνα) */"
TITLE = "Μουσικών Σπουδών"
SUBTITLE = "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών · Αθήνα"
EXTERNAL_URL = "https://www.music.uoa.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const EKPA_MUSIC_STUDIES_CURRICULUM: SchoolCurriculum = {{",
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
