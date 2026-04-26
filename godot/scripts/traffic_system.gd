extends Node3D

@export var json_path := "res://data/world/barcelon_layout.json"
@export var vehicle_scene := preload("res://scenes/Car.tscn")

var vehicles := []

func _ready():
	_spawn_traffic()

func _spawn_traffic():
	var file = FileAccess.open(json_path, FileAccess.READ)
	if file == null:
		return

	var data = JSON.parse_string(file.get_as_text())

	for lane in data["traffic_lanes"]:
		var v = preload("res://scripts/traffic_vehicle.gd").new()
		add_child(v)

		var pts = []
		for p in lane["points"]:
			pts.append(Vector3(p[0], p[1], p[2]))

		v.setup(pts, lane["speed"])
