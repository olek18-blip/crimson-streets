# The Dangerous Spain / Crimson Streets

A third-person crime-action game project in active prototype development.

This repository currently contains a web prototype built with React + Vite + Three.js / React Three Fiber, while the longer-term production direction is a Godot 4 game with Web export support.

## Current project direction

The project has moved beyond the old top-down / Canvas concept.

The current canonical direction is:
- title universe: The Dangerous Spain
- prototype repository name: Crimson Streets
- core fantasy: a corrupt police officer operating inside a layered system of gangs, institutional corruption, logistics crime, and political conspiracy
- MVP target: a Mandril vertical slice

## Canon premise

You play as Daniel Vega, a corrupt police officer working inside a compromised system.

The game is not centered only on street crime. Its identity comes from the tension between:
- police authority
- corruption as routine
- gang pressure
- evidence control
- internal investigations
- political power above street-level violence

## Current state of the repo

This repository currently includes:
- a playable 3D web prototype
- a redesigned HUD and minimap
- in-world objective beacon support
- a mission demo aligned with the MVP direction
- improved city blockout and district readability
- a stronger Mandril district pass
- atmospheric lighting and noir mood improvements
- mission, art direction, MVP, and GDD-alignment documentation

## MVP focus: Mandril vertical slice

The near-term goal is not a full open world.

The goal is a polished Mandril slice that proves:
- tone
- third-person traversal
- vehicle entry / exit
- basic driving pressure
- corruption-driven mission structure
- gang / police faction tension
- one meaningful pursuit
- one narrative hook strong enough to justify the full game

### Mandril slice target spaces

- police access point
- street market edge
- gang block pressure zone
- nightlife / club edge
- arterial road
- back lot / warehouse resolution space

## Main playable / reviewable pieces right now

### 1. Game prototype

The main game scene is the active environment prototype.

### 2. Mission demo

A mission demo route exists to communicate the MVP flow more clearly.

Current demo direction:
- briefing corruption beat
- protection money collection
- gang pressure
- pursuit escalation
- evidence recovery
- final conspiracy hook

## Repository structure

```text
crimson-streets/
|- src/                        # Current web prototype code
|- public/
|- docs/
|  |- art-direction/
|  |- deploy/
|  |- gdd/
|  |- missions/
|  |- mvp/
|- godot/                      # Reserved for Godot 4 production migration
|- build/web/                  # Reserved for future Godot Web export
|- vercel.json
|- package.json
|- README.md
```

## Tech stack

- React
- Vite
- TypeScript
- Three.js / React Three Fiber
- Zustand
- Tailwind-style UI workflow already present in the project

## Local development

Install and run:

```bash
git clone https://github.com/olek18-blip/crimson-streets.git
cd crimson-streets
npm install
```

### Normal dev mode

```bash
cmd /c npm run dev
```

Use this when you want to test the full scene.

### Fast dev mode

```bash
cmd /c npm run dev:fast
```

Use this for day-to-day iteration. It keeps the same app shell and game flow, but reduces the runtime load in development by trimming visible world content and skipping some heavy preloading.

### Validation

```bash
cmd /c npm run lint
cmd /c npm run build
```

## Deploy notes

The repository is currently configured for the Vite prototype, not yet for the future Godot export.

Current deploy target:
- framework: vite
- build command: `npm run build`
- output directory: `dist`

If Vercel shows an older menu or an older version tag, it is usually serving an older deployment or a cached page. In that case:
- hard refresh with `Ctrl + F5`
- check that Vercel is deploying from `main`
- redeploy the latest commit if needed

See:
- `docs/deploy/vercel-prototype-deploy.md`

## Important note about Godot

The repo already contains structure and planning for a future Godot 4 migration, but the current live-friendly version is still the web prototype.

When the Godot Web export becomes the primary runtime, deployment should switch from:
- `dist`

to:
- `build/web`

## Core documentation inside the repo

### GDD alignment

- `docs/gdd/gdd-canon-alignment.md`

### MVP planning

- `docs/mvp/mandril-vertical-slice.md`

### Mission structure

- `docs/missions/mission-template.md`
- `docs/missions/mission-01-guided-intro.md`
- `docs/missions/mission-mandril-dirty-patrol-blockout.md`
- `docs/missions/mission-data-schema.json`

### Art direction

- `docs/art-direction/visual-target.md`
- `docs/art-direction/character-style-guide.md`
- `docs/art-direction/environment-style-guide.md`
- `docs/art-direction/scene-targets.md`

## Current priorities

1. strengthen the Mandril vertical slice
2. turn the current blockout into a real mission flow
3. improve environment readability and atmosphere
4. move from prototype mission logic toward a reusable mission system
5. prepare the eventual Godot implementation path without losing momentum

## Strategic rule

Do not expand into a huge map before Mandril feels real.

A strong 15-20 minute vertical slice with identity, tension, and mission direction is more valuable than a broad but empty open world.

## License

MIT
