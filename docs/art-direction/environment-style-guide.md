# Environment Style Guide

## Purpose

Define how the world of **Crimson Streets** should look across districts, mission spaces, and mood transitions.

This guide translates the current visual references into practical production rules for Godot scenes, modular environment kits, lighting setups, and mission staging.

---

## Core World Identity

The city should feel like:

- decayed but alive
- cinematic but readable
- stylized rather than realistic
- modular enough for production
- varied by district without losing overall identity

The references suggest a world built around **urban noir**, but not only at night. The game should support:

- neon night combat spaces
- warm interior briefing spaces
- dawn / sunset transitional areas
- industrial daylight districts

This variety is important so the city does not feel visually flat.

---

## 1. Interior Noir Spaces

### Reference Read
The booth conversation image suggests a strong direction for:

- boss meetings
- mission briefings
- negotiation scenes
- betrayal cutscenes
- sidequest dialogue spaces

### Visual Rules
- dark wood booths
- warm tungsten pendant lights
- controlled pool lighting on faces and table surfaces
- soft green / cream neon signage in background
- deep shadows around edges of frame
- low clutter, high composition control

### Tone
- private
- tense
- controlled
- high-value criminal or political meeting place

### Best Uses
- mission intro scenes
- decision points
- cutscenes involving informants or bosses
- high-status enemy conversations

### Production Notes
This style works best when:
- the scene is compact
- lighting is intentional
- only a few props carry the scene
- characters are framed against darker backgrounds

Do not overfill these spaces with props.
The mood comes from composition, wood surfaces, lamp glow, and body language.

---

## 2. Market / Street Vendor Districts

### Reference Read
The market street image suggests a quieter district language useful for:

- civilian life
- side stories
- food vendor culture
- lower-tension traversal spaces
- pre-mission calm before combat escalation

### Visual Rules
- repetitive vendor stall silhouettes
- long open street axis with clear horizon line
- sun-low lighting with elongated shadows
- reflective patches and light water buildup
- simple storefront shapes with occasional vertical signs
- relaxed civilian composition before action begins

### Tone
- human
- grounded
- everyday city rhythm
- slightly melancholic but beautiful

### Best Uses
- calmer city traversal
- story contrast before violent missions
- civilian contact locations
- sidequest pickup areas

### Production Notes
This kind of area is important because it prevents the game from being only rain, neon, and gunfire.
It gives breathing room and helps the city feel inhabited.

Use:
- stalls
- carts
- bins
- tarps
- sign poles
- simple vendor props

Avoid turning it into a generic medieval market. It must stay urban and contemporary.

---

## 3. Port / Industrial Logistics Zones

### Reference Read
The container port image is excellent reference for:

- Valentia-type logistics districts
- smuggling missions
- surveillance operations
- daytime industrial spaces
- faction transitions between legal and illegal business

### Visual Rules
- stacked containers in large readable blocks
- cranes as skyline-defining silhouettes
- wide open ground planes
- sparse civilian density
- strong sunlight and hard shadow geometry
- industrial props used in large simple shapes

### Tone
- exposed
- practical
- high-risk because of openness
- commercial front hiding illegal operations

### Best Uses
- smuggling missions
- cargo interception
- tailing suspects
- sniper or stakeout mission layouts
- vehicle-based action

### Production Notes
This district should feel very different from alley noir spaces.
It should offer:
- longer sightlines
- more vehicle space
- more objective marker visibility
- more route-planning gameplay

Do not over-detail container surfaces.
Use big color masses, weathering hints, and strong shadows.

---

## 4. Night Commercial Streets / Kiosk Blocks

### Reference Read
The kiosk and hotel neon image is one of the strongest environment references for the overall public face of the city.

### Visual Rules
- narrow street proportions
- repeated vertical signs: hotel, kiosk, tabac, cine, bar
- reflective cobblestone or wet pavement
- blue ambient night + red/green/amber neon layering
- controlled storefront repetition for modular production
- one strong human silhouette in foreground works very well here

### Tone
- lonely
- dangerous
- stylish
- ideal for patrol, stalking, ambush, and gang territory scenes

### Best Uses
- free-roam night districts
- gang introductions
- wanted-level chases
- side alleys connected to main avenues
- high-atmosphere traversal

### Production Notes
This environment style is probably the best default identity for promotional material.
If a screenshot must scream **Crimson Streets**, it should often come from this type of district.

Prioritize:
- sign readability
- puddle reflections
- silhouette lighting
- street modularity

---

## 5. District Diversity Rules

Each district should have its own visual signature.

### Madrona
- central power district
- darker urban core
- noir night streets
- booths, bars, private rooms, warehouse edges

### Barceloma
- nightlife density
- brighter neon presence
- bar fronts, kiosks, club exteriors
- slightly louder signage and color

### Valentia
- port logistics and containers
- cranes and loading zones
- industrial daylight / foggy morning look

### Sevira
- rougher gang territory
- tighter alleys
- older facades
- harsher shadows and more visible damage

### Costa del Sol
- cleaner facades, tourist-commercial mix
- luxury fronts with hidden criminal activity
- polished surface against dangerous undercurrent

---

## 6. Time-of-Day Strategy

The game should not lock itself into one lighting setup.

### Night
Use for:
- combat
- wanted-level pressure
- noir identity
- promotional key art

### Sunset / Golden Hour
Use for:
- market zones
- transition scenes
- side content
- emotional narrative pacing

### Daylight / Industrial Haze
Use for:
- ports
- logistics
- public sector zones
- contrast against night crime fantasy

This variety increases perceived production value.

---

## 7. Environment Production Rules

### Modular kit priorities
Build kits around:
- storefront facades
- signs
- windows and shutters
- poles and wires
- stalls and carts
- booth interiors
- containers and cranes
- fences, dumpsters, bins, barrels

### Shape language
Prefer:
- bold readable block shapes
- clear verticals and horizontal anchors
- strong silhouette structures

Avoid:
- over-complicated facade modeling
- tiny prop noise everywhere
- decorative clutter that harms navigation readability

---

## 8. Lighting Rules

### Public streets at night
- blue fill
- warm signage highlights
- isolated pools of practical light
- reflections carrying color information

### Interiors
- amber tungsten primaries
- dark corners
- controlled face key light

### Industrial day scenes
- hard sunlight
- desaturated sky
- crisp shadow patterning

Lighting should separate gameplay-critical space from background dressing.

---

## 9. Mission Space Design Rules

A mission space is successful when:

- the player immediately reads where the action is
- the objective zone has visual focus
- combat silhouettes separate from background clutter
- faction colors remain readable under lighting conditions
- the environment supports the mission fantasy

Examples:
- briefing booth = negotiation tension
- market lane = calm or contact setup
- port = intercept / smuggling / exposure
- neon street = gang threat / pursuit / noir identity

---

## 10. Final Rule

Every environment should be judged with this test:

**Could this location tell the player what kind of scene they are in before any text appears?**

If the answer is no, the location needs stronger visual identity.
