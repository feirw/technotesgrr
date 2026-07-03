"""Generate HAF_ICARUS_SUPPLY_CURRICULUM — link-only stub (institutional academy portal, not a per-department course page)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "hafIcarusSupplyCurriculum.generated.ts"

HEADER = "/** Πολεμική Αεροπορία · Σχολή Ικάρων · Ικάρων (ΣΙ) Εφοδιαστών */"
TITLE = "Ικάρων (ΣΙ) Εφοδιαστών"
SUBTITLE = "Πολεμική Αεροπορία · Σχολή Ικάρων"
EXTERNAL_URL = "https://www.haf.gr"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    lines = [
        HEADER,
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        f"export const HAF_ICARUS_SUPPLY_CURRICULUM: SchoolCurriculum = {{",
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
