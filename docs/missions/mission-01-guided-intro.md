# Mission 01 — Guided Intro

## Core Identity

- **Mission ID:** `mission1`
- **Title:** `Primeros Pasos en Madrona`
- **City / Zone:** `Madrona / warehouse district`
- **Mission Type:** `tutorial-combat hybrid`
- **Playable Tone:** `controlled introduction with rising tension`
- **Narrative Purpose:** `teach the base verbs of the game while framing the player as an already active operator in the city`
- **Unlock Condition:** `new game start`
- **Reward:** `5000 money + unlock mission 02`

## One-Line Summary

The player learns movement, weapon cycling, vehicle entry, navigation, and basic combat during a short operation in Madrona that ends with a warehouse clean-up.

## Player Fantasy

- Feel like a capable but exposed street operator entering a live job.
- Learn the game naturally through action instead of pop-up overload.
- Finish the mission feeling ready for larger city-wide operations.

## Entry Conditions

- Player starts in Madrona near the city center.
- Time of day: late afternoon / early evening feel.
- Starting weapon available: pistol.
- Nearby vehicle available: red car at `[8, 0, 5]`.
- No wanted level on start.
- Light civilian presence, moderate police presence, gang presence only near the warehouse.

## Mission Flow

### Phase 01
- **Name:** Reach the contact point
- **Goal:** Teach basic movement and orientation.
- **Objective Type:** `reach`
- **Hint shown to player:** `Move with WASD. Reach the marked point.`
- **Success Condition:** Player enters radius near `[6, 0, 6]`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Small safe zone marker near the opening block.

### Phase 02
- **Name:** Equip the weapon
- **Goal:** Teach weapon cycling.
- **Objective Type:** `switch-weapon`
- **Hint shown to player:** `Press Q to cycle weapons and equip your sidearm.`
- **Success Condition:** Player weapon is not `fist`.
- **Fail Condition:** None.
- **Target / Trigger Data:** No world target required.

### Phase 03
- **Name:** Take a vehicle
- **Goal:** Teach entering vehicles and improve pacing.
- **Objective Type:** `enter-vehicle`
- **Hint shown to player:** `Approach the red car and press F to get in.`
- **Success Condition:** `player.inVehicle == true`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Use the car at `[8, 0, 5]` as the preferred tutorial vehicle.

### Phase 04
- **Name:** Drive to the warehouse
- **Goal:** Teach navigation using the beacon and minimap.
- **Objective Type:** `reach`
- **Hint shown to player:** `Follow the golden marker to the warehouse district.`
- **Success Condition:** Player reaches `[25, 0, 25]`.
- **Fail Condition:** None.
- **Target / Trigger Data:** Strong world-space beacon + minimap highlight.

### Phase 05
- **Name:** Clear the warehouse exterior
- **Goal:** Teach first combat under pressure.
- **Objective Type:** `eliminate-gangs`
- **Hint shown to player:** `Take down the gang members before they move the cargo.`
- **Success Condition:** Gang NPCs in Madrona mission area are dead.
- **Fail Condition:** Player death.
- **Target / Trigger Data:** Focus on the local warehouse gang group, not every gang NPC in the entire map long-term.

### Phase 06
- **Name:** Secure the evidence
- **Goal:** End the mission with a physical closing action.
- **Objective Type:** `reach`
- **Hint shown to player:** `Move to the evidence marker and secure the scene.`
- **Success Condition:** Player reaches `[27, 0, 27]` after combat phase is complete.
- **Fail Condition:** Player death.
- **Target / Trigger Data:** Final short-range marker inside or beside the warehouse zone.

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
  - Madrona gang group at the warehouse.
- **Civilians present**
  - A few civilians near the start area to make the city feel alive.
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
- Avoid strict fail states during the first 3 tutorial phases.

## Completion Logic

- Set `mission1 = completed`.
- Unlock `mission2` as the next featured mission.
- Reward player with money.
- Clear active mission state.
- Show mission-complete panel.

## Implementation Notes for Godot

- **Scene(s) involved:** intro block, vehicle zone, warehouse block.
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
