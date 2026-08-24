# S/Y Rassvet

Source code and content for the documented history of **S/Y Rassvet**, Ohlson 29 hull 170.

Live website: **https://sy-rassvet.com**

## About the project

This repository contains a static, multilingual archive of Rassvet's design, maintenance, voyages, onboard systems and photographs. It records the yacht's chapter in Kiel under Andrei's ownership from 2023 to 2026 and her handover to Janne and Rabea in August 2026.

The site is built with plain HTML, CSS and JavaScript and is published through GitHub Pages from the repository's `main` branch. It does not use an application server, database, analytics service or client-side framework.

## Features

- responsive single-page layout
- English, German and Russian translations
- automatic initial language selection from browser preferences
- manual `EN / DE / RU` language selector with the choice stored locally
- documented maintenance timeline and cruising history
- chevron-flow ownership history from FULLSTAR to the current RASSVET chapter
- historical snapshot of the yacht's systems in 2026
- responsive image gallery with a full-screen photo viewer
- generated WebP and JPEG gallery assets
- custom domain and HTTPS through GitHub Pages

## Project structure

```text
index.html                  Main page structure and English source content
styles.css                  Core layout and visual design
ownership-flow.css         Four-stage ownership chevron flow
new-chapter.css             August 2026 handover and farewell section
onboard-systems.css         Historical onboard-systems section
script.js                   Dynamic voyage, systems and logbook content
gallery.js                  Hero photograph, gallery and photo viewer
gallery-data.js             Generated gallery manifest
gallery.css                 Gallery grid and viewer styles
i18n.js                     Language detection and translation runtime
i18n-de-*.js                German translation dictionaries
i18n-ru-*.js                Russian translation dictionaries
photos/source/              Original photographs grouped by category
photos/generated/           Optimised gallery images generated from originals
tools/build_gallery.py      Gallery asset and manifest generator
CNAME                       GitHub Pages custom domain
```

Additional CSS files keep individual sections and features isolated from the main stylesheet.

## Running locally

The website must be served over HTTP rather than opened directly from the filesystem, because it loads scripts, styles and image assets by relative URL.

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Language-specific testing URLs:

```text
http://localhost:8000/?lang=en
http://localhost:8000/?lang=de
http://localhost:8000/?lang=ru
```

A previously selected language is stored in `localStorage`. Clear the `rassvet-language` value or use a private browser window when testing first-visit language detection.

## Editing website content

English is the canonical source language. Most static content is in `index.html`, while dynamically rendered sections are defined in `script.js`, `gallery.js`, `design-history.js` and `video-tour.js`.

When English wording changes, update the corresponding entries in the German and Russian translation dictionaries. The translation runtime also observes content added dynamically after page load.

## Managing photographs

Original photographs are stored under `photos/source/` in category folders:

```text
01-under-sail
02-exterior
03-deck-cockpit
04-interior
05-engine-systems
06-rig-sails
07-underwater-hull
```

The numeric prefixes control category order. Files inside each folder are sorted naturally by filename.

Public captions are generated from the category and image position, for example `Under sail 3` or `Exterior 2`. Original camera filenames, timestamps and DJI or IMG identifiers are not displayed on the website.

### Rebuilding the gallery

The gallery generator requires Python, Pillow and pillow-heif:

```bash
python3 -m pip install Pillow pillow-heif
python3 tools/build_gallery.py
```

The script:

1. reads supported images from `photos/source/`;
2. applies EXIF orientation;
3. converts images to sRGB;
4. creates responsive WebP and JPEG variants in `photos/generated/`;
5. rewrites `gallery-data.js`.

The generated files are part of the deployed static website and should be committed together with source-photo changes.

Supported source formats include HEIC, HEIF, HIF, JPEG, PNG and WebP.

## Language selection

The initial language is selected in this order:

1. a valid `?lang=en`, `?lang=de` or `?lang=ru` URL parameter;
2. the visitor's previously selected language stored in the browser;
3. browser and operating-system language preferences from `navigator.languages`;
4. English as the fallback.

No IP-based geolocation or external language-detection service is used.

## Deployment

GitHub Pages publishes the repository root from `main`. The `CNAME` file assigns the custom domain:

```text
sy-rassvet.com
```

Normal deployment workflow:

1. create a branch;
2. make and test the changes locally;
3. open a pull request against `main`;
4. merge the pull request;
5. wait for the GitHub Pages deployment to finish;
6. perform a hard reload when testing changes to JavaScript or CSS.

The `www.sy-rassvet.com` DNS record redirects visitors to the apex domain.

## Maintenance checklist

Before merging website changes, verify:

- all three language versions render without untranslated English fragments;
- navigation links work;
- gallery thumbnails load and open in the full-screen viewer;
- portrait and landscape photographs remain centred;
- keyboard controls work in the viewer (`Escape`, left arrow and right arrow);
- the browser console contains no JavaScript errors;
- the layout remains usable on desktop and mobile widths.

## Ownership and content

The website is a historical archive. Photographs, maintenance records and original writing from the 2023–2026 chapter belong to their respective authors unless otherwise stated.
