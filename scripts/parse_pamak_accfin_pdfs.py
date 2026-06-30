"""Parse ΠΑΜΑΚ accfin PDFs and print course lists."""
from __future__ import annotations

import re
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "frontend" / "public" / "λογιστικη"

COURSE_PAT = re.compile(
    r"^\s*\d+\.\s+(.+?)\s+-\s+\((\d+)\s+ECTS\)",
    re.MULTILINE | re.IGNORECASE,
)

PDF_META: dict[str, tuple[int, str | None]] = {
    "9871-accfin-perigramma-mathimatwn-a-examino.pdf": (1, None),
    "15781-accfin-perigramma-mathimatwn-2023-01-b-examino.pdf": (2, None),
    "6191-accfin-perigramma-mathimatwn-g-examino.pdf": (3, None),
    "15782-accfin-perigramma-mathimatwn-2023-01-d-examino.pdf": (4, None),
    "9874-accfin-perigramma-mathimatwn-e-examino-logistiki-elegktiki.pdf": (5, "LE"),
    "9875-accfin-perigramma-mathimatwn-e-examino-xrimatooikonomiki.pdf": (5, "XF"),
    "15783-accfin-perigramma-mathimatwn-2023-01-st-examino-logistiki-elegktiki.pdf": (6, "LE"),
    "9877-accfin-perigramma-mathimatwn-st-examino-xrimatooikonomiki.pdf": (6, "XF"),
    "9878-accfin-perigramma-mathimatwn-z-examino-logistiki-elegktiki.pdf": (7, "LE"),
    "9879-accfin-perigramma-mathimatwn-z-examino-xrimatooikonomiki.pdf": (7, "XF"),
    "15784-accfin-perigramma-mathimatwn-2023-01-h-examino-logistiki-elegktiki.pdf": (8, "LE"),
    "9881-accfin-perigramma-mathimatwn-h-examino-xrimatooikonomiki.pdf": (8, "XF"),
}


def parse_pdf(path: Path) -> list[tuple[str, int]]:
    text = "\n".join((page.extract_text() or "") for page in PdfReader(str(path)).pages)
    return [(name.strip(), int(ects)) for name, ects in COURSE_PAT.findall(text)]


def main() -> None:
    for fname, (sem, track) in sorted(PDF_META.items(), key=lambda x: (x[1][0], x[1][1] or "")):
        path = PDF_DIR / fname
        courses = parse_pdf(path)
        label = f"sem{sem}" + (f"_{track}" if track else "")
        print(f"\n=== {label} ({fname}) — {len(courses)} courses ===")
        for name, ects in courses:
            print(f"  {ects:>2} | {name}")


if __name__ == "__main__":
    main()
