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

GitHub Pages must use **GitHub Actions** as its source. Once Pages is enabled for the repository, the deployment workflow publishes the repository root on pushes to `main`.

## License

Source code is licensed under the [MIT License](LICENSE).