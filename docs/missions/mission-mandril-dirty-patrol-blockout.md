# Mandril Mission Blockout — Dirty Patrol

## Purpose

This document translates the current Mandril district pass into a playable mission blockout for the MVP slice.

The goal is to make the environment serve gameplay directly.

---

## Mission Identity

- **Mission ID:** `dirty-patrol-blockout`
- **Working Title:** `Dirty Patrol`
- **District:** `Mandril`
- **Mission Family:** `Corrupt Police Mission`
- **Tone:** `controlled corruption → street pressure → escalation`

---

## Core Fantasy

Daniel Vega starts under official cover and carries out an unofficial enforcement routine. What begins as a routine protection-money collection turns into gang friction, pursuit pressure, and the first clear sign that the corruption network extends beyond street crime.

---

## Current Layout Mapping

### 1. Police Access Point
Use the current barrier / blue-light zone as the start.

**Function:**
- briefing start
- police identity framing
- official cover fantasy

**Beat:**
- receive dirty order from Roldán
- establish Daniel as compromised but functional inside the institution

---

### 2. Street Market Edge
Use the stall zone as the first public objective space.

**Function:**
- collection point
- civilian contrast
- low-intensity tension

**Beat:**
- player approaches stall owner / protected business
- implied extortion / collection under police authority
- no combat yet

---

### 3. Gang Block Pressure Zone
Use the transition space between market and nightlife edge.

**Function:**
- show territorial response
- shift from institutional corruption to street power resistance

**Beat:**
- local gang questions the patrol
- pressure rises
- possible shove / warning / drawn weapons

---

### 4. Club Edge / Neon Strip
Use the neon building zone as the nightlife pressure scene.

**Function:**
- faction heat
- suspect visibility
- chase trigger point

**Beat:**
- informant or runner appears
- player must react fast
- transition from intimidation to movement urgency

---

### 5. Arterial Road Chase Path
Use the main road axis leaving Mandril as the pursuit lane.

**Function:**
- vehicle pursuit proof
- wanted-state pressure
- traffic corridor feeling

**Beat:**
- suspect flees by vehicle
- Daniel follows under rising pressure
- the pursuit must feel like a real escalation, not a disconnected minigame

---

### 6. Back Lot / Warehouse Resolution Zone
Use the back-lot / dumpster area as the combat + evidence beat.

**Function:**
- compact confrontation zone
- clear enemy read
- evidence pickup / reveal point

**Beat:**
- suspect reaches stash point or handoff point
- gang resistance appears
- player secures item / evidence after confrontation

---

## Blockout Objective Flow

### Phase 01 — Dirty Briefing
- Start at police access point
- Short order delivery
- Mission prompt appears

### Phase 02 — Collect the Payment
- Move to market edge
- Reach protected business
- Trigger corruption beat

### Phase 03 — Handle Street Resistance
- Gang members confront player
- Threat level rises
- Move toward nightlife strip

### Phase 04 — Chase the Runner
- Informant escapes
- Enter vehicle
- Follow arterial route

### Phase 05 — Break the Handoff
- Reach back-lot / warehouse edge
- Confront suspect and gang protection
- Clear resistance

### Phase 06 — Secure the Evidence
- Pick up evidence / confirm recovery
- Trigger reveal line or mission-complete hook

---

## Spatial Rule

Each zone must be readable without UI first:
- police zone = blue / authority
- market zone = civilian / public
- club edge = neon / unstable
- road = speed / exposure
- back lot = criminal handoff / danger

If the player cannot infer the kind of scene from the space itself, the blockout needs stronger identity.

---

## Gameplay Rule

The mission should move through:
1. authority
2. corruption
3. resistance
4. urgency
5. confrontation
6. consequence

That sequence is the real backbone of the MVP slice.

---

## Immediate Implementation Use

This blockout can now drive:
- mission trigger placement
- NPC placement
- environment polish priorities
- UI marker priorities
- future Godot trigger areas
