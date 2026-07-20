#!/usr/bin/env python3
"""Build optimized website gallery assets from categorized source photographs."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "photos"
OUTPUT_ROOT = ROOT / "assets" / "gallery"
FULL_ROOT = OUTPUT_ROOT / "full"
THUMB_ROOT = OUTPUT_ROOT / "thumb"
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}

CATEGORIES = [
    ("01-under-sail", "Under sail"),
    ("02-exterior-and-deck", "Exterior & deck"),
    ("03-cockpit", "Cockpit"),
    ("04-interior", "Interior"),
    ("05-engine-and-systems", "Engine & systems"),
    ("06-underwater-and-haulout", "Underwater hull & haulout"),
    ("07-details-and-documents", "Details & documents"),
]


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value).strip("-").lower()
    return slug or "photo"


def caption_from_filename(path: Path, category: str) -> str:
    stem = re.sub(r"^\d+[\s._-]*", "", path.stem)
    if re.fullmatch(r"(?i)(img|dsc|pxl)[-_ ]?\d+", stem):
        return category
    caption = re.sub(r"[-_]+", " ", stem).strip()
    return caption[:1].upper() + caption[1:] if caption else category


def resized_copy(image: Image.Image, max_edge: int) -> Image.Image:
    copy = image.copy()
    copy.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return copy


def save_webp(image: Image.Image, destination: Path, quality: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "WEBP", quality=quality, method=6, optimize=True)


def build() -> None:
    if OUTPUT_ROOT.exists():
        shutil.rmtree(OUTPUT_ROOT)
    FULL_ROOT.mkdir(parents=True, exist_ok=True)
    THUMB_ROOT.mkdir(parents=True, exist_ok=True)

    records: list[dict[str, object]] = []
    global_index = 0

    for folder_name, category_label in CATEGORIES:
        folder = SOURCE_ROOT / folder_name
        if not folder.exists():
            continue

        files = sorted(
            (
                path
                for path in folder.iterdir()
                if path.is_file() and not path.name.startswith(".") and path.suffix.lower() in SUPPORTED
            ),
            key=lambda path: path.name.casefold(),
        )

        for category_index, source in enumerate(files, start=1):
            global_index += 1
            relative = source.relative_to(ROOT).as_posix()
            digest = hashlib.sha1(relative.encode("utf-8")).hexdigest()[:8]
            base_name = f"{folder_name}-{category_index:02d}-{slugify(source.stem)}-{digest}.webp"
            full_path = FULL_ROOT / base_name
            thumb_path = THUMB_ROOT / base_name

            try:
                with Image.open(source) as opened:
                    image = ImageOps.exif_transpose(opened)
                    if image.mode not in {"RGB", "RGBA"}:
                        image = image.convert("RGB")
                    elif image.mode == "RGBA":
                        background = Image.new("RGB", image.size, "white")
                        background.paste(image, mask=image.getchannel("A"))
                        image = background
                    else:
                        image = image.copy()
            except Exception as exc:
                raise RuntimeError(f"Unable to process {relative}: {exc}") from exc

            full = resized_copy(image, 2400)
            thumb = resized_copy(image, 1000)
            save_webp(full, full_path, 84)
            save_webp(thumb, thumb_path, 78)

            records.append(
                {
                    "src": full_path.relative_to(ROOT).as_posix(),
                    "thumb": thumb_path.relative_to(ROOT).as_posix(),
                    "category": category_label,
                    "caption": caption_from_filename(source, category_label),
                    "width": full.width,
                    "height": full.height,
                    "lead": global_index == 1,
                }
            )

    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "images": records,
    }
    (OUTPUT_ROOT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {len(records)} gallery images.")


if __name__ == "__main__":
    build()
