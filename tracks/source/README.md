# Source GPX archive

Place Andrei's original Rassvet GPX recordings in this directory. Use `year/voyage-name/` folders: every GPX file is treated as one leg, while all legs in the same folder are presented as one voyage.

The source files remain untouched. Rebuild the lightweight public map after adding or renaming tracks:

```bash
python3 tools/build_tracks.py --tolerance 20
```

The generated `data/tracks.geojson` contains simplified geometry, dates, duration and distance calculated from the full recording. Multiple segments inside one GPX are preserved as a `MultiLineString`, so gaps are never connected by an invented straight line. Commit the original GPX files and the generated GeoJSON together.
