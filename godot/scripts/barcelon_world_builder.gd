extends Node3D

@export var json_path := "res://data/world/barcelon_layout.json"

func _ready():
	_build_city()

func _build_city():
	var file = FileAccess.open(json_path, FileAccess.READ)
	if file == null:
		push_error("World JSON not found")
		return
	var data = JSON.parse_string(file.get_as_text())
	
	# ROADS
	for r in data["roads"]:
		_create_block(r["pos"], r["size"], Color(0.08,0.08,0.1))

	# SIDEWALKS
	for s in data["sidewalks"]:
		_create_block(s["pos"], s["size"], Color(0.4,0.4,0.4))

	# BUILDINGS
	for b in data["buildings"]:
		_create_block(b["pos"], b["size"], Color(0.1,0.2,0.35))

	# TREES (simple)
	for t in data["trees"]:
		_create_tree(t["pos"])

	# MISSIONS (visual markers)
	for m in data["mission_markers"]:
		_create_marker(m["pos"])

func _create_block(pos, size, color):
	var body = StaticBody3D.new()
	add_child(body)
	body.global_position = Vector3(pos[0], pos[1], pos[2])

	var shape = CollisionShape3D.new()
	var box = BoxShape3D.new()
	box.size = Vector3(size[0], size[1], size[2])
	shape.shape = box
	body.add_child(shape)

	var mesh = MeshInstance3D.new()
	var cube = BoxMesh.new()
	cube.size = Vector3(size[0], size[1], size[2])
	mesh.mesh = cube
	mesh.material_override = StandardMaterial3D.new()
	mesh.material_override.albedo_color = color
	body.add_child(mesh)

func _create_tree(pos):
	var trunk = StaticBody3D.new()
	add_child(trunk)
	trunk.global_position = Vector3(pos[0], 1, pos[2])

	var mesh = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.height = 2
	cyl.radius = 0.2
	mesh.mesh = cyl
	mesh.material_override = StandardMaterial3D.new()
	mesh.material_override.albedo_color = Color(0.3,0.2,0.1)
	trunk.add_child(mesh)

func _create_marker(pos):
	var m = MeshInstance3D.new()
	add_child(m)
	m.global_position = Vector3(pos[0], pos[1], pos[2])
	var sphere = SphereMesh.new()
	sphere.radius = 0.6
	m.mesh = sphere
	m.material_override = StandardMaterial3D.new()
	m.material_override.emission_enabled = true
	m.material_override.emission = Color(1,0.2,0.2)
