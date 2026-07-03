"""Generate AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "auaThebesAgribusinessManagementCurriculum.generated.ts"

HEADER = "/** Γεωπονικό · Διοίκησης Γεωργικών Επιχειρήσεων (Θήβα) */"
TITLE = "Διοίκησης Γεωργικών Επιχειρήσεων"
SUBTITLE = "Γεωπονικό Πανεπιστήμιο Αθηνών · Θήβα"
EXTERNAL_URL = "https://w1.aua.gr/agribusiness/mathimata/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AUA_THEBES_AGRIBUSINESS_MANAGEMENT_CURRICULUM: SchoolCurriculum = {{",
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
