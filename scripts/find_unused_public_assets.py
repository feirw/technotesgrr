"""List unused image/pdf assets under frontend/public."""
from __future__ import annotations

import urllib.parse
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "frontend" / "public"
SEARCH_ROOTS = [
    PUBLIC.parent / "src",
    PUBLIC.parent / "index.html",
    PUBLIC / "env.js",
]

EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".ico"}


def load_blob() -> str:
    parts: list[str] = []
    for root in SEARCH_ROOTS:
        if root.is_file():
            parts.append(root.read_text(encoding="utf-8", errors="ignore"))
            continue
        for f in root.rglob("*"):
            if f.suffix in {".tsx", ".ts", ".jsx", ".js", ".html", ".css", ".json"}:
                try:
                    parts.append(f.read_text(encoding="utf-8", errors="ignore"))
                except OSError:
                    pass
    return "\n".join(parts)


def is_referenced(blob: str, f: Path) -> bool:
    rel = f.relative_to(PUBLIC).as_posix()
    url_path = f"/{rel}"
    enc_path = f"/{urllib.parse.quote(rel, safe='/')}"
    name = f.name
    enc_name = urllib.parse.quote(name)
    patterns = {rel, url_path, enc_path, name, enc_name}
    if rel.startswith("images/"):
        patterns.add(f"/images/{rel.split('images/', 1)[1]}")
    if "home page" in rel:
        hp = rel.replace("home page", "home%20page")
        patterns.add(hp)
        patterns.add(f"/{hp}")
        patterns.add(f"/images/home%20page/{name}")
        patterns.add(f"/images/home%20page/{enc_name}")
    return any(p in blob for p in patterns if p)


def main() -> None:
    blob = load_blob()
    files = [
        f
        for f in PUBLIC.rglob("*")
        if f.is_file() and f.suffix.lower() in EXT and ".git" not in f.parts
    ]
    unused = [f for f in sorted(files) if not is_referenced(blob, f)]
    print(f"Total assets: {len(files)}")
    print(f"Unused: {len(unused)}")
    for f in unused:
        print(f.relative_to(PUBLIC).as_posix())


if __name__ == "__main__":
    main()
