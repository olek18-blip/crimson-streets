extends Node3D

@export var json_path: String = "res://data/barcelon_layout.json"
@export var vehicle_scene: PackedScene
@export var spawn_radius: float = 120.0
@export var max_vehicles: int = 10

var _pool: Array[Node3D] = []
var _active: Array[Node3D] = []
var _lanes: Array = []
var _player: Node3D = null

func _ready():
	_player = get_tree().get_first_node_in_group("player") as Node3D
	_load_lanes()
	_prewarm_pool(6)

func _process(_delta):
	_update()

func _load_lanes():
	if not FileAccess.file_exists(json_path): return
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(json_path))
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("[TrafficSystem] Invalid traffic JSON")
		return
	var data: Dictionary = parsed
	_lanes = data.get("traffic_lanes", [])

func _prewarm_pool(count):
	if vehicle_scene == null:
		push_error("[TrafficSystem] vehicle_scene is not assigned")
		return

	for i in range(count):
		var v := vehicle_scene.instantiate() as Node3D
		if v == null:
			push_error("[TrafficSystem] vehicle_scene root must be Node3D")
			return
		add_child(v)
		v.visible = false
		_pool.append(v)

func _get_vehicle_from_pool() -> Node3D:
	if _pool.size() > 0:
		return _pool.pop_back()
	return vehicle_scene.instantiate() as Node3D

func _return_vehicle_to_pool(v: Node3D) -> void:
	if v.has_method("reset"):
		v.call("reset")
	_pool.append(v)
	_active.erase(v)

func _update() -> void:
	if not _player or vehicle_scene == null: return
	var player_pos: Vector3 = _player.global_position

	for item in _active.duplicate():
		var v := item as Node3D
		if v == null:
			continue
		if v.global_position.distance_to(player_pos) > spawn_radius:
			_return_vehicle_to_pool(v)

	var active_lane_ids: Dictionary = {}
	for v in _active:
		var active_lane_id: String = str(v.get("lane_id"))
		if active_lane_id != "":
			active_lane_ids[active_lane_id] = true

	for lane_data in _lanes:
		if _active.size() >= max_vehicles: break
		if typeof(lane_data) != TYPE_DICTIONARY: continue
		var lane: Dictionary = lane_data
		var lane_id := str(lane.get("id", ""))
		if active_lane_ids.has(lane_id): continue
		var lane_points: Array = lane.get("points", [])
		if lane_points.size() < 2: continue
		var origin := Vector3(lane_points[0][0], lane_points[0][1], lane_points[0][2])
		if origin.distance_to(player_pos) > spawn_radius: continue

		var v: Node3D = _get_vehicle_from_pool()
		if v == null:
			continue
		if v.get_parent() == null:
			add_child(v)
		var pts: Array[Vector3] = []
		for p in lane_points:
			pts.append(Vector3(p[0], p[1], p[2]))

		if v.has_method("setup"):
			v.call("setup", pts, float(lane.get("speed", 7.0)), lane_id)
		v.visible = true
		_active.append(v)
		active_lane_ids[lane_id] = true
