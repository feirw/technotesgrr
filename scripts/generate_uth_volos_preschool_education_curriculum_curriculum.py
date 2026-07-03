"""Generate UTH_VOLOS_PRESCHOOL_EDUCATION_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "uthVolosPreschoolEducationCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Θεσσαλίας · Παιδαγωγικό Προσχολικής Εκπαίδευσης (Βόλος) */"
TITLE = "Παιδαγωγικό Προσχολικής Εκπαίδευσης"
SUBTITLE = "Πανεπιστήμιο Θεσσαλίας · Βόλος"
EXTERNAL_URL = "https://ece.uth.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UTH_VOLOS_PRESCHOOL_EDUCATION_CURRICULUM: SchoolCurriculum = {{",
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
