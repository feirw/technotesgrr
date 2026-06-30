"""Generate ΑΕΝ · Σχολή Πλοιάρχων curriculum (Ίδρυμα Ευγενίδου)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "aenCaptainsCurriculum.generated.ts"

Y = "Υποχρεωτικό"
WEEKS = 15  # 450 ώρες / 30 ώρες·εβδ.

# (semester, code, name, theory_hours_sem, app_hours_sem)
RAW: list[tuple] = [
    # Α' εξάμηνο
    (1, "AENP-A1", "Μαθηματικά Ι", 45, 0),
    (1, "AENP-A2", "Φυσική Ι", 45, 0),
    (
        1,
        "AENP-A3",
        "Στοιχεία Συνταγματικού και Ναυτικού Δικαίου",
        30,
        0,
    ),
    (1, "AENP-A4", "Ναυτικά Αγγλικά Ι", 45, 0),
    (
        1,
        "AENP-A5",
        "Ναυτική Τέχνη – Διεθνής Κανονισμός Αποφυγής Συγκρούσεων",
        75,
        30,
    ),
    (1, "AENP-A6", "Ναυτιλία Ι", 60, 30),
    (1, "AENP-A7", "Ελληνική Ναυτιλιακή Ιστορία", 30, 0),
    (
        1,
        "AENP-A8",
        "Διαχείριση πόρων γεφύρας (προσομ.)",
        0,
        30,
    ),
    (1, "AENP-A9", "Ηλεκτρονικοί Υπολογιστές", 0, 30),
    # Β' εξάμηνο
    (2, "AENP-B1", "Μαθηματικά ΙΙ", 45, 0),
    (2, "AENP-B2", "Φυσική ΙΙ", 30, 15),
    (2, "AENP-B3", "Ναυτικά Αγγλικά ΙΙ", 45, 0),
    (2, "AENP-B4", "Ναυτική Τέχνη ΙΙ", 45, 0),
    (2, "AENP-B5", "Ναυτιλία ΙΙ", 60, 45),
    (2, "AENP-B6", "Ναυτικές Επικοινωνίες Ι", 15, 30),
    (2, "AENP-B7", "Μετεωρολογία Ι", 45, 0),
    (2, "AENP-B8", "Ναυπηγία – Σχέδιο", 45, 30),
    # Γ' εξάμηνο
    (3, "AENP-Γ1", "Μαθηματικά III", 45, 0),
    (3, "AENP-Γ2", "Φυσική III", 30, 15),
    (3, "AENP-Γ3", "Ναυτικά Αγγλικά III", 45, 0),
    (3, "AENP-Γ4", "Ναυτιλία III", 45, 30),
    (3, "AENP-Γ5", "Μετεωρολογία II", 30, 0),
    (3, "AENP-Γ6", "Ναυτικά Ηλεκτρονικά Όργανα", 45, 30),
    (3, "AENP-Γ7", "RADAR", 30, 30),
    (
        3,
        "AENP-Γ8",
        "Διαχείριση πόρων γεφύρας (προσομ.)",
        0,
        30,
    ),
    (3, "AENP-Γ9", "ECDIS", 30, 15),
    # Δ' εξάμηνο
    (4, "AENP-Δ1", "Ναυτικά Αγγλικά IV", 30, 0),
    (4, "AENP-Δ2", "Ναυτικές Επικοινωνίες II", 60, 75),
    (
        4,
        "AENP-Δ3",
        "Ηλεκτρονικοί Υπολογιστές – Πληροφορική",
        15,
        45,
    ),
    (4, "AENP-Δ4", "Ναυτικές Μηχανές", 30, 0),
    (4, "AENP-Δ5", "ARPA – Τήρηση Φυλακής", 30, 30),
    (4, "AENP-Δ6", "Διαχείριση Ανθρωπίνου Δυναμικού", 30, 0),
    (4, "AENP-Δ7", "ISM – Ασφάλεια Φυλακής", 45, 0),
    (4, "AENP-Δ8", "Ηγεσία και Διοίκηση", 30, 0),
    (4, "AENP-Δ9", "Διαχείριση Κρίσεων", 30, 0),
    # Ε' εξάμηνο
    (5, "AENP-E1", "Ναυτικά Αγγλικά V", 30, 0),
    (
        5,
        "AENP-E2",
        "Επικοινωνία Πλοιάρχου – Διοικητική Λογιστική",
        45,
        0,
    ),
    (5, "AENP-E3", "Ναυτιλία IV", 45, 30),
    (
        5,
        "AENP-E4",
        "MARPOL – Διαχείριση έρματος / Διεθνείς συμβάσεις προστασίας θαλάσσης",
        45,
        0,
    ),
    (5, "AENP-E5", "Ευστάθεια I", 45, 30),
    (
        5,
        "AENP-E6",
        "Διαχείριση πόρων γεφύρας (προσομ.)",
        0,
        30,
    ),
    (5, "AENP-E7", "Μεταφορά Φορτίων I", 45, 30),
    (5, "AENP-E8", "Ανθρώπινες Σχέσεις", 30, 0),
    (5, "AENP-E9", "Επιθεωρήσεις πλοίου", 45, 0),
    # ΣΤ' εξάμηνο
    (6, "AENP-ΣΤ1", "Αγγλικά Ναυτικά VI", 30, 0),
    (6, "AENP-ΣΤ2", "Ναυτική Τέχνη III", 45, 0),
    (6, "AENP-ΣΤ3", "Ευστάθεια – Κοπώσεις", 60, 30),
    (6, "AENP-ΣΤ4", "Μεταφορά Φορτίων II", 45, 30),
    (6, "AENP-ΣΤ5", "Ναυτιλιακό Δίκαιο", 45, 0),
    (
        6,
        "AENP-ΣΤ6",
        "Διεθνής Ναυτιλιακή Πολιτική – Δίκαιο Θάλασσας",
        60,
        0,
    ),
    (6, "AENP-ΣΤ7", "Οικονομική Εκμετάλλευση Πλοίου", 45, 0),
    (6, "AENP-ΣΤ8", "ISPS – Ship Security Officer", 30, 0),
    (6, "AENP-ΣΤ9", "Διαχείριση πόρων γεφύρας", 0, 30),
]


def weekly(theory: int, app: int) -> tuple[int | None, int | None]:
    lec = theory // WEEKS if theory else None
    lab = app // WEEKS if app else None
    return lec, lab


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def fmt(sem: int, code: str, name: str, theory: int, app: int) -> str:
    lec, lab = weekly(theory, app)
    if lec is not None and lab is not None:
        hours_part = f", hours: {{ lecture: {lec}, lab: {lab} }}"
    elif lec is not None:
        hours_part = f", hours: {{ lecture: {lec} }}"
    elif lab is not None:
        hours_part = f", hours: {{ lab: {lab} }}"
    else:
        hours_part = ""
    return (
        f'      {{ code: "{esc(code)}", ects: 0, name: "{esc(name)}", '
        f'kind: "{Y}"{hours_part} }},'
    )


def main() -> None:
    by_sem: dict[int, list[tuple]] = {}
    for row in RAW:
        by_sem.setdefault(row[0], []).append(row)

    lines = [
        "/** ΑΕΝ · Σχολή Πλοιάρχων (Ίδρυμα Ευγενίδου) */",
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        "export const AEN_CAPTAINS_CURRICULUM: SchoolCurriculum = {",
        '  title: "Σχολή Πλοιάρχων",',
        '  subtitle: "Ακαδημία Εμπορικού Ναυτικού",',
        "  hoursNote:",
        '    "6 εξάμηνα · 30 ώρες/εβδομάδα · 450 ώρες/εξάμηνο. '
        "Θ=θεωρία · Ε=εργαστήριο/εφαρμογές (ώρες/εβδομάδα). "
        'Πηγή: Ίδρυμα Ευγενίδου.",',
        "  semesters: [",
    ]

    for sem in sorted(by_sem):
        lines.append(f"    {{ semester: {sem}, courses: [")
        for _s, code, name, theory, app in by_sem[sem]:
            lines.append(fmt(sem, code, name, theory, app))
        lines.append("    ] },")

    lines.extend(["  ],", "};", ""])

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(RAW)} courses)")


if __name__ == "__main__":
    main()
