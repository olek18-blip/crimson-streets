# Mission Template

## Core Identity

- **Mission ID:** `mission-x`
- **Title:**
- **City / Zone:**
- **Mission Type:** tutorial / chase / combat / delivery / stealth / boss / hybrid
- **Playable Tone:**
- **Narrative Purpose:**
- **Unlock Condition:**
- **Reward:** money / unlock / weapon / vehicle / story flag

## One-Line Summary

A concise sentence describing the mission fantasy.

## Player Fantasy

- What should the player feel during this mission?
- What skill or system is being taught or reinforced?
- Why is this mission memorable?

## Entry Conditions

- Player spawn / start area
- Time of day
- Required weapon / vehicle / item
- Initial wanted level
- Friendly / enemy setup

## Mission Flow

### Phase 01
- **Name:**
- **Goal:**
- **Objective Type:** reach / switch-weapon / enter-vehicle / eliminate-gangs / interact / survive / escape
- **Hint shown to player:**
- **Success Condition:**
- **Fail Condition:**
- **Target / Trigger Data:**

### Phase 02
- **Name:**
- **Goal:**
- **Objective Type:**
- **Hint shown to player:**
- **Success Condition:**
- **Fail Condition:**
- **Target / Trigger Data:**

### Phase 03
- **Name:**
- **Goal:**
- **Objective Type:**
- **Hint shown to player:**
- **Success Condition:**
- **Fail Condition:**
- **Target / Trigger Data:**

## HUD / UI Support

- Mission title shown as:
- Active objective text:
- Objective marker / beacon color:
- Minimap behavior:
- On-screen tutorial hints:
- Mission complete screen text:

## World Setup

- Important positions
- Enemies present
- Civilians present
- Police presence
- Vehicles available
- Objects to interact with

## Difficulty Tuning

- Expected mission length:
- Enemy count:
- Expected player health loss:
- Safe fallback if player struggles:
- What should be tuned first if the mission feels bad:

## Fail States

- Player death
- Objective timeout
- Story-critical target lost
- Area abandoned
- Wrong NPC killed

## Completion Logic

- What flags are set on success?
- What mission unlocks next?
- What world state changes after success?

## Implementation Notes for Godot

- Scene(s) involved:
- Trigger node(s):
- NPC groups used:
- Objective script hooks needed:
- Save/load data needed:

## JSON Sketch

```json
{
  "id": "mission-x",
  "title": "Mission Title",
  "city": "madrona",
  "reward": 5000,
  "phases": [
    {
      "id": "phase-01",
      "title": "Reach the contact",
      "objective_type": "reach",
      "hint": "Follow the marker.",
      "target_position": [0, 0, 0],
      "success_condition": "player enters radius",
      "fail_condition": null
    }
  ]
}
```
