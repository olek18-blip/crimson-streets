# Web build output

This folder is the deployment target for the Godot Web export.

Expected output files after export:

- `index.html`
- `*.js`
- `*.wasm`
- `*.pck`

## Local test

From this folder:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```
