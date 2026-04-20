# 🩸 Crimson Streets

> A GTA-style open-world game set in a fictional Spain. Built with HTML5 Canvas.

![Status](https://img.shields.io/badge/status-prototype-red)
![Engine](https://img.shields.io/badge/engine-HTML5%20Canvas-orange)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎮 About

**Crimson Streets** is a top-down open-world game inspired by classic GTA mechanics, set across six fictional Spanish cities. You play as **Inspector Vargas** — a morally ambiguous figure navigating crime, corruption, and chaos through the streets of a sun-scorched, politically volatile España.

The game runs entirely in the browser using **HTML5 Canvas**, with no external game engine dependencies.

---

## 🗺️ World

Six fictional cities, each with its own aesthetic and atmosphere:

| City | Vibe |
|------|------|
| 🏙️ **Valdecanto** | Urban sprawl, gang territory, main hub |
| 🌊 **Puerto Carmesí** | Coastal crime port, smuggling routes |
| 🏜️ **Ardales Seco** | Desert outskirts, lawless frontier |
| 🌿 **Sierra Oscura** | Mountain hideouts, rural corruption |
| 🏛️ **Torresanta** | Political capital, white-collar crime |
| 🔥 **Barrio Rojo** | Underground district, nightlife & vice |

---

## 🕹️ Core Mechanics (Prototype)

- [x] Top-down movement (player character)
- [x] Canvas rendering loop (`requestAnimationFrame`)
- [x] Basic city map / tilemap
- [x] Collision detection (rudimentary)
- [x] Player sprite & animation states
- [ ] Vehicle system
- [ ] NPC behavior / pathfinding
- [ ] Wanted level system
- [ ] Mission triggers
- [ ] Minimap HUD
- [ ] Sound & music system
- [ ] Save/load state

---

## 🧱 Tech Stack

```
📁 crimson-streets/
├── index.html          # Entry point
├── game.js             # Main game loop & state manager
├── player.js           # Player entity & controls
├── map.js              # Tilemap / world rendering
├── collision.js        # Collision logic
├── entities/           # NPCs, vehicles, objects
├── assets/
│   ├── sprites/        # Spritesheets
│   ├── tiles/          # Map tiles
│   └── audio/          # SFX & music (planned)
└── utils/              # Math helpers, vector2, etc.
```

> Built with: **Vanilla JS + HTML5 Canvas** — zero dependencies, runs in any modern browser.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/olek18-blip/crimson-streets.git
cd crimson-streets

# No install needed — just open in browser
open index.html
# or serve locally:
npx serve .
```

---

## 🗓️ Roadmap

### Phase 1 — World Foundation *(current)*
- Stable game loop & rendering pipeline
- Playable character with collision
- Basic city layout

### Phase 2 — Life in the Streets
- NPC spawning & basic AI (wander, flee, chase)
- Driveable vehicles
- Pedestrian traffic simulation

### Phase 3 — Story & Missions
- Inspector Vargas storyline
- Mission trigger system
- Dialogue system (minimal, text-based)
- Wanted level mechanic

### Phase 4 — Polish
- Minimap HUD
- Ambient audio & SFX
- Particle effects (explosions, tire tracks, blood)
- Day/night cycle

### Phase 5 — Distribution
- Itch.io release (free / pay-what-you-want)
- Mobile-friendly controls (touch input)
- Optional: port to Electron or PWA

---

## 🎭 Characters

**Inspector Vargas** — The protagonist. Ex-cop turned freelance operative. Knows where the bodies are buried because he put some of them there. Morally grey, tactically brilliant.

*More characters to be revealed as the story develops.*

---

## 🤝 Contributing

This is a solo dev project for now. Feel free to open issues with ideas, bugs, or city lore suggestions.

---

## 📄 License

MIT — do whatever you want, just don't make a worse GTA clone than this one.

---

*Made with 🩸 and Canvas API somewhere in Spain.*
