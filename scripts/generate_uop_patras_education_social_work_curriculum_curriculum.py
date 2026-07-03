"""Generate UOP_PATRAS_EDUCATION_SOCIAL_WORK_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "uopPatrasEducationSocialWorkCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Πατρών · Επιστημών Εκπαίδευσης & Κοινωνικής Εργασίας (Πάτρα) */"
TITLE = "Επιστημών Εκπαίδευσης & Κοινωνικής Εργασίας"
SUBTITLE = "Πανεπιστήμιο Πατρών · Πάτρα"
EXTERNAL_URL = "https://www.edu-sw.upatras.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UOP_PATRAS_EDUCATION_SOCIAL_WORK_CURRICULUM: SchoolCurriculum = {{",
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
