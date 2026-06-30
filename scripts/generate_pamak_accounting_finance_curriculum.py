"""Generate ΠΑΜΑΚ Λογιστικής & Χρηματοοικονομικής curriculum from accfin PDFs."""
from __future__ import annotations

import re
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "frontend" / "public" / "λογιστικη"
OUT = ROOT / "frontend" / "src" / "data" / "pamakAccountingFinanceCurriculum.generated.ts"

COURSE_PAT = re.compile(
    r"^\s*\d+\.\s+(.+?)\s+-\s+\((\d+)\s+ECTS\)",
    re.MULTILINE | re.IGNORECASE,
)

PDF_META: list[tuple[str, int, str | None, str]] = [
    ("9871-accfin-perigramma-mathimatwn-a-examino.pdf", 1, None, "Υποχρεωτικό"),
    ("15781-accfin-perigramma-mathimatwn-2023-01-b-examino.pdf", 2, None, "Υποχρεωτικό"),
    ("6191-accfin-perigramma-mathimatwn-g-examino.pdf", 3, None, "Υποχρεωτικό"),
    ("15782-accfin-perigramma-mathimatwn-2023-01-d-examino.pdf", 4, None, "Υποχρεωτικό"),
    (
        "9874-accfin-perigramma-mathimatwn-e-examino-logistiki-elegktiki.pdf",
        5,
        "LE",
        "Υποχρεωτικό · Λογιστικής & Ελεγκτικής",
    ),
    (
        "9875-accfin-perigramma-mathimatwn-e-examino-xrimatooikonomiki.pdf",
        5,
        "XF",
        "Υποχρεωτικό · Χρηματοοικονομικής",
    ),
    (
        "15783-accfin-perigramma-mathimatwn-2023-01-st-examino-logistiki-elegktiki.pdf",
        6,
        "LE",
        "Υποχρεωτικό · Λογιστικής & Ελεγκτικής",
    ),
    (
        "9877-accfin-perigramma-mathimatwn-st-examino-xrimatooikonomiki.pdf",
        6,
        "XF",
        "Υποχρεωτικό · Χρηματοοικονομικής",
    ),
    (
        "9878-accfin-perigramma-mathimatwn-z-examino-logistiki-elegktiki.pdf",
        7,
        "LE",
        "Υποχρεωτικό · Λογιστικής & Ελεγκτικής",
    ),
    (
        "9879-accfin-perigramma-mathimatwn-z-examino-xrimatooikonomiki.pdf",
        7,
        "XF",
        "Υποχρεωτικό · Χρηματοοικονομικής",
    ),
    (
        "15784-accfin-perigramma-mathimatwn-2023-01-h-examino-logistiki-elegktiki.pdf",
        8,
        "LE",
        "Υποχρεωτικό · Λογιστικής & Ελεγκτικής",
    ),
    (
        "9881-accfin-perigramma-mathimatwn-h-examino-xrimatooikonomiki.pdf",
        8,
        "XF",
        "Υποχρεωτικό · Χρηματοοικονομικής",
    ),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def slug_code(sem: int, idx: int, track: str | None) -> str:
    prefix = f"ΛΧ-{sem:02d}"
    if track:
        prefix += track
    return f"{prefix}-{idx:02d}"


def parse_pdf(path: Path) -> list[tuple[str, int]]:
    text = "\n".join((page.extract_text() or "") for page in PdfReader(str(path)).pages)
    return [(name.strip(), int(ects)) for name, ects in COURSE_PAT.findall(text)]


def main() -> None:
    by_sem: dict[int, list[tuple[str, str, int, str, str | None]]] = {}
    pdf_by_sem: dict[int, list[tuple[str, str | None, str]]] = {}

    for fname, sem, track, kind in PDF_META:
        courses = parse_pdf(PDF_DIR / fname)
        pdf_by_sem.setdefault(sem, []).append((fname, track, kind))
        for idx, (name, ects) in enumerate(courses, start=1):
            code = slug_code(sem, idx, track)
            by_sem.setdefault(sem, []).append((code, name, ects, kind, track))

    lines = [
        "/** ΠΑΜΑΚ · Λογιστικής & Χρηματοοικονομικής (Θεσσαλονίκη) — από επίσημα περιγράμματα μαθημάτων */",
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        "export const PAMAK_ACCOUNTING_FINANCE_CURRICULUM: SchoolCurriculum = {",
        '  title: "Λογιστικής & Χρηματοοικονομικής",',
        '  subtitle: "ΠΑΜΑΚ · Θεσσαλονίκη",',
        "  hoursNote:",
        '    "1ο–4ο εξ.: κοινό πρόγραμμα. 5ο–8ο εξ.: επιλογή κατεύθυνσης Λογιστικής & Ελεγκτικής ή Χρηματοοικονομικής. '
        'Τα περιγράμματα μαθημάτων (PDF) είναι διαθέσιμα ανά εξάμηνο.",',
        "  semesterPdfLinks: {",
    ]

    for sem in sorted(pdf_by_sem):
        lines.append(f"    {sem}: [")
        for fname, track, _kind in pdf_by_sem[sem]:
            track_label = (
                "Λογιστικής & Ελεγκτικής"
                if track == "LE"
                else "Χρηματοοικονομικής"
                if track == "XF"
                else "Κοινό"
            )
            lines.append(
                f'      {{ label: "{esc(track_label)}", url: "/λογιστικη/{esc(fname)}" }},'
            )
        lines.append("    ],")

    lines.extend(["  },", "  semesters: ["])

    total = 0
    for sem in sorted(by_sem):
        lines.append(f"    {{ semester: {sem}, courses: [")
        for code, name, ects, kind, _track in by_sem[sem]:
            total += 1
            lines.append(
                f'      {{ code: "{esc(code)}", ects: {ects}, name: "{esc(name)}", kind: "{esc(kind)}" }},'
            )
        lines.append("    ] },")

    lines.extend(["  ],", "};", ""])

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({total} courses)")


if __name__ == "__main__":
    main()
