# GDD Canon Alignment

This document aligns the current repository with the uploaded **The Dangerous Spain** Game Design Document.

## Source of truth

The attached GDD is the current **textual canon reference** for:

- world structure
- city identities
- protagonist and main cast
- faction logic
- MVP scope
- tone and art direction
- production roadmap

The prototype may still use placeholder names and earlier iterations, but future production decisions should follow the GDD unless intentionally revised.

---

## 1. Canon Premise

**The Dangerous Spain** is defined as an open-world third-person action game built around a corrupt police protagonist operating inside a layered system of gangs, police corruption, logistics crime, elite influence, and political conspiracy.

The key differentiator is not “crime from outside the system”, but **rot from within the system**.

That makes the project stronger when missions combine:
- police procedure
- coercion
- cover-up
- criminal facilitation
- evidence management
- faction manipulation

---

## 2. Canon Protagonist

### Official protagonist
- **Daniel Vega**
- role: corrupt police officer

### Canon dramatic function
Daniel is the player’s route into:
- bureaucracy
- gangs
- ports
- elites
- media pressure
- internal investigations

Future mission writing, UI flavor, and character presentation should support this identity.

---

## 3. Canon Territory Names

According to the GDD, the six major territories are:

- **Gallichia**
- **Mandril**
- **Barcelon**
- **Valentia**
- **Sevira**
- **Costa del Sol**

These names should be treated as canon moving forward.

---

## 4. Prototype-to-Canon Mapping

The current prototype and earlier concept passes still contain older placeholder territory naming.

Use this temporary production mapping:

| Current prototype name | Canon GDD name |
|---|---|
| Madrona | Mandril |
| Barceloma | Barcelon |
| Valentia | Valentia |
| Sevira | Sevira |
| Costa del Sol | Costa del Sol |
| Gallichia | Gallichia |

### Rule
Do **not** rush a destructive rename in gameplay code unless needed immediately.

Instead:
1. treat GDD names as canon,
2. keep temporary compatibility where prototype systems still depend on old ids,
3. migrate names in a controlled pass later.

---

## 5. Canon Main Characters

The GDD establishes these major dramatic roles:

- **Daniel Vega** — protagonist / corrupt police officer
- **Lucía Serrano** — investigative journalist
- **Comisario Esteban Roldán** — superior officer / corrupter
- **Mauro “El Porto”** — port-network boss
- **Inés Valcárcel** — political strategist
- **Raúl “Nano” Cortés** — gang connector in Mandril
- **Inspectora Vega Morales** — Asuntos Internos antagonist
- **Alejandro Rivas** — fictional president

These characters should become the main narrative spine.

---

## 6. Canon Factions

The GDD defines the key faction structure as:

- **National Police**
- **Asuntos Internos**
- **Street Gangs**
- **Port Network**
- **Political Circle**

This should replace any overly generic faction framing in future documentation.

---

## 7. Canon MVP Scope

The GDD is explicit:

The MVP should focus on **Mandril** as a vertical slice proving:

- tone
- traversal
- one dense city district
- one meaningful pursuit
- one corruption mission
- one faction collision
- one narrative hook strong enough to justify continued development

### Canon MVP content targets
- playable zone with sub-areas: street market, gang blocks, arterial road, club edge, police access point
- third-person movement, sprint, cover basics, weapon handling, vehicle entry/exit
- one patrol car and one civilian vehicle class
- baseline shooting loop with police and gang AI archetypes
- mission set centered on **Dirty Patrol** plus **Night Chase** or equivalent
- intro cinematic, contact calls, one major reveal, final hook
- UI: health, ammo, wanted state, objective marker, faction callouts, mission prompts

This is now the clearest production target for the repo.

---

## 8. Canon Mission Families

The GDD defines these mission families as foundational:

- Corrupt Police Missions
- Street Control Missions
- Pursuit Missions
- Infiltration Missions
- Port & Logistics Missions
- Luxury / Elite Missions

That means the project should not be shaped only around street shootouts.
It should support procedural and social pressure as much as action.

---

## 9. Canon Art Direction

The GDD confirms the strongest art keywords as:

- **urban noir**
- **wet asphalt**
- **coastal corruption**
- **industrial twilight**
- **political luxury**
- **stylized realism**

This aligns strongly with the current visual references already collected in the repository.

### Canon city color identity
- **Gallichia** → cold institutional blues
- **Mandril** → dense neutral / amber urban layers
- **Barcelon** → nightlife magentas and sea reflections
- **Valentia** → dry industrial tones
- **Sevira** → warmer historical contrasts
- **Costa del Sol** → polished sunset luxury

These color identities should guide district implementation and lighting presets.

---

## 10. Strategic Production Rule

The GDD recommends:

- do not pitch the project as a clone,
- lock stylized urban-noir art direction early,
- keep the MVP narrow,
- invest heavily in mission scripting and tone,
- use fictional naming consistently.

This should guide all next steps in the repo.

---

## 11. Immediate Repo Consequences

From now on, the repository should treat these as next-step priorities:

1. Mandril-first vertical slice planning
2. corruption-focused police mission loop
3. one pursuit mission with consequence
4. faction-based tension between police and gangs
5. UI that supports premium crime-thriller tone
6. controlled migration from prototype placeholder names to canon GDD naming

---

## Final Note

The current prototype remains useful, but the GDD now gives the project a stronger and more coherent production identity.

Future work should follow the GDD canon first, then adapt the prototype toward it.
