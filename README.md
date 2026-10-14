# AirwaveDB Website

Static browser and player for the AirwaveDB dataset.

The site loads country indexes and station data from [`AirwaveDB/api`](https://github.com/AirwaveDB/api). Audio is played directly from each broadcaster's stream endpoint; AirwaveDB does not proxy or rebroadcast audio.

Large country results are rendered progressively so the browser does not create thousands of player elements at once.

## Local development

Any static HTTP server can serve the repository root.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Validation

Pull requests and pushes to `main` run lightweight JavaScript and HTML-hook checks. The site is plain static HTML/CSS/JavaScript and has no build step or package dependencies.

## Deployment

The repository is ready for static hosting. GitHub Pages deployment is intentionally not run until Pages is enabled for the repository; the current GitHub integration cannot enable Pages on the organization repository by itself.

## License

Source code is licensed under the [MIT License](LICENSE).
