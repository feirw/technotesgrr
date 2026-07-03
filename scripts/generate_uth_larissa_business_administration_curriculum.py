"""Generate UTH_LARISSA_BUSINESS_ADMINISTRATION_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "uthLarissaBusinessAdministrationCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Θεσσαλίας · Διοίκησης Επιχειρήσεων (Λάρισα) — νέο ΠΣ από 2022-2023 */"
TITLE = "Διοίκησης Επιχειρήσεων"
SUBTITLE = "Πανεπιστήμιο Θεσσαλίας · Λάρισα"
EXTERNAL_URL = "https://de.uth.gr/undergraduate-program/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UTH_LARISSA_BUSINESS_ADMINISTRATION_CURRICULUM: SchoolCurriculum = {{",
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
