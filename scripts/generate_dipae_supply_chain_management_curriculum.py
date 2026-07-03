"""Generate DIPAE_SUPPLY_CHAIN_MANAGEMENT_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "dipaeSupplyChainManagementCurriculum.generated.ts"

HEADER = "/** ΔΙΠΑΕ · Διοίκησης Εφοδιαστικής Αλυσίδας (Κατερίνη) */"
TITLE = "Διοίκησης Εφοδιαστικής Αλυσίδας"
SUBTITLE = "ΔΙΠΑΕ · Κατερίνη"
EXTERNAL_URL = "https://logistics.ihu.gr/shared-files/17860/?%CE%9F%CE%B4%CE%B7%CE%B3%CE%BF%CC%81%CF%82%20%CE%A3%CF%80%CE%BF%CF%85%CE%B4%CF%89%CC%81%CE%BD%202025.pdf"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const DIPAE_SUPPLY_CHAIN_MANAGEMENT_CURRICULUM: SchoolCurriculum = {{",
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
