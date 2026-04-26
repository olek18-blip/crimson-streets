extends Node

@export var missions_path := "res://godot_v2/data/missions.json"

var missions = []
var current_mission = null
var current_step_index := 0

var player

func _ready():
	player = get_tree().get_first_node_in_group("player")
	_load_missions()
	_start_first_mission()

func _process(delta):
	_update_current_step()

func _load_missions():
	if not FileAccess.file_exists(missions_path): return
	var data = JSON.parse_string(FileAccess.get_file_as_string(missions_path))
	missions = data.get("missions", [])

func _start_first_mission():
	if missions.size() == 0: return
	current_mission = missions[0]
	current_step_index = 0
	print("[MISSION] Started:", current_mission.title)

func _update_current_step():
	if not current_mission or not player: return

	var step = current_mission.steps[current_step_index]
	var target = Vector3(step.target[0], step.target[1], step.target[2])

	if player.global_position.distance_to(target) < step.radius:
		current_step_index += 1
		if current_step_index >= current_mission.steps.size():
			_complete_mission()
		else:
			print("[MISSION] Next step")

func _complete_mission():
	print("[MISSION] Completed!")
	current_mission = null
