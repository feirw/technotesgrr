"""Generate AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "authSerresPhysicalEducationCurriculum.generated.ts"

HEADER = "/** ΑΠΘ · Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Σέρρες / ΤΕΦΑΑ) */"
TITLE = "Επιστήμης Φυσικής Αγωγής και Αθλητισμού"
SUBTITLE = "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης · Σέρρες (ΤΕΦΑΑ)"
EXTERNAL_URL = "https://phed-sr.auth.gr/%CF%80%CF%81%CE%BF%CF%80%CF%84%CF%85%CF%87%CE%B9%CE%B1%CE%BA%CE%AD%CF%82-%CF%83%CF%80%CE%BF%CF%85%CE%B4%CE%AD%CF%82/%CF%80%CF%81%CF%8C%CE%B3%CF%81%CE%B1%CE%BC%CE%BC%CE%B1-%CF%83%CF%80%CE%BF%CF%85%CE%B4%CF%8E%CE%BD"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AUTH_SERRES_PHYSICAL_EDUCATION_CURRICULUM: SchoolCurriculum = {{",
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
