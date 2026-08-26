"""Generate DIPAE_KILKIS_CREATIVE_DESIGN_CLOTHING_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "dipaeKilkisCreativeDesignClothingCurriculum.generated.ts"

HEADER = "/** ΔΙΠΑΕ · Δημιουργικού Σχεδιασμού και Ένδυσης (Κιλκίς) */"
TITLE = "Δημιουργικού Σχεδιασμού και Ένδυσης"
SUBTITLE = "Διεθνές Πανεπιστήμιο της Ελλάδας · Κιλκίς"
EXTERNAL_URL = "https://cdc.ihu.gr/pps-dimioyrgikoy-schediasmoy-kai-endysis/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const DIPAE_KILKIS_CREATIVE_DESIGN_CLOTHING_CURRICULUM: SchoolCurriculum = {{",
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
