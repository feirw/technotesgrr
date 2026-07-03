"""Generate EKPA_PRIMARY_EDUCATION_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "ekpaPrimaryEducationCurriculum.generated.ts"

HEADER = "/** ΕΚΠΑ · Παιδαγωγικό Δημοτικής Εκπαίδευσης (Αθήνα) */"
TITLE = "Παιδαγωγικό Δημοτικής Εκπαίδευσης"
SUBTITLE = "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών · Αθήνα"
EXTERNAL_URL = "http://www.primedu.uoa.gr/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const EKPA_PRIMARY_EDUCATION_CURRICULUM: SchoolCurriculum = {{",
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
