"""Generate PADA_EARLY_CHILDHOOD_CARE_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "padaEarlyChildhoodCareCurriculum.generated.ts"

HEADER = "/** ΠΑΔΑ · Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία (Αιγάλεω) */"
TITLE = "Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία"
SUBTITLE = "Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω"
EXTERNAL_URL = "https://ecec.uniwa.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const PADA_EARLY_CHILDHOOD_CARE_CURRICULUM: SchoolCurriculum = {{",
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
