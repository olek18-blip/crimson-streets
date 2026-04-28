extends Node3D

@export var layout_path: String = "res://data/barcelon_layout.json"

var _materials: Dictionary = {}

func _ready():
	_build_world()

func _build_world():
	if not FileAccess.file_exists(layout_path):
		push_error("[WorldBuilder] Layout not found: " + layout_path)
		return

	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(layout_path))
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("[WorldBuilder] Invalid layout JSON")
		return
	var data: Dictionary = parsed

	_create_ground(data.get("world_size", [180, 180]))

	for road_data in data.get("roads", []):
		if typeof(road_data) != TYPE_DICTIONARY: continue
		var road: Dictionary = road_data
		_create_solid_box("Road_" + road.get("name", "Unnamed"), road.get("pos", [0, 0, 0]), road.get("size", [1, 1, 1]), Color(0.055, 0.06, 0.07))

	for walk_data in data.get("sidewalks", []):
		if typeof(walk_data) != TYPE_DICTIONARY: continue
		var walk: Dictionary = walk_data
		_create_solid_box("Sidewalk", walk.get("pos", [0, 0, 0]), walk.get("size", [1, 1, 1]), Color(0.34, 0.34, 0.36))

	for building_data in data.get("buildings", []):
		if typeof(building_data) != TYPE_DICTIONARY: continue
		var building: Dictionary = building_data
		_create_solid_box("Building_" + building.get("name", "Unnamed"), building.get("pos", [0, 0, 0]), building.get("size", [1, 1, 1]), Color(0.12, 0.18, 0.28))

	for tree_data in data.get("trees", []):
		if typeof(tree_data) != TYPE_DICTIONARY: continue
		var tree: Dictionary = tree_data
		_create_tree(tree.get("pos", [0, 0, 0]))

	for marker_data in data.get("mission_markers", []):
		if typeof(marker_data) != TYPE_DICTIONARY: continue
		var marker: Dictionary = marker_data
		_create_marker(marker.get("pos", [0, 0, 0]))

func _create_ground(world_size: Array) -> void:
	var body := StaticBody3D.new()
	body.name = "Ground"
	add_child(body)
	body.global_position = Vector3(0, -0.55, 0)

	var size_x: float = float(world_size[0])
	var size_z: float = float(world_size[1])

	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(size_x, 1.0, size_z)
	shape.shape = box
	body.add_child(shape)

	var mesh := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(size_x, size_z)
	mesh.mesh = plane
	mesh.material_override = _get_material("ground", Color(0.08, 0.11, 0.09))
	body.add_child(mesh)

func _create_solid_box(node_name: String, pos: Array, size: Array, color: Color) -> void:
	var body := StaticBody3D.new()
	body.name = node_name
	add_child(body)
	body.global_position = Vector3(float(pos[0]), float(pos[1]), float(pos[2]))

	var mesh := MeshInstance3D.new()
	var box_mesh := BoxMesh.new()
	box_mesh.size = Vector3(float(size[0]), float(size[1]), float(size[2]))
	mesh.mesh = box_mesh
	mesh.material_override = _get_material(node_name + "_mat", color)
	body.add_child(mesh)

	var shape := CollisionShape3D.new()
	var box_shape := BoxShape3D.new()
	box_shape.size = Vector3(float(size[0]), float(size[1]), float(size[2]))
	shape.shape = box_shape
	body.add_child(shape)

func _create_tree(pos: Array) -> void:
	var root := StaticBody3D.new()
	root.name = "Tree"
	add_child(root)
	root.global_position = Vector3(float(pos[0]), 0.9, float(pos[2]))

	var trunk_shape := CollisionShape3D.new()
	var cylinder := CylinderShape3D.new()
	cylinder.radius = 0.35
	cylinder.height = 1.8
	trunk_shape.shape = cylinder
	root.add_child(trunk_shape)

	var trunk := MeshInstance3D.new()
	var trunk_mesh := CylinderMesh.new()
	trunk_mesh.height = 1.8
	trunk_mesh.top_radius = 0.22
	trunk_mesh.bottom_radius = 0.32
	trunk.mesh = trunk_mesh
	trunk.material_override = _get_material("tree_trunk", Color(0.28, 0.17, 0.08))
	root.add_child(trunk)

	var crown := MeshInstance3D.new()
	var sphere := SphereMesh.new()
	sphere.radius = 1.1
	crown.mesh = sphere
	crown.position = Vector3(0, 1.45, 0)
	crown.material_override = _get_material("tree_crown", Color(0.08, 0.28, 0.12))
	root.add_child(crown)

func _create_marker(pos: Array) -> void:
	var marker := MeshInstance3D.new()
	marker.name = "MissionMarker"
	add_child(marker)
	marker.global_position = Vector3(float(pos[0]), float(pos[1]) + 1.1, float(pos[2]))
	var sphere := SphereMesh.new()
	sphere.radius = 0.65
	marker.mesh = sphere
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.2, 0.15)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.08, 0.05)
	marker.material_override = mat

func _get_material(key: String, color: Color) -> StandardMaterial3D:
	if _materials.has(key):
		return _materials[key] as StandardMaterial3D
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.8
	_materials[key] = mat
	return mat
