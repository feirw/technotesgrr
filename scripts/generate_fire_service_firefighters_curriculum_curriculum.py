"""Generate FIRE_SERVICE_FIREFIGHTERS_CURRICULUM — link-only stub (institutional academy portal, not a per-department course page)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "fireServiceFirefightersCurriculum.generated.ts"

HEADER = "/** Πυροσβεστικό Σώμα · Πυροσβεστών (για Πολίτες) */"
TITLE = "Πυροσβεστών (για Πολίτες)"
SUBTITLE = "Πυροσβεστικό Σώμα"
EXTERNAL_URL = "https://academy.fireservice.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const FIRE_SERVICE_FIREFIGHTERS_CURRICULUM: SchoolCurriculum = {{",
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
