# AirwaveDB Website

Static browser and player for the AirwaveDB dataset.

The site loads country indexes and station data from [`AirwaveDB/api`](https://github.com/AirwaveDB/api). Audio is played directly from each broadcaster's stream endpoint; AirwaveDB does not proxy or rebroadcast audio.

## Local development

Any static HTTP server can serve the repository root.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Deployment

The GitHub Pages workflow publishes the repository root on pushes to `main`.