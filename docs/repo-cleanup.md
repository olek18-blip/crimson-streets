# Repository Cleanup Map

Last reviewed: 2026-04-28

## Canonical Work

- `godot_v2/`: current Godot 4.6 playable base. Keep project config, data, scenes, scripts, and `.uid` sidecar files together.
- `src/`, `public/`, `package.json`, Vite/React config: current web prototype and asset viewer stack.
- `docs/`: design, mission, deployment, and cleanup notes.

## Legacy / Reference

- `godot/`: earlier Godot prototype. Keep as reference while systems are still being migrated into `godot_v2/`.
- `build/web/README.md`: build output note currently tracked in GitHub; keep unless the build pipeline is rewritten.

## Local Only

- `.vscode/`: local editor settings and launch configs.
- `*.code-workspace`: local workspace files may contain machine-specific paths.
- `node_modules/`, `dist/`, `build/`: generated dependency/build output.

## Generated / Ignore

- `.godot/`: Godot editor cache.
- `*.import`: Godot import metadata generated from source assets.
- `*.translation`: generated binary translation output.
- `*.log`: local command/server logs.

## Important Godot Note

Godot 4.4+ generates `.uid` sidecar files for scripts and shaders. These should be committed with their matching source files so resource references stay stable across clones.
