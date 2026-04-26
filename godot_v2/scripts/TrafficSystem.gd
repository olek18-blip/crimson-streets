extends Node3D

signal active_vehicle_count_changed(count: int)

@export var json_path := "res://godot_v2/data/barcelon_layout.json"
@export var vehicle_scene: PackedScene
@export var spawn_radius := 120.0
@export var max_vehicles := 12

var _pool: Array[Node3D] = []
var _active: Array[Node3D] = []
var _lanes: Array = []
var _player: Node3D
var _timer := 0.0

func _ready():
	_player = get_tree().get_first_node_in_group("player")
	_load_lanes()
	_prewarm_pool(6)

func _process(delta):
	_timer -= delta
	if _timer <= 0:
		_timer = 3.5
		_update()

func _load_lanes():
	if not FileAccess.file_exists(json_path): return
	var data = JSON.parse_string(FileAccess.get_file_as_string(json_path))
	_lanes = data.get("traffic_lanes", [])

func _prewarm_pool(count):
	for i in count:
		var v = vehicle_scene.instantiate()
		add_child(v)
		v.visible = false
		_pool.append(v)

func _get():
	return _pool.pop_back() if _pool.size() > 0 else vehicle_scene.instantiate()

func _return(v):
	v.visible = false
	if v.has_method("reset"): v.reset()
	_pool.append(v)
	_active.erase(v)

func _update():
	if not _player: return
	var pos = _player.global_position

	for v in _active.duplicate():
		if v.global_position.distance_to(pos) > spawn_radius:
			_return(v)

	for lane in _lanes:
		if _active.size() >= max_vehicles: break
		var origin = Vector3(lane.points[0][0], lane.points[0][1], lane.points[0][2])
		if origin.distance_to(pos) > spawn_radius: continue

		var v = _get()
		var pts = []
		for p in lane.points: pts.append(Vector3(p[0], p[1], p[2]))
		v.visible = true
		v.setup(pts, lane.speed, lane.id)
		add_child(v)
		_active.append(v)
