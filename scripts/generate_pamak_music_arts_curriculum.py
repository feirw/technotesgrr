"""Generate PAMAK_MUSIC_ARTS_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "pamakMusicArtsCurriculum.generated.ts"

HEADER = "/** ΠΑΜΑΚ · Μουσικής Επιστήμης και Τέχνης (Θεσσαλονίκη) */"
TITLE = "Μουσικής Επιστήμης και Τέχνης"
SUBTITLE = "Πανεπιστήμιο Μακεδονίας · Θεσσαλονίκη"
EXTERNAL_URL = "https://www.uom.gr/msa"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAMAK_MUSIC_ARTS_CURRICULUM: SchoolCurriculum = {{",
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
