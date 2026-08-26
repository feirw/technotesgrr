"""Generate COAST_GUARD_HARBOR_GUARDS_CURRICULUM — link-only stub (institutional academy portal, not a per-department course page)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "coastGuardHarborGuardsCurriculum.generated.ts"

HEADER = "/** Λιμενικό Σώμα · Σχολή Δοκίμων Λιμενοφυλάκων */"
TITLE = "Σχολή Δοκίμων Λιμενοφυλάκων"
SUBTITLE = "Λιμενικό Σώμα"
EXTERNAL_URL = "https://www.hcg.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const COAST_GUARD_HARBOR_GUARDS_CURRICULUM: SchoolCurriculum = {{",
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
