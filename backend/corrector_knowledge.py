"""
Knowledge base loader + lightweight retrieval for the AI Corrector.
Built from frontend/ΜΑΘΗΜΑΤΑ via scripts/build_corrector_knowledge.py
"""
from __future__ import annotations

import json
import logging
import os
import re
import unicodedata
from functools import lru_cache
from pathlib import Path
from typing import Any

logger = logging.getLogger("technotesgr")

DATA_FILE = Path(__file__).resolve().parent / "data" / "corrector_knowledge.json"
DEFAULT_MAX_CONTEXT_CHARS = max(
    2000,
    min(32000, int((os.getenv("CORRECTOR_CONTEXT_MAX_CHARS") or "14000").strip() or "14000")),
)
DEFAULT_TOP_CHUNKS = max(1, min(20, int((os.getenv("CORRECTOR_CONTEXT_TOP_K") or "8").strip() or "8")))

_PSEUDOCODE_TERMS = {
    "αρχη_προγραμματος",
    "τελος_προγραμματος",
    "αρχη_επαναληψης",
    "μεχρις_οτου",
    "τελος_επαναληψης",
    "τελος_αν",
    "τελος_για",
    "τελος_οσο",
    "επιλεξε",
    "αλλιως",
    "αλλιως_αν",
    "διαβασε",
    "γραψε",
    "μεταβλητη",
    "πίνακας",
    "πινακας",
    "στοιβα",
    "ουρα",
    "λίστα",
    "lista",
    "δένδρο",
    "δενδρο",
    "γράφος",
    "γραφος",
    "ταξινόμηση",
    "ταξινομηση",
    "αναζήτηση",
    "αναζητηση",
    "υποπρόγραμμα",
    "υποπρογραμμα",
    "συνάρτηση",
    "συναρτηση",
    "διαδικασία",
    "διαδικασια",
    "οσο",
    "για",
    "αν",
    "τοτε",
}


def _normalize_greek(text: str) -> str:
    lowered = (text or "").lower()
    lowered = lowered.replace("ς", "σ")
    lowered = unicodedata.normalize("NFD", lowered)
    lowered = "".join(ch for ch in lowered if unicodedata.category(ch) != "Mn")
    return lowered


def _tokenize(text: str) -> set[str]:
    normalized = _normalize_greek(text)
    tokens = set(re.findall(r"[a-zα-ω0-9_]+", normalized, flags=re.IGNORECASE))
    tokens.update(term for term in _PSEUDOCODE_TERMS if term in normalized)
    return {t for t in tokens if len(t) >= 2 or t in _PSEUDOCODE_TERMS}


def _score_chunk(query_tokens: set[str], chunk: dict[str, Any]) -> float:
    haystack = _normalize_greek(f"{chunk.get('lesson', '')} {chunk.get('source', '')} {chunk.get('text', '')}")
    hay_tokens = _tokenize(haystack)
    if not query_tokens or not hay_tokens:
        return 0.0

    overlap = query_tokens & hay_tokens
    score = float(len(overlap))

    # Boost exact pseudocode / lesson-topic matches.
    for token in query_tokens:
        if token in _PSEUDOCODE_TERMS and token in haystack:
            score += 2.5
        if token in haystack and len(token) >= 5:
            score += 0.5

    return score


@lru_cache(maxsize=1)
def _load_knowledge() -> dict[str, Any] | None:
    if not DATA_FILE.is_file():
        logger.warning("Corrector knowledge file missing: %s", DATA_FILE)
        return None
    try:
        raw = DATA_FILE.read_text(encoding="utf-8")
        data = json.loads(raw)
        chunks = data.get("chunks") or []
        if not chunks:
            logger.warning("Corrector knowledge file has no chunks")
            return None
        return data
    except Exception:
        logger.exception("Failed to load corrector knowledge from %s", DATA_FILE)
        return None


def get_knowledge_stats() -> dict[str, Any]:
    data = _load_knowledge()
    if not data:
        return {"loaded": False, "chunkCount": 0, "fileCount": 0}
    return {
        "loaded": True,
        "chunkCount": data.get("chunkCount", len(data.get("chunks") or [])),
        "fileCount": data.get("fileCount", 0),
        "generatedAt": data.get("generatedAt"),
        "sourceDir": data.get("sourceDir"),
    }


def retrieve_corrector_context(
    exercise: str,
    student_answer: str,
    *,
    max_chars: int = DEFAULT_MAX_CONTEXT_CHARS,
    top_k: int = DEFAULT_TOP_CHUNKS,
) -> str:
    data = _load_knowledge()
    if not data:
        return ""

    query = f"{exercise}\n{student_answer}"
    query_tokens = _tokenize(query)
    chunks: list[dict[str, Any]] = data.get("chunks") or []

    scored = [( _score_chunk(query_tokens, chunk), chunk) for chunk in chunks]
    scored.sort(key=lambda item: item[0], reverse=True)

    selected: list[str] = []
    used_chars = 0
    picked = 0

    for score, chunk in scored:
        if picked >= top_k or score <= 0:
            break
        block = (
            f"[{chunk.get('lesson', 'Μάθημα')} | {chunk.get('source', '')}]\n"
            f"{chunk.get('text', '').strip()}"
        )
        if used_chars + len(block) > max_chars:
            remaining = max_chars - used_chars
            if remaining < 400:
                break
            block = block[:remaining].rstrip() + "…"
        selected.append(block)
        used_chars += len(block)
        picked += 1

    # If query is too generic, include a small baseline from early lessons.
    if not selected and chunks:
        for chunk in chunks[:3]:
            block = (
                f"[{chunk.get('lesson', 'Μάθημα')} | {chunk.get('source', '')}]\n"
                f"{chunk.get('text', '').strip()}"
            )
            if used_chars + len(block) > max_chars:
                break
            selected.append(block)
            used_chars += len(block)

    return "\n\n---\n\n".join(selected)
