"""Generate HAF_NCO_ADMIN_LOGISTICS_CURRICULUM — link-only stub (institutional academy portal, not a per-department course page)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "hafNcoAdminLogisticsCurriculum.generated.ts"

HEADER = "/** Πολεμική Αεροπορία · ΣΜΥΑ · ΣΜΥΑ - Κατ. Διοικ. & Εφοδ. Υποστήριξης */"
TITLE = "ΣΜΥΑ - Κατ. Διοικ. & Εφοδ. Υποστήριξης"
SUBTITLE = "Πολεμική Αεροπορία · ΣΜΥΑ"
EXTERNAL_URL = "https://www.haf.gr/career/academies/smya/"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const HAF_NCO_ADMIN_LOGISTICS_CURRICULUM: SchoolCurriculum = {{",
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
