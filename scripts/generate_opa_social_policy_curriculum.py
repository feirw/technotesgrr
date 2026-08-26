"""Generate OPA_SOCIAL_POLICY_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "opaSocialPolicyCurriculum.generated.ts"

HEADER = "/** Πάντειο · Κοινωνικής Πολιτικής (Αθήνα) */"
TITLE = "Κοινωνικής Πολιτικής"
SUBTITLE = "Πάντειο Πανεπιστήμιο · Αθήνα"
EXTERNAL_URL = "https://socialpolicy.panteion.gr/studies/undergraduate/courses"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const OPA_SOCIAL_POLICY_CURRICULUM: SchoolCurriculum = {{",
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
