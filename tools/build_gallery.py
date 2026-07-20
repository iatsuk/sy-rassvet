#!/usr/bin/env python3
"""Build responsive, privacy-safe gallery assets from the source photo folders."""

from __future__ import annotations

import json
import re
import shutil
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageCms, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener(thumbnails=False)

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "photos" / "source"
OUTPUT_ROOT = ROOT / "photos" / "generated"
MANIFEST_PATH = ROOT / "gallery-data.js"

SUPPORTED_EXTENSIONS = {".heic", ".heif", ".hif", ".jpg", ".jpeg", ".png", ".webp"}
GENERIC_FILENAME = re.compile(r"^(?:img|dsc|photo|image)[-_ ]?\d+$", re.IGNORECASE)
LEADING_NUMBER = re.compile(r"^\d+[\s._-]*")
NATURAL_PARTS = re.compile(r"(\d+)")

CATEGORIES = [
    ("01-under-sail", "Under sail"),
    ("02-exterior", "Exterior"),
    ("03-deck-cockpit", "Deck and cockpit"),
    ("04-interior", "Interior"),
    ("05-engine-systems", "Engine and systems"),
    ("06-rig-sails", "Rig and sails"),
    ("07-underwater-hull", "Underwater hull"),
]


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.casefold() for part in NATURAL_PARTS.split(path.name)]


def slugify(value: str) -> str:
    value = LEADING_NUMBER.sub("", value)
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "photo"


def caption_for(path: Path, category: str, position: int) -> str:
    cleaned = LEADING_NUMBER.sub("", path.stem)
    if GENERIC_FILENAME.fullmatch(cleaned):
        return f"{category} {position}"

    cleaned = re.sub(r"[_-]+", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned[:1].upper() + cleaned[1:] if cleaned else f"{category} {position}"


def convert_to_srgb(image: Image.Image, icc_profile: bytes | None) -> Image.Image:
    if image.mode not in {"RGB", "RGBA"}:
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

    if image.mode == "RGBA":
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        image = background

    if not icc_profile:
        return image.convert("RGB")

    try:
        source_profile = ImageCms.ImageCmsProfile(BytesIO(icc_profile))
        target_profile = ImageCms.createProfile("sRGB")
        return ImageCms.profileToProfile(image, source_profile, target_profile, outputMode="RGB")
    except (OSError, ValueError):
        return image.convert("RGB")


def resized_copy(image: Image.Image, max_edge: int) -> Image.Image:
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return resized


def save_pair(image: Image.Image, stem: str, suffix: str, max_edge: int, webp_quality: int, jpeg_quality: int) -> dict[str, str]:
    resized = resized_copy(image, max_edge)
    webp_path = OUTPUT_ROOT / f"{stem}-{suffix}.webp"
    jpeg_path = OUTPUT_ROOT / f"{stem}-{suffix}.jpg"

    resized.save(webp_path, "WEBP", quality=webp_quality, method=6)
    resized.save(jpeg_path, "JPEG", quality=jpeg_quality, optimize=True, progressive=True, subsampling="4:2:0")

    return {
        "webp": webp_path.relative_to(ROOT).as_posix(),
        "jpeg": jpeg_path.relative_to(ROOT).as_posix(),
    }


def clear_generated_files() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    for path in OUTPUT_ROOT.iterdir():
        if path.name == ".gitkeep":
            continue
        if path.is_dir():
            shutil.rmtree(path)
        else:
            path.unlink()


def build_gallery() -> list[dict[str, object]]:
    clear_generated_files()
    items: list[dict[str, object]] = []

    for category_index, (folder_name, category_label) in enumerate(CATEGORIES, start=1):
        folder = SOURCE_ROOT / folder_name
        if not folder.exists():
            continue

        source_files = sorted(
            (path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS),
            key=natural_key,
        )

        for position, source_path in enumerate(source_files, start=1):
            with Image.open(source_path) as opened:
                opened.seek(0)
                icc_profile = opened.info.get("icc_profile")
                transposed = ImageOps.exif_transpose(opened)
                transposed.load()
                image = convert_to_srgb(transposed, icc_profile)

            caption = caption_for(source_path, category_label, position)
            unique_stem = f"{category_index:02d}-{position:02d}-{slugify(source_path.stem)}"
            thumbnail = save_pair(image, unique_stem, "thumb", 900, 78, 82)
            full = save_pair(image, unique_stem, "full", 2200, 84, 87)

            items.append(
                {
                    "id": unique_stem,
                    "category": category_label,
                    "caption": caption,
                    "alt": f"Rassvet — {caption}",
                    "thumbnail": thumbnail,
                    "full": full,
                    "width": image.width,
                    "height": image.height,
                    "portrait": image.height > image.width,
                    "lead": category_index == 1 and position == 1,
                }
            )

    return items


def write_manifest(items: list[dict[str, object]]) -> None:
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    MANIFEST_PATH.write_text(
        "// Generated by tools/build_gallery.py. Do not edit manually.\n"
        f"window.RASSVET_GALLERY = {payload};\n",
        encoding="utf-8",
    )


def main() -> None:
    items = build_gallery()
    write_manifest(items)
    print(f"Built {len(items)} gallery image(s).")


if __name__ == "__main__":
    main()
