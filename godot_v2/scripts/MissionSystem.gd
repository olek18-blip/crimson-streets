extends Node

@export var missions_path: String = "res://data/missions.json"

var missions: Array = []
var current_mission: Dictionary = {}
var current_step_index: int = 0

var player: Node3D = null

func _ready():
	player = get_tree().get_first_node_in_group("player") as Node3D
	_load_missions()
	_start_first_mission()

func _process(_delta):
	_update_current_step()

func get_current_step() -> Dictionary:
	if current_mission.is_empty():
		return {}
	var steps: Array = current_mission.get("steps", [])
	if current_step_index < 0 or current_step_index >= steps.size():
		return {}
	if typeof(steps[current_step_index]) != TYPE_DICTIONARY:
		return {}
	return steps[current_step_index]

func get_current_mission_title() -> String:
	if current_mission.is_empty():
		return ""
	return str(current_mission.get("title", "Mission"))

func get_current_step_text() -> String:
	var step: Dictionary = get_current_step()
	if step.is_empty():
		return ""
	return str(step.get("text", "Reach the objective."))

func get_current_target() -> Vector3:
	var step: Dictionary = get_current_step()
	if step.is_empty():
		return Vector3.ZERO
	var target_data: Array = step.get("target", [0, 0, 0])
	return Vector3(float(target_data[0]), float(target_data[1]), float(target_data[2]))

func get_current_step_number() -> int:
	if current_mission.is_empty():
		return 0
	return current_step_index + 1

func get_step_count() -> int:
	if current_mission.is_empty():
		return 0
	var steps: Array = current_mission.get("steps", [])
	return steps.size()

func get_reward() -> int:
	if current_mission.is_empty():
		return 0
	return int(current_mission.get("reward", 0))

func _load_missions():
	if not FileAccess.file_exists(missions_path): return
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(missions_path))
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("[MissionSystem] Invalid missions JSON")
		return
	var data: Dictionary = parsed
	missions = data.get("missions", [])

func _start_first_mission():
	if missions.size() == 0: return
	if typeof(missions[0]) != TYPE_DICTIONARY: return
	current_mission = missions[0]
	current_step_index = 0
	print("[MISSION] Started:", current_mission.get("title", "Mission"))

func _update_current_step():
	if current_mission.is_empty() or not player: return

	var steps: Array = current_mission.get("steps", [])
	if current_step_index >= steps.size():
		_complete_mission()
		return

	var step: Dictionary = steps[current_step_index]
	var target_data: Array = step.get("target", [0, 0, 0])
	var target = Vector3(target_data[0], target_data[1], target_data[2])

	if player.global_position.distance_to(target) < float(step.get("radius", 3.0)):
		current_step_index += 1
		if current_step_index >= steps.size():
			_complete_mission()
		else:
			print("[MISSION] Next step")

func _complete_mission():
	print("[MISSION] Completed!")
	current_mission = {}
