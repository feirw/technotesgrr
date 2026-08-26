"""Generate UOWM_GREVENA_STATISTICS_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "uowmGrevenaStatisticsCurriculum.generated.ts"

HEADER = "/** AUTO-GENERATED — ΠΔΜ Στατιστικής και Ασφαλιστικής Επιστήμης (Γρεβενά) */"
TITLE = "Στατιστικής και Ασφαλιστικής Επιστήμης"
SUBTITLE = "Πανεπιστήμιο Δυτικής Μακεδονίας · Γρεβενά"
EXTERNAL_URL = "https://stat.uowm.gr/synoptiko-programma-spoydon/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UOWM_GREVENA_STATISTICS_CURRICULUM: SchoolCurriculum = {{",
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
