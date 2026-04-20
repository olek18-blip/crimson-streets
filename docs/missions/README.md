# Mission design docs

This folder contains the mission design reference for **Crimson Streets**.

## Purpose

These files are the bridge between:

- mission ideas and flow reference,
- gameplay implementation in Godot,
- UI/HUD objective presentation,
- progression balancing.

## Suggested workflow

1. Design the mission flow in Markdown.
2. Validate pacing, objective order, fail states, and rewards.
3. Convert the mission into a Godot-friendly data structure.
4. Implement gameplay logic and triggers in the game.

## Files

- `mission-template.md` — reusable mission structure
- `mission-01-guided-intro.md` — first playable guided intro mission
- `mission-data-schema.json` — recommended JSON shape for later implementation
