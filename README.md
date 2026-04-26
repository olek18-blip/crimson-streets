# The Dangerous Spain / Crimson Streets

Third-person open-world crime-action prototype inspired by GTA-style systemic gameplay, with a stylized Spanish urban setting and a data-driven Godot 4 production path.

## Current status

The repository now contains two tracks:

1. **Web prototype** — the existing React / Vite / Three.js prototype used for quick visual iteration and mobile browser testing.
2. **Godot v2 base** — the new clean production-oriented Godot 4 rewrite in `godot_v2/`.

The current recommended direction is **Godot v2**.

The older `godot/` folder should be considered **legacy / experimental**. It contains useful earlier experiments, but new systems should be built in `godot_v2/`.

## Game direction

Working title universe: **The Dangerous Spain**  
Prototype repo name: **Crimson Streets**

Core fantasy:

> A corrupt police officer operating inside a layered Spanish urban system of gangs, institutional corruption, logistics crime, political pressure and evidence manipulation.

The goal is not just street crime. The identity comes from tension between:

- police authority
- corruption as routine
- gang pressure
- evidence control
- internal investigations
- political power above street-level violence
- open-world exploration and systemic missions

## Recommended MVP direction

Current recommendation:

- **Map size:** medium
- **Visual style:** mixed — low-poly / stylized noir with recognizable Spanish and Mediterranean urban references
- **Gameplay priority:** traffic + solid world + mission loop

This means: do not build a huge empty map. Build a compact city slice that feels alive.

## Repository structure

```text
crimson-streets/
├─ src/                         # Existing web prototype
├─ public/                      # Web prototype assets
├─ docs/                        # GDD, missions, art direction, deployment notes
├─ godot/                       # Legacy Godot experiments; do not expand unless migrating code out
├─ godot_v2/                    # Clean Godot 4 rewrite; current recommended production base
│  ├─ project.godot
│  ├─ data/
│  │  └─ barcelon_layout.json   # Data-driven city layout
│  ├─ scripts/
│  │  ├─ Game.gd
│  │  ├─ WorldBuilder.gd
│  │  └─ TrafficSystem.gd
│  └─ scenes/                   # Clean scenes should live here
├─ build/web/                   # Future Godot Web export target
├─ package.json
├─ vercel.json
└─ README.md
```

## Godot v2 architecture

The rewrite follows the useful patterns from GTA-like open-world engines and the SanAndreasUnity reference project, but rewritten for this project instead of copying code.

### Core principles

- **Data-driven world:** city data lives in JSON; code builds the world.
- **Systems over hardcoded scenes:** traffic, world building, missions and UI should be reusable systems.
- **Small playable slice first:** Barcelon / Mandril-style city slice before large-scale world expansion.
- **Traffic early:** roads and lanes are part of the world foundation, not a late cosmetic addition.
- **Separate prototype from production:** web prototype remains useful, but Godot v2 is the clean base.

### Current Godot v2 pieces

- `godot_v2/project.godot` — clean Godot project config.
- `godot_v2/data/barcelon_layout.json` — medium Barcelon layout with roads, sidewalks, buildings, trees, lanes and mission markers.
- `godot_v2/scripts/Game.gd` — central game manager stub.
- `godot_v2/scripts/WorldBuilder.gd` — data-driven world builder foundation.
- `godot_v2/scripts/TrafficSystem.gd` — pooled lane-based traffic system foundation.

## Web prototype

The existing web prototype remains available for fast iteration and browser testing.

Install and run:

```bash
git clone https://github.com/olek18-blip/crimson-streets.git
cd crimson-streets
npm install
npm run dev
```

Fast mode:

```bash
npm run dev:fast
```

Validation:

```bash
npm run lint
npm run build
```

## Godot v2 development

Open Godot 4 and load:

```text
godot_v2/project.godot
```

Recommended first target:

1. Create a clean `godot_v2/scenes/Main.tscn`.
2. Attach `Game.gd` as the main orchestrator.
3. Attach `WorldBuilder.gd` and load `barcelon_layout.json`.
4. Add player, camera, vehicle and HUD systems.
5. Connect `TrafficSystem.gd` to real traffic vehicle scenes.

## Migration plan

Move useful systems from the older prototype into `godot_v2/` only when they are clean, tested and needed.

Priority order:

1. **World foundation** — roads, buildings, sidewalks, props and collision.
2. **Player and camera** — stable third-person traversal.
3. **Vehicle gameplay** — enter, exit, drive, collide.
4. **Traffic** — lane following, pooling, braking, avoidance.
5. **HUD and minimap** — GTA-inspired but adapted to this game.
6. **Mission loop** — objective, marker, reward, consequence.
7. **Police / wanted system** — heat, escalation, response.
8. **Interiors** — scene swap / portal system.

## Design rule

Do not expand the world until the first 10–15 minutes feel good.

A compact city slice with readable roads, working vehicles, traffic, mission pressure and clean UI is more valuable than a large empty map.

## Documentation

Useful docs already in the repo:

- `docs/gdd/gdd-canon-alignment.md`
- `docs/mvp/mandril-vertical-slice.md`
- `docs/missions/mission-template.md`
- `docs/missions/mission-01-guided-intro.md`
- `docs/art-direction/visual-target.md`
- `docs/art-direction/environment-style-guide.md`
- `docs/deploy/vercel-prototype-deploy.md`

## Deployment notes

Current live deployment is still the web prototype:

- framework: Vite
- build command: `npm run build`
- output directory: `dist`

Future Godot Web deployment should use:

```text
build/web/
```

## License

MIT
