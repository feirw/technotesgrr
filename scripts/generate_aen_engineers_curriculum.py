"""Generate ΑΕΝ · Σχολή Μηχανικών curriculum."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "src" / "data" / "aenEngineersCurriculum.generated.ts"

Y = "Υποχρεωτικό"

# (semester, code, ects, name, kind, lecture?)
COURSES: list[tuple] = [
    # Α' εξάμηνο
    (1, "AENM-A1", 0, "Θεωρία Ηλεκτρικών Κυκλωμάτων", Y, None),
    (1, "AENM-A2", 0, "Μαθηματικά", Y, None),
    (1, "AENM-A3", 0, "Μηχανουργείο", Y, None),
    (1, "AENM-A4", 0, "Μηχανολογικό Σχέδιο", Y, None),
    (1, "AENM-A5", 0, "Ναυτικά Αγγλικά", Y, None),
    (1, "AENM-A6", 0, "Ναυτικές Μηχανές", Y, None),
    (
        1,
        "AENM-A7",
        0,
        "Ναυτιλιακές Γνώσεις – Ναυπηγία",
        Y,
        None,
    ),
    (1, "AENM-A8", 0, "Πληροφορική", Y, None),
    (1, "AENM-A9", 0, "Φυσική", Y, None),
    (1, "AENM-A10", 0, "Χημεία", Y, None),
    # Β' εξάμηνο
    (2, "AENM-B1", 0, "Βοηθητικά Μηχανήματα", Y, None),
    (2, "AENM-B2", 0, "Εφαρμοσμένη Θερμοδυναμική Ι", Y, None),
    (2, "AENM-B3", 0, "Αντοχή Υλικών", Y, None),
    (2, "AENM-B4", 0, "Τεχνολογία Υλικών", Y, None),
    (2, "AENM-B5", 0, "Στοιχεία Ναυτικού Δικαίου", Y, None),
    (2, "AENM-B6", 0, "Ηλεκτρονικά", Y, None),
    (2, "AENM-B7", 0, "Μηχανουργείο", Y, None),
    (2, "AENM-B8", 0, "Ναυτικά Αγγλικά", Y, None),
    (2, "AENM-B9", 0, "Ναυτικές Μηχανές", Y, None),
    # Γ' εξάμηνο (μερική λίστα — υπόλοιπα μη διαθέσιμα online)
    (3, "AENM-Γ1", 0, "Μηχανική Ρευστών", Y, 3),
    (3, "AENM-Γ2", 0, "Μηχανουργείο", Y, 4),
    (3, "AENM-Γ3", 0, "Ναυτικά Αγγλικά", Y, 2),
    (3, "AENM-Γ4", 0, "Πληροφορική", Y, 3),
    # Ε' εξάμηνο
    (5, "AENM-E1", 0, "Θερμοδυναμική", Y, 4),
    (5, "AENM-E2", 0, "Μηχανές Εσωτερικής Καύσης", Y, 5),
    (5, "AENM-E3", 0, "Μηχανική Ρευστών", Y, 4),
    (5, "AENM-E4", 0, "Ναυτικά Αγγλικά", Y, 3),
    (5, "AENM-E5", 0, "Προσομοιωτής Μηχανοστασίου", Y, 4),
    (5, "AENM-E6", 0, "Συστήματα Αυτομάτου Ελέγχου", Y, 5),
    # ΣΤ' εξάμηνο
    (6, "AENM-ΣΤ1", 0, "Βοηθητικά Μηχανήματα", Y, 4),
    (6, "AENM-ΣΤ2", 0, "Καύσιμα – Λιπαντικά", Y, 4),
    (6, "AENM-ΣΤ3", 0, "Μηχανουργείο", Y, 5),
    (6, "AENM-ΣΤ4", 0, "Ναυτικά Αγγλικά", Y, 4),
    (6, "AENM-ΣΤ5", 0, "Ψυκτικές Εγκαταστάσεις", Y, 4),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def fmt(row: tuple) -> str:
    _sem, code, ects, name, kind, lecture = row
    hours_part = f", hours: {{ lecture: {lecture} }}" if lecture is not None else ""
    return (
        f'      {{ code: "{esc(code)}", ects: {ects}, name: "{esc(name)}", '
        f'kind: "{esc(kind)}"{hours_part} }},'
    )


def main() -> None:
    by_sem: dict[int, list[tuple]] = {}
    for row in COURSES:
        by_sem.setdefault(row[0], []).append(row)

    lines = [
        "/** ΑΕΝ · Σχολή Μηχανικών */",
        "import type { SchoolCurriculum } from './schoolCurricula';",
        "",
        "export const AEN_ENGINEERS_CURRICULUM: SchoolCurriculum = {",
        '  title: "Σχολή Μηχανικών",',
        '  subtitle: "Ακαδημία Εμπορικού Ναυτικού",',
        "  hoursNote:",
        '    "Πρόγραμμα Δ΄ και Γ΄ Πλοιάρχου Μηχανικού. '
        "3ο & 4ο εξ.: μη πλήρως διαθέσιμα online. "
        'Ώρες/εβδομάδα όπου αναφέρονται.",',
        "  semesters: [",
    ]

    for sem in sorted(by_sem):
        lines.append(f"    {{ semester: {sem}, courses: [")
        for row in by_sem[sem]:
            lines.append(fmt(row))
        lines.append("    ] },")

    lines.extend(["  ],", "};", ""])

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(COURSES)} courses)")


if __name__ == "__main__":
    main()
