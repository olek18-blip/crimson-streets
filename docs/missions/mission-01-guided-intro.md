# Mission 01 — Guided Intro

## Core Identity

- **Mission ID:** `mission1`
- **Title:** `Primeros Pasos en Madrona`
- **City / Zone:** `Madrona / reserved booth / central streets / warehouse district`
- **Mission Type:** `tutorial-combat hybrid`
- **Playable Tone:** `directed intro with rising tension`
- **Narrative Purpose:** `teach the base verbs of the game while presenting the player as an active operator already inside a dangerous city network`
- **Unlock Condition:** `new game start`
- **Reward:** `5000 money + unlock mission 02`

## One-Line Summary

A short but directed opening job moves the player from a private briefing booth to the streets of Madrona, through a live pickup and into a warehouse cleanup that establishes the city’s tone and the player’s role.

## Player Fantasy

- Feel like a capable street operator receiving a real assignment, not a sterile tutorial.
- Learn movement, weapon, vehicle, navigation, and combat through fiction-driven objectives.
- Finish the mission with the sense that the city has opened up and bigger operations are coming.

## High-Level Scene Flow

1. **Briefing Scene** — reserved booth / criminal contact
2. **Street Deployment** — first movement and orientation in Madrona
3. **Contact Beat** — reach pickup point and confirm instructions
4. **Vehicle Beat** — claim a nearby car and head to the objective zone
5. **Warehouse Assault** — first combat space with gang resistance
6. **Aftermath Beat** — secure evidence and close the scene

## Entry Conditions

- Player starts in Madrona.
- Opening framing should imply they just left a private meeting.
- Time of day: late afternoon or blue-hour evening, depending on art direction pass.
- Starting weapon available: pistol.
- Nearby vehicle available: red car at `[8, 0, 5]`.
- No wanted level on start.
- Light civilian presence near the opening streets.
- Police visible but not aggressive until violence begins.
- Gang presence concentrated near the warehouse.

## Scene 01 — Briefing

### Intent
Introduce tone, hierarchy, and purpose before the player enters free movement.

### Target Space
- reserved booth / bar back room
- warm tungsten pendant light
- dark wood surfaces
- controlled, private atmosphere

### Narrative Beat
A contact gives the player a fast job: recover incriminating evidence from a Madrona warehouse before a local gang relocates it.

### Implementation Shape
- In current prototype: represented through HUD text, mission title, or future modal panel.
- In Godot later: short in-engine conversation scene or stylized briefing overlay.

### Outcome
The player exits the scene already knowing they are on a live job.

## Scene 02 — Street Deployment

### Intent
Teach basic movement while grounding the player in the city.

### Target Space
- public street edge in Madrona
- readable sightline toward first marker
- light civilian density
- visible urban signage or city identity elements

### Objective
#### Phase 01
- **Name:** Reach the contact point
- **Goal:** Teach basic movement and orientation.
- **Objective Type:** `reach`
- **Hint shown to player:** `Move with WASD. Reach the marked point.`
- **Success Condition:** Player enters radius near `[6, 0, 6]`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Safe zone marker near the opening street block.

## Scene 03 — Contact Beat

### Intent
Bridge tutorial and mission fiction.

### Target Space
- small street-side interaction area
- should feel like a public but controlled pickup point
- no full dialogue tree required; clarity matters more than complexity

### Objective
#### Phase 02
- **Name:** Equip the weapon
- **Goal:** Teach weapon cycling as part of operational readiness.
- **Objective Type:** `switch-weapon`
- **Hint shown to player:** `Press Q to cycle weapons and equip your sidearm.`
- **Success Condition:** Player weapon is not `fist`.
- **Fail Condition:** None.
- **Target / Trigger Data:** No world target required.

### Narrative Function
The game implies the player confirms the job and prepares before moving out.

## Scene 04 — Vehicle Beat

### Intent
Teach mobility and transition the player from setup to mission approach.

### Target Space
- nearby curbside lane
- tutorial car easy to spot
- no threat yet, only urgency

### Objective
#### Phase 03
- **Name:** Take a vehicle
- **Goal:** Teach entering vehicles and improve pacing.
- **Objective Type:** `enter-vehicle`
- **Hint shown to player:** `Approach the red car and press F to get in.`
- **Success Condition:** `player.inVehicle == true`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Use the car at `[8, 0, 5]` as the preferred tutorial vehicle.

#### Phase 04
- **Name:** Drive to the warehouse
- **Goal:** Teach navigation using the beacon and minimap.
- **Objective Type:** `reach`
- **Hint shown to player:** `Follow the golden marker to the warehouse district.`
- **Success Condition:** Player reaches `[25, 0, 25]`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Strong world-space beacon + minimap highlight.

## Scene 05 — Warehouse Assault

### Intent
Deliver the first real spike of danger.

### Target Space
- warehouse exterior
- fenced edge or loading zone
- readable combat perimeter
- clear enemy silhouettes
- cover objects that are easy to understand

### Objectives
#### Phase 05
- **Name:** Clear the warehouse exterior
- **Goal:** Teach first combat under pressure.
- **Objective Type:** `eliminate-gangs`
- **Hint shown to player:** `Take down the gang members before they move the cargo.`
- **Success Condition:** Intro gang group is eliminated.
- **Fail Condition:** Player death.
- **Target / Trigger Data:** Use a specific intro enemy group such as `gang_madrona_intro`, not all gangs in the city.

### Combat Tuning
- Enemy count: 2 to 3 gang members.
- Aggression should feel real but forgiving.
- Police should remain a looming presence, not immediate chaos.

## Scene 06 — Aftermath Beat

### Intent
Teach that combat is not the end of an objective loop.

### Target Space
- same warehouse zone after combat
- calmer, readable objective marker
- evidence point easy to identify

### Objective
#### Phase 06
- **Name:** Secure the evidence
- **Goal:** End the mission with a physical closing action.
- **Objective Type:** `reach`
- **Hint shown to player:** `Move to the evidence marker and secure the scene.`
- **Success Condition:** Player reaches `[27, 0, 27]` after combat phase is complete.
- **Fail Condition:** Player death.
- **Target / Trigger Data:** Final marker at evidence zone.

### Narrative Outcome
The player successfully recovers proof, gets paid, and becomes tied to the wider criminal/political conflict.

## HUD / UI Support

- Mission title shown as: `MISIÓN ACTIVA — Primeros Pasos en Madrona`
- Active objective text updates once per completed phase.
- Objective marker / beacon color: gold / amber.
- Minimap behavior: active objective always highlighted above passive mission markers.
- On-screen tutorial hints should be short and disappear after objective completion.
- Mission complete screen should reinforce payout and the feeling of entering the city properly.

## World Setup

- **Important positions**
  - Contact point: `[6, 0, 6]`
  - Tutorial vehicle: `[8, 0, 5]`
  - Warehouse zone: `[25, 0, 25]`
  - Evidence point: `[27, 0, 27]`
- **Enemies present**
  - Intro gang group at warehouse perimeter.
- **Civilians present**
  - A few civilians near start streets.
- **Police presence**
  - Police patrols visible but not aggressive until violence begins.
- **Vehicles available**
  - At least one obvious tutorial car near spawn.
- **Objects to interact with**
  - Final evidence marker / pickup area.

## Difficulty Tuning

- Expected mission length: `4 to 8 minutes`.
- Enemy count: `2 to 3 gang enemies` for first combat.
- Expected player health loss: `low to medium`.
- Safe fallback if player struggles: low gang aggression radius, slow reaction time, generous hit detection.
- First tuning targets if the mission feels bad:
  1. vehicle step pacing,
  2. gang aggression,
  3. combat objective clarity,
  4. evidence marker visibility.

## Fail States

- Player dies during warehouse assault.
- Optional future fail state: player leaves the combat area for too long.
- Avoid strict fail states during the first 4 tutorial phases.

## Completion Logic

- Set `mission1 = completed`.
- Unlock `mission2` as the next featured mission.
- Reward player with money.
- Clear active mission state.
- Show mission-complete panel.

## Implementation Notes for Godot

- **Scene(s) involved:** briefing overlay or in-engine booth scene, Madrona street block, vehicle zone, warehouse block.
- **Trigger node(s):** area triggers for reach phases, vehicle proximity interaction, combat clear check, final evidence area.
- **NPC groups used:** `gang_madrona_intro` preferred instead of checking all city gangs.
- **Objective script hooks needed:**
  - `on_player_reach_area`
  - `on_weapon_changed`
  - `on_enter_vehicle`
  - `on_enemy_group_cleared`
- **Save/load data needed:** active phase index, mission state, reward claimed flag.

## Design Notes

This mission should feel like a real opening job, not a sterile tutorial. The player must always feel that every taught mechanic matters immediately inside the fiction of the city.
