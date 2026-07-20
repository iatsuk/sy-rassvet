# Gallery source photographs

Put photographs into the folders below. The website gallery is generated automatically after the photographs are pushed to `main`.

## Folders

- `01-under-sail` — sailing photographs and the strongest exterior image. The first file in this folder becomes the large lead image.
- `02-exterior-and-deck` — hull, deck, rig, bow platform and exterior details.
- `03-cockpit` — cockpit, tiller, controls and deck access.
- `04-interior` — saloon, berths, galley, heads and storage.
- `05-engine-and-systems` — engine, batteries, charging, instruments and plumbing.
- `06-underwater-and-haulout` — keel, rudder, propeller, shaft and underwater hull.
- `07-details-and-documents` — sails, anchors, equipment details and useful documentation photographs.

Not every folder has to be used.

## File names and order

Files are shown alphabetically inside each folder. Prefix names with two digits to control the order:

- `01-rassvet-under-sail.jpg`
- `02-starboard-side.jpg`
- `03-bow-platform.jpg`

The visible caption is generated from the file name. Use short English descriptions where possible. Generic iPhone names such as `IMG_1234` work, but produce less useful captions.

## Accepted formats

JPEG, JPG, PNG, WebP, HEIC and HEIF are accepted. Do not upload the `.MOV` part of an iPhone Live Photo.

## Automatic processing

A GitHub Action:

1. reads every supported photograph in these folders;
2. corrects iPhone orientation;
3. generates full-size WebP images with a 2400 px maximum edge;
4. generates lightweight thumbnails;
5. removes metadata from the published WebP files;
6. creates the gallery manifest used by the website;
7. commits the generated files back to the repository.

The original source photographs remain in the public repository and its Git history. Remove location metadata before uploading if the photograph was taken at a private berth, home or other sensitive location.
