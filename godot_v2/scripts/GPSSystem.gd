extends Node

var player
var mission_system

var current_target: Vector3

func _ready():
	player = get_tree().get_first_node_in_group("player")
	mission_system = get_node_or_null("../MissionSystem")

func _process(delta):
	if not mission_system or not mission_system.current_mission:
		return

	var step = mission_system.current_mission.steps[mission_system.current_step_index]
	current_target = Vector3(step.target[0], step.target[1], step.target[2])

func get_direction() -> Vector3:
	if not player:
		return Vector3.ZERO
	return (current_target - player.global_position).normalized()
