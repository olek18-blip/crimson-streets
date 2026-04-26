extends Node3D

@export var player_path: NodePath
@export var follow_speed := 6.0
@export var look_height := 1.3
@export var on_foot_distance := 6.0
@export var on_foot_height := 3.0
@export var car_distance := 9.0
@export var car_height := 4.2

@onready var camera: Camera3D = $Camera3D
var player: Node3D

func _ready() -> void:
    player = get_node_or_null(player_path)
    if not player:
        player = get_tree().get_first_node_in_group("player")
    camera.current = true

func _process(delta: float) -> void:
    if not player:
        return

    var target := _get_follow_target()
    if not target:
        return

    var distance := car_distance if _is_player_in_car() else on_foot_distance
    var height := car_height if _is_player_in_car() else on_foot_height
    var backward := target.global_transform.basis.z.normalized()
    var desired := target.global_position + backward * distance + Vector3.UP * height

    global_position = global_position.lerp(desired, follow_speed * delta)
    look_at(target.global_position + Vector3.UP * look_height, Vector3.UP)

func _get_follow_target() -> Node3D:
    if player and player.has_method("get_camera_target"):
        return player.get_camera_target()
    return player

func _is_player_in_car() -> bool:
    if player and player.has_method("is_in_car"):
        return player.is_in_car()
    return false
