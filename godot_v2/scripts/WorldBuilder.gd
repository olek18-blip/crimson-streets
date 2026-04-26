extends Node3D

@export var layout_path := "res://data/barcelon_layout.json"

var _materials := {}

func _ready():
	_build_world()

func _build_world():
	if not FileAccess.file_exists(layout_path):
		push_error("[WorldBuilder] Layout not found: " + layout_path)
		return

	var data = JSON.parse_string(FileAccess.get_file_as_string(layout_path))
	if typeof(data) != TYPE_DICTIONARY:
		push_error("[WorldBuilder] Invalid layout JSON")
		return

	_create_ground(data.get("world_size", [180, 180]))

	for road in data.get("roads", []):
		_create_solid_box("Road_" + road.get("name", "Unnamed"), road.pos, road.size, Color(0.055, 0.06, 0.07), false)

	for walk in data.get("sidewalks", []):
		_create_solid_box("Sidewalk", walk.pos, walk.size, Color(0.34, 0.34, 0.36), false)

	for building in data.get("buildings", []):
		_create_solid_box("Building_" + building.get("name", "Unnamed"), building.pos, building.size, Color(0.12, 0.18, 0.28), true)

	for tree in data.get("trees", []):
		_create_tree(tree.pos)

	for marker in data.get("mission_markers", []):
		_create_marker(marker.pos)

func _create_ground(world_size):
	var body := StaticBody3D.new()
	body.name = "Ground"
	add_child(body)
	body.global_position = Vector3(0, -0.55, 0)

	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(world_size[0], 1.0, world_size[1])
	shape.shape = box
	body.add_child(shape)

	var mesh := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(world_size[0], world_size[1])
	mesh.mesh = plane
	mesh.material_override = _get_material("ground", Color(0.08, 0.11, 0.09))
	body.add_child(mesh)

func _create_solid_box(node_name: String, pos, size, color: Color, casts_collision: bool):
	var body := StaticBody3D.new()
	body.name = node_name
	add_child(body)
	body.global_position = Vector3(pos[0], pos[1], pos[2])

	var mesh := MeshInstance3D.new()
	var box_mesh := BoxMesh.new()
	box_mesh.size = Vector3(size[0], size[1], size[2])
	mesh.mesh = box_mesh
	mesh.material_override = _get_material(node_name + "_mat", color)
	body.add_child(mesh)

	var shape := CollisionShape3D.new()
	var box_shape := BoxShape3D.new()
	box_shape.size = Vector3(size[0], size[1], size[2])
	shape.shape = box_shape
	body.add_child(shape)

func _create_tree(pos):
	var root := StaticBody3D.new()
	root.name = "Tree"
	add_child(root)
	root.global_position = Vector3(pos[0], 0.9, pos[2])

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

func _create_marker(pos):
	var marker := MeshInstance3D.new()
	marker.name = "MissionMarker"
	add_child(marker)
	marker.global_position = Vector3(pos[0], pos[1] + 1.1, pos[2])
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
		return _materials[key]
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.8
	_materials[key] = mat
	return mat
