"""Generate UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "uoiPrevezaAccountingFinanceCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Ιωαννίνων · Λογιστικής & Χρηματοοικονομικής (Πρέβεζα) */"
TITLE = "Λογιστικής & Χρηματοοικονομικής"
SUBTITLE = "Πανεπιστήμιο Ιωαννίνων · Πρέβεζα"
EXTERNAL_URL = "https://accfin.uoi.gr/spoydes/proptychiakes-spoydes/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UOI_PREVEZA_ACCOUNTING_FINANCE_CURRICULUM: SchoolCurriculum = {{",
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
