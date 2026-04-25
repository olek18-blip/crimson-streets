extends CharacterBody3D

const LOD_FULL := 0
const LOD_REDUCED := 1
const LOD_DORMANT := 2

@export var full_distance := 40.0
@export var reduced_distance := 85.0
@export var walk_speed := 1.6

var player: Node3D
var current_lod := LOD_FULL
var home_position := Vector3.ZERO
var wander_phase := 0.0

@onready var animation_player: AnimationPlayer = get_node_or_null("AnimationPlayer")

func _ready() -> void:
    player = get_tree().get_first_node_in_group("player")
    home_position = global_position

func _physics_process(delta: float) -> void:
    if not player:
        player = get_tree().get_first_node_in_group("player")
        return

    update_lod(player.global_position)

    if current_lod == LOD_DORMANT:
        return

    if current_lod == LOD_FULL:
        _wander(delta)

func update_lod(player_pos: Vector3) -> void:
    var distance := global_position.distance_to(player_pos)

    if distance < full_distance:
        _set_lod(LOD_FULL)
    elif distance < reduced_distance:
        _set_lod(LOD_REDUCED)
    else:
        _set_lod(LOD_DORMANT)

func _set_lod(next_lod: int) -> void:
    if next_lod == current_lod:
        return

    current_lod = next_lod

    match current_lod:
        LOD_FULL:
            set_physics_process(true)
            visible = true
            if animation_player and animation_player.has_animation("idle"):
                animation_player.play("idle")
        LOD_REDUCED:
            set_physics_process(true)
            visible = true
            if animation_player:
                animation_player.stop()
        LOD_DORMANT:
            visible = false
            set_physics_process(false)

func _wander(delta: float) -> void:
    wander_phase += delta
    var target := home_position + Vector3(sin(wander_phase * 0.7) * 3.0, 0, cos(wander_phase * 0.5) * 3.0)
    var flat_target := Vector3(target.x, global_position.y, target.z)
    var direction := global_position.direction_to(flat_target)

    if global_position.distance_to(flat_target) > 0.3:
        velocity.x = direction.x * walk_speed
        velocity.z = direction.z * walk_speed
        rotation.y = atan2(-direction.x, -direction.z)
    else:
        velocity.x = move_toward(velocity.x, 0, walk_speed)
        velocity.z = move_toward(velocity.z, 0, walk_speed)

    move_and_slide()
