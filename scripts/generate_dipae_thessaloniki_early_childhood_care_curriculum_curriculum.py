"""Generate DIPAE_THESSALONIKI_EARLY_CHILDHOOD_CARE_CURRICULUM — link-only stub (course data not in scope; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "dipaeThessalonikiEarlyChildhoodCareCurriculum.generated.ts"

HEADER = "/** ΔΙΠΑΕ · Αγωγής και Φροντίδας στην Πρώιμη Ηλικία (Θεσσαλονίκη) */"
TITLE = "Αγωγής και Φροντίδας στην Πρώιμη Ηλικία"
SUBTITLE = "Διεθνές Πανεπιστήμιο της Ελλάδας · Θεσσαλονίκη"
EXTERNAL_URL = "https://ecec.ihu.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const DIPAE_THESSALONIKI_EARLY_CHILDHOOD_CARE_CURRICULUM: SchoolCurriculum = {{",
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
