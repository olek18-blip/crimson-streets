extends Node

var player: Node3D = null
var mission_system: Node = null

var current_target: Vector3 = Vector3.ZERO

func _ready():
	player = get_tree().get_first_node_in_group("player") as Node3D
	mission_system = get_node_or_null("../MissionSystem")

func _process(delta):
	if not mission_system:
		return

	var mission_data: Dictionary = mission_system.get("current_mission")
	if mission_data.is_empty():
		return

	var step_index: int = int(mission_system.get("current_step_index"))
	var steps: Array = mission_data.get("steps", [])
	if step_index >= steps.size():
		return

	var step: Dictionary = steps[step_index]
	var target_data: Array = step.get("target", [0, 0, 0])
	current_target = Vector3(target_data[0], target_data[1], target_data[2])

func get_direction() -> Vector3:
	if not player:
		return Vector3.ZERO
	return (current_target - player.global_position).normalized()
