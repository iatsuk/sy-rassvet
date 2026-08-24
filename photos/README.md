# Gallery photographs

Upload photographs into the category folders inside `photos/source/`. The website gallery is rebuilt automatically after the files reach the `main` branch.

## Folders

1. `01-under-sail` — Rassvet sailing, preferably the strongest lead photograph first.
2. `02-exterior` — hull, bow, stern and full-boat views at the berth or ashore.
3. `03-deck-cockpit` — cockpit, deck layout, bow platform and deck equipment.
4. `04-interior` — saloon, berths, galley, heads and storage.
5. `05-engine-systems` — engine, electrical system, batteries, instruments and plumbing.
6. `06-rig-sails` — mast, rigging, sails, furling system and winches.
7. `07-underwater-hull` — keel, rudder, propeller, shaft and underwater hull.

## Ordering and captions

- Folders are shown in the order above.
- Files inside a folder are sorted alphabetically.
- Prefix filenames with `01-`, `02-`, and so on when the order matters.
- A descriptive filename such as `01-port-side-under-sail.heic` becomes the caption `Port side under sail`.
- Generic iPhone names such as `IMG_1234.HEIC` are accepted; the gallery will use the category name and a sequence number instead.
- The first photograph in `01-under-sail` becomes the large lead tile.

## Accepted files

`HEIC`, `HEIF`, `JPG`, `JPEG`, `PNG` and `WEBP` are supported.

Raw iPhone photographs of 3–4 MB can be uploaded without preparation. The builder will make lightweight web copies automatically. However, Git keeps the uploaded originals in repository history, so the recommended option is to export selected photographs at approximately 2500–3000 pixels on the long edge and JPEG quality around 80–85 before uploading. This normally preserves more than enough detail for the website while keeping the repository substantially smaller.

The automatic builder:

- corrects iPhone EXIF orientation;
- converts HEIC/HEIF when necessary;
- converts wide-gamut photographs to sRGB when an embedded colour profile is available;
- strips EXIF and location metadata from published images;
- creates a lightweight thumbnail and a larger viewing image in WebP and JPEG;
- updates `gallery-data.js`, so no HTML or JavaScript editing is required.

Do not place generated files manually in `photos/generated/`; that folder is managed by the workflow.
