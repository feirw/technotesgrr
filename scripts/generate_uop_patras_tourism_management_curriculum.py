"""Generate UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "uopPatrasTourismManagementCurriculum.generated.ts"

HEADER = "/** Πανεπιστήμιο Πατρών · Διοίκησης Τουρισμού */"
TITLE = "Διοίκησης Τουρισμού"
SUBTITLE = "Πανεπιστήμιο Πατρών · Πάτρα"
EXTERNAL_URL = "https://tourism.upatras.gr/wp-content/uploads/2025/10/PPS_2025-2026.pdf"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const UOP_PATRAS_TOURISM_MANAGEMENT_CURRICULUM: SchoolCurriculum = {{",
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
