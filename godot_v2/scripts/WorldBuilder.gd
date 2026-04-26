extends Node3D

@export var layout_path := "res://data/barcelon_layout.json"

func _ready():
	_load_world()

func _load_world():
	if not FileAccess.file_exists(layout_path):
		print("No layout found")
		return

	var file = FileAccess.open(layout_path, FileAccess.READ)
	var data = JSON.parse_string(file.get_as_text())

	for road in data.get("roads", []):
		_create_road(road)

func _create_road(road):
	var mesh = MeshInstance3D.new()
	mesh.mesh = BoxMesh.new()
	mesh.scale = Vector3(road.length, 0.1, road.width)
	mesh.position = Vector3(road.x, 0, road.z)
	add_child(mesh)
