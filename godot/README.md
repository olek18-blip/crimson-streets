# Godot project folder

This directory is reserved for the Godot 4 version of **Crimson Streets**.

## Recommended contents

- `project.godot`
- `export_presets.cfg`
- `scenes/`
- `scripts/`
- `assets/`
- `ui/`
- `audio/`

## Web export target

Export the HTML5/Web build to:

```text
../build/web/
```

That output path is already wired for Vercel through the root `vercel.json`.

## Important

- Use **Godot 4 single-threaded Web export** first for the simplest deployment.
- Avoid C# if Web export is a hard requirement.
- Do not commit `.godot/` or `*.import` files.
