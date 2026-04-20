# Vercel Deployment — Current Prototype

This document explains how to deploy the **current Vite/React prototype** of Crimson Streets to Vercel.

## Current deployment target

Right now, the repository should be deployed as the **web prototype**, not as the future Godot export.

### Current setup
- framework: `vite`
- build command: `npm run build`
- output directory: `dist`

The root `vercel.json` is now aligned with that setup.

---

## Steps in Vercel

1. Import the GitHub repository into Vercel.
2. Keep the root directory as `/`.
3. Vercel should detect **Vite**.
4. If it asks manually, use:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Deploy.

---

## What you should test after deploy

- main menu loads correctly
- `NEW GAME` works
- `MISSION DEMO` button works
- `/mission-demo` route loads correctly
- no obvious missing assets or blank WebGL scene

---

## Important note about Godot

This Vercel setup is for the **current prototype only**.

When the project moves to a real Godot web export, the deployment target should change to:

- output directory: `build/web`
- possible extra headers if threaded web export is used

At that point, `vercel.json` should be switched again for Godot.

---

## Recommended near-term workflow

1. Keep prototype online in Vercel.
2. Use it to review:
   - menu
   - mission demo
   - UI direction
   - vertical slice logic
3. Build Godot in parallel.
4. Swap Vercel target later when Godot web export is ready.
