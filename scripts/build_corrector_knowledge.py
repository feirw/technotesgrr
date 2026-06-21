"""
Extract lesson material from frontend/ΜΑΘΗΜΑΤΑ into backend/data/corrector_knowledge.json
for the AI Corrector knowledge base (RAG context).

Run from repo root:
    python scripts/build_corrector_knowledge.py
"""
from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "frontend" / "ΜΑΘΗΜΑΤΑ"
OUT_FILE = ROOT / "backend" / "data" / "corrector_knowledge.json"

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
CHUNK_SIZE = 1400
CHUNK_OVERLAP = 180


def extract_docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as zf:
        xml_bytes = zf.read("word/document.xml")
    root = ET.fromstring(xml_bytes)
    parts: list[str] = []
    for node in root.iter(W_NS + "t"):
        if node.text:
            parts.append(node.text)
        if node.tail:
            parts.append(node.tail)
    text = "".join(parts)
    return re.sub(r"\s+", " ", text).strip()


def extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError("Install pypdf: pip install pypdf") from exc

    reader = PdfReader(str(path))
    parts: list[str] = []
    for page in reader.pages:
        piece = page.extract_text() or ""
        if piece.strip():
            parts.append(piece.strip())
    return re.sub(r"\s+", " ", " ".join(parts)).strip()


def extract_text(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".docx":
        return extract_docx_text(path)
    if suffix == ".pdf":
        return extract_pdf_text(path)
    return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        if end < len(text):
            split_at = text.rfind(" ", start + chunk_size // 2, end)
            if split_at > start:
                end = split_at
        piece = text[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= len(text):
            break
        start = max(end - overlap, start + 1)
    return chunks


def lesson_label(relative: Path) -> str:
    parts = [p for p in relative.parts if p != relative.name]
    return " / ".join(parts) if parts else relative.stem


def collect_sources() -> list[Path]:
    if not SOURCE_DIR.is_dir():
        raise FileNotFoundError(f"Source folder not found: {SOURCE_DIR}")

    files: list[Path] = []
    for path in sorted(SOURCE_DIR.rglob("*")):
        if not path.is_file():
            continue
        if path.name.startswith("~$"):
            continue
        if path.suffix.lower() not in {".docx", ".pdf"}:
            continue
        files.append(path)
    return files


def build_knowledge() -> dict:
    chunks: list[dict] = []
    skipped: list[str] = []
    chunk_id = 0

    for source in collect_sources():
        rel = source.relative_to(SOURCE_DIR)
        try:
            text = extract_text(source)
        except Exception as exc:
            skipped.append(f"{rel}: {exc}")
            continue

        if not text:
            skipped.append(f"{rel}: empty text")
            continue

        label = lesson_label(rel)
        for piece in chunk_text(text):
            chunk_id += 1
            chunks.append(
                {
                    "id": chunk_id,
                    "lesson": label,
                    "source": str(rel).replace("\\", "/"),
                    "text": piece,
                }
            )

    return {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceDir": "frontend/ΜΑΘΗΜΑΤΑ",
        "chunkCount": len(chunks),
        "fileCount": len(collect_sources()) - len(skipped),
        "skipped": skipped,
        "chunks": chunks,
    }


def main() -> None:
    payload = build_knowledge()
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {payload['chunkCount']} chunks from {payload['fileCount']} files -> {OUT_FILE}")
    if payload["skipped"]:
        print(f"Skipped {len(payload['skipped'])} files:")
        for line in payload["skipped"][:10]:
            print(f"  - {line}")


if __name__ == "__main__":
    main()
