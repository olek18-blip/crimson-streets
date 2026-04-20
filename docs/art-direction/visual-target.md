# Visual Target

## Core Direction

**Crimson Streets** should aim for a:

- **stylized urban noir look**
- **low-poly / faceted character language**
- **wet neon street atmosphere**
- **high readability at gameplay distance**
- **cinematic mood without realism overhead**

The target is not photorealism.
The target is a game world that feels bold, dangerous, readable, and memorable.

## Reference Read Taken From Current Visual Direction

The current reference direction suggests these strong qualities:

- rain-soaked alleys with heavy reflections
- orange/red neon mixed with police blue lights
- faceted characters with exaggerated coats, shoulders, hats, and gear
- dark, compressed value range with strong accent lighting
- silhouettes that remain readable even before texture detail
- noir tension with arcade clarity

## Art Pillars

### 1. Readability First
At gameplay distance, the player must instantly understand:

- who is police
- who is gang
- who is civilian
- who is a mission-critical target
- who is the player character

If a design looks cool but merges into the environment, it fails.

### 2. Strong Silhouette Over Detail
Each important character must read through:

- coat shape
- shoulder width
- headwear
- weapon pose
- stance
- body proportions

Fine details are secondary.

### 3. Color as Gameplay Language
Use color to communicate danger and role.

#### Primary environment palette
- deep navy
- dirty charcoal
- wet asphalt black
- concrete gray-brown
- muted fog blue

#### Accent palette
- amber neon
- red signage
- police blue
- emergency white
- sodium-orange streetlight spill

#### Faction color signals
- **Player:** dark red / black / muted gold accents
- **Police:** navy / cold blue / tactical gray
- **Gang:** black / red / dirty orange / chain-metal silver
- **Civilians:** desaturated greens / browns / office blue / washed neutrals
- **Workers / utility NPCs:** yellow / orange safety accents

### 4. Controlled Contrast
The world should stay dark, but the gameplay elements must pop.

Use contrast to highlight:

- objective markers
- muzzle flashes
- police lights
- neon signage
- mission spaces
- faction separation

### 5. Cinematic Streets, Simple Geometry
World modeling should stay efficient:

- blocky architecture
- readable storefronts
- bold signage
- broad shadow shapes
- reflective ground planes
- simple but deliberate set dressing

Do not chase dense realism.
Use composition, fog, lighting, and reflections to create richness.

## Environment Rules

### Streets
- narrow, layered alleys
- fire escapes, cables, signs, poles, chain fences
- puddles and reflective asphalt in key combat spaces
- visible depth with bridges or overhead structures

### Light Sources
- motel signs
- bar signs
- police sirens
- street lamps
- shop interiors
- occasional warning lights

### Weather
Recommended baseline mood:
- damp or rainy night
- light fog or urban haze
- reflective ground

This reinforces noir tone and lets low-poly geometry look richer.

## Camera / Framing Implications
The art style works best when the camera supports silhouette readability.

Prioritize:
- clear player outline against the background
- enemies framed by light spill or street reflections
- objective spaces with visual focus
- limited clutter near combat-critical silhouettes

## UI / HUD Fit
HUD should visually match the world:

- angular, compact panels
- bold typography
- strong amber/red accents for mission info
- police blue / red for threat state
- minimal ornament, more hard-edged tactical noir

Avoid soft fantasy UI or overly modern sci-fi UI.

## Production Guidance for Godot

### Best fit rendering approach
- low-poly characters
- hand-authored flat materials with light gradients
- strong normal-based lighting shapes
- baked or fake wet reflections where possible
- post effects used lightly: bloom, fog, contrast shaping

### Avoid
- realism-heavy textures
- noisy materials
- tiny costume details that vanish in play
- too many saturated colors at once
- fully symmetrical generic character designs

## Success Test
A screenshot is successful if:

1. the player is instantly identifiable
2. police and gangs are instantly distinguishable
3. the space feels dangerous and urban
4. the scene works even with simplified geometry
5. the image could plausibly be used as key art for the game
