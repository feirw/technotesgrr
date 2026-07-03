"""Generate PAMAK_ISC_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "pamakIscCurriculum.generated.ts"

HEADER = "/** AUTO-GENERATED — ΠΑΜΑΚ Εφ. Πληροφορικής · Πληροφοριακά Συστήματα */"
TITLE = "Εφαρμοσμένης Πληροφορικής"
SUBTITLE = "ΠΑΜΑΚ · Πληροφοριακά Συστήματα · Θεσσαλονίκη"
EXTERNAL_URL = "https://www.uom.gr/dai"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PAMAK_ISC_CURRICULUM: SchoolCurriculum = {{",
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
