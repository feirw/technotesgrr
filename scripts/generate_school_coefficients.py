#!/usr/bin/env python3
"""Generate schoolCoefficients2026.ts from agent transcript user paste."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPT = (
    Path.home()
    / ".cursor/projects/c-Users-elenz-technotesgrr/agent-transcripts"
    / "dd5b724a-140d-41ba-bf5c-c884d197468e"
    / "dd5b724a-140d-41ba-bf5c-c884d197468e.jsonl"
)
OUT = ROOT / "frontend/src/data/schoolCoefficients2026.ts"


def extract_body() -> str:
    text = ""
    for line in TRANSCRIPT.read_text(encoding="utf-8").splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("role") != "user":
            continue
        for part in obj.get("message", {}).get("content", []):
            if part.get("type") != "text":
                continue
            t = part.get("text", "")
            if "Συντελεστές Βαρύτητας Μαθημάτων 2026" in t and "4ο Πεδίο" in t:
                text = t
                break
        if text:
            break

    if not text:
        raise SystemExit("Could not find coefficients paste in transcript")

    if text.startswith("<user_query>"):
        text = text[len("<user_query>") :]
    if text.endswith("</user_query>"):
        text = text[: -len("</user_query>")]

    start = text.find("Επιστήμες Οικονομίας και Πληροφορικής (4ο Πεδίο)")
    end = text.find("ΒΑΣΕΙΣ (ΣΕ ΜΟΡΙΑ)")
    if start == -1 or end == -1:
        raise SystemExit(f"Markers not found: start={start}, end={end}")

    return text[start:end].strip()


def parse_schools(body: str) -> list[dict]:
    schools: list[dict] = []
    current: dict | None = None
    note_prefix = "Ειδικό μάθημα:"

    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            if current and current["coefficients"]:
                schools.append(current)
                current = None
            continue

        if line.startswith("Επιστήμες Οικονομίας"):
            continue

        m = re.match(r"^(.+?)\t(\d+)$", line)
        if m:
            if current is None:
                continue
            current["coefficients"].append(
                {"subject": m.group(1).strip(), "weight": int(m.group(2))}
            )
            continue

        if line.startswith(note_prefix):
            if current and current["coefficients"]:
                current["coefficients"][-1]["note"] = line
            continue

        if current and current["coefficients"]:
            schools.append(current)
        current = {"name": line, "coefficients": []}

    if current and current["coefficients"]:
        schools.append(current)

    return schools


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_ts(schools: list[dict]) -> None:
    lines: list[str] = [
        "/** Συντελεστές βαρύτητας 2026 — 4ο πεδίο (ΓΕΛ). Πηγή: AeiTei.gr */",
        "",
        "export type SchoolCoefficient = { subject: string; weight: number; note?: string };",
        "export type SchoolCoefficientsEntry = {",
        "  id: string;",
        "  name: string;",
        "  coefficients: SchoolCoefficient[];",
        "};",
        "",
        'export const FIELD_4_TITLE = "Επιστήμες Οικονομίας και Πληροφορικής (4ο Πεδίο)";',
        'export const COEFFICIENTS_YEAR = 2026;',
        "",
        "export const SCHOOL_COEFFICIENTS_2026: SchoolCoefficientsEntry[] = [",
    ]

    for i, school in enumerate(schools, start=1):
        lines.append("  {")
        lines.append(f'    id: "school-{i}",')
        lines.append(f"    name: {ts_string(school['name'])},")
        lines.append("    coefficients: [")
        for coef in school["coefficients"]:
            if "note" in coef:
                lines.append(
                    f"      {{ subject: {ts_string(coef['subject'])}, weight: {coef['weight']}, note: {ts_string(coef['note'])} }},"
                )
            else:
                lines.append(
                    f"      {{ subject: {ts_string(coef['subject'])}, weight: {coef['weight']} }},"
                )
        lines.append("    ],")
        lines.append("  },")

    lines.append("];")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    body = extract_body()
    schools = parse_schools(body)
    if not schools:
        raise SystemExit("No schools parsed")
    write_ts(schools)
    print(f"Parsed {len(schools)} schools -> {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
