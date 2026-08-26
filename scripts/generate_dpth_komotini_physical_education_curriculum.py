"""Generate DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "dpthKomotiniPhysicalEducationCurriculum.generated.ts"

HEADER = "/** ΔΠΘ · Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Κομοτηνή / ΤΕΦΑΑ) */"
TITLE = "Επιστήμης Φυσικής Αγωγής και Αθλητισμού"
SUBTITLE = "Δημοκρίτειο Πανεπιστήμιο Θράκης · Κομοτηνή (ΤΕΦΑΑ)"
EXTERNAL_URL = "https://phyed.duth.gr/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const DPTH_KOMOTINI_PHYSICAL_EDUCATION_CURRICULUM: SchoolCurriculum = {{",
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
