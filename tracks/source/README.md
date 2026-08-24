# Private GPX staging area

Original GPX recordings are intentionally excluded from the public Git repository.

For a local atlas rebuild, copy the private recordings into `year/voyage-name/` directories under this folder, run `python3 tools/build_tracks.py --tolerance 20`, and commit only `data/tracks.geojson`.

Do not force-add the source recordings to Git.
