"""Generate AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM — link-only stub (course data removed; site has full program)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "curricula" / "authThessalonikiPrimaryEducationSocialCulturalCurriculum.generated.ts"

HEADER = "/** ΑΠΘ · Παιδαγωγικό Δημοτικής · Τομέας Κοινωνικών και Πολιτισμικών Σπουδών */"
TITLE = "Παιδαγωγικό Δημοτικής Εκπαίδευσης"
SUBTITLE = "ΑΠΘ · Θεσσαλονίκη · Τομέας Κοινωνικών και Πολιτισμικών Σπουδών"
EXTERNAL_URL = "https://www.eled.auth.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const AUTH_THESSALONIKI_PRIMARY_EDUCATION_SOCIAL_CULTURAL_CURRICULUM: SchoolCurriculum = {{",
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
