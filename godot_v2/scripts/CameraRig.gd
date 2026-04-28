extends Node3D

@export var target_path: NodePath
@export var follow_distance: float = 6.5
@export var height: float = 2.6
@export var smooth: float = 6.0

var target: Node3D = null

func _ready():
	target = get_node_or_null(target_path) as Node3D

func _process(delta):
	if not target:
		return

	var follow_target: Node3D = target
	if target.has_method("get_camera_target"):
		var next_target := target.call("get_camera_target") as Node3D
		if next_target:
			follow_target = next_target

	var desired: Vector3 = follow_target.global_position
	desired += -follow_target.global_transform.basis.z * follow_distance
	desired.y += height

	global_position = global_position.lerp(desired, smooth * delta)
	look_at(follow_target.global_position + Vector3(0, 1.2, 0), Vector3.UP)
