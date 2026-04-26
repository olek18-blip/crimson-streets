extends Node3D

@export var target_path: NodePath
@export var follow_distance := 6.5
@export var height := 2.6
@export var smooth := 6.0

var target: Node3D

func _ready():
	target = get_node_or_null(target_path)

func _process(delta):
	if not target:
		return

	var desired := target.global_position
	desired += -target.global_transform.basis.z * follow_distance
	desired.y += height

	global_position = global_position.lerp(desired, smooth * delta)
	look_at(target.global_position + Vector3(0,1.2,0), Vector3.UP)
