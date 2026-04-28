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
		var road_name: String = "Road_" + str(road.get("name", "Unnamed"))
		var road_pos: Array = road.get("pos", [0, 0, 0])
		var road_size: Array = road.get("size", [1, 1, 1])
		_create_solid_box(road_name, road_pos, road_size, Color(0.045, 0.047, 0.052))
		_create_road_details(road_name, road_pos, road_size)

	for walk_data in data.get("sidewalks", []):
		if typeof(walk_data) != TYPE_DICTIONARY: continue
		var walk: Dictionary = walk_data
		_create_solid_box("Sidewalk", walk.get("pos", [0, 0, 0]), walk.get("size", [1, 1, 1]), Color(0.34, 0.34, 0.36))

	for building_data in data.get("buildings", []):
		if typeof(building_data) != TYPE_DICTIONARY: continue
		var building: Dictionary = building_data
		_create_building("Building_" + building.get("name", "Unnamed"), building.get("pos", [0, 0, 0]), building.get("size", [1, 1, 1]))

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

func _create_visual_box(node_name: String, position: Vector3, size: Vector3, color: Color) -> MeshInstance3D:
	var mesh := MeshInstance3D.new()
	mesh.name = node_name
	mesh.position = position
	var box_mesh := BoxMesh.new()
	box_mesh.size = size
	mesh.mesh = box_mesh
	mesh.material_override = _get_material(node_name + "_mat", color)
	add_child(mesh)
	return mesh

func _create_road_details(road_name: String, pos: Array, size: Array) -> void:
	var center := Vector3(float(pos[0]), float(pos[1]), float(pos[2]))
	var road_size := Vector3(float(size[0]), float(size[1]), float(size[2]))
	var y := center.y + road_size.y * 0.5 + 0.025
	var is_north_south := road_size.z >= road_size.x
	var length := road_size.z if is_north_south else road_size.x
	var lanes := int(max(2.0, floor(length / 8.0)))
	var stripe_color := Color(0.95, 0.78, 0.22)
	var edge_color := Color(0.8, 0.82, 0.78)

	for i in range(lanes):
		var t := -length * 0.5 + 4.0 + float(i) * 8.0
		if is_north_south:
			_create_visual_box(road_name + "_CenterStripe_%d" % i, Vector3(center.x, y, center.z + t), Vector3(0.18, 0.025, 3.2), stripe_color)
		else:
			_create_visual_box(road_name + "_CenterStripe_%d" % i, Vector3(center.x + t, y, center.z), Vector3(3.2, 0.025, 0.18), stripe_color)

	if is_north_south:
		_create_visual_box(road_name + "_LeftEdge", Vector3(center.x - road_size.x * 0.42, y, center.z), Vector3(0.12, 0.025, road_size.z * 0.94), edge_color)
		_create_visual_box(road_name + "_RightEdge", Vector3(center.x + road_size.x * 0.42, y, center.z), Vector3(0.12, 0.025, road_size.z * 0.94), edge_color)
		_create_crosswalk(road_name + "_CrosswalkA", Vector3(center.x, y + 0.01, center.z - road_size.z * 0.32), road_size.x, true)
		_create_crosswalk(road_name + "_CrosswalkB", Vector3(center.x, y + 0.01, center.z + road_size.z * 0.32), road_size.x, true)
	else:
		_create_visual_box(road_name + "_TopEdge", Vector3(center.x, y, center.z - road_size.z * 0.42), Vector3(road_size.x * 0.94, 0.025, 0.12), edge_color)
		_create_visual_box(road_name + "_BottomEdge", Vector3(center.x, y, center.z + road_size.z * 0.42), Vector3(road_size.x * 0.94, 0.025, 0.12), edge_color)
		_create_crosswalk(road_name + "_CrosswalkA", Vector3(center.x - road_size.x * 0.32, y + 0.01, center.z), road_size.z, false)
		_create_crosswalk(road_name + "_CrosswalkB", Vector3(center.x + road_size.x * 0.32, y + 0.01, center.z), road_size.z, false)

func _create_crosswalk(node_name: String, center: Vector3, road_width: float, road_runs_north_south: bool) -> void:
	for i in range(5):
		var offset := -2.0 + float(i)
		if road_runs_north_south:
			_create_visual_box(node_name + "_Stripe_%d" % i, center + Vector3(0, 0, offset * 0.7), Vector3(road_width * 0.72, 0.025, 0.32), Color(0.9, 0.9, 0.84))
		else:
			_create_visual_box(node_name + "_Stripe_%d" % i, center + Vector3(offset * 0.7, 0, 0), Vector3(0.32, 0.025, road_width * 0.72), Color(0.9, 0.9, 0.84))

func _create_building(node_name: String, pos: Array, size: Array) -> void:
	var palette := [
		Color(0.12, 0.18, 0.28),
		Color(0.18, 0.17, 0.15),
		Color(0.24, 0.19, 0.16),
		Color(0.13, 0.16, 0.18)
	]
	var color: Color = palette[abs(hash(node_name)) % palette.size()]
	_create_solid_box(node_name, pos, size, color)

	var center := Vector3(float(pos[0]), float(pos[1]), float(pos[2]))
	var building_size := Vector3(float(size[0]), float(size[1]), float(size[2]))
	_create_rooftop_detail(node_name, center, building_size)
	_create_facade_windows(node_name + "_Front", center, building_size, Vector3.FORWARD)
	_create_facade_windows(node_name + "_Back", center, building_size, Vector3.BACK)
	_create_facade_windows(node_name + "_Left", center, building_size, Vector3.LEFT)
	_create_facade_windows(node_name + "_Right", center, building_size, Vector3.RIGHT)
	_create_door(node_name, center, building_size)

func _create_rooftop_detail(node_name: String, center: Vector3, size: Vector3) -> void:
	var roof_y := center.y + size.y * 0.5 + 0.35
	_create_visual_box(node_name + "_Roof", Vector3(center.x, roof_y, center.z), Vector3(size.x * 0.72, 0.55, size.z * 0.18), Color(0.08, 0.09, 0.1))

func _create_facade_windows(node_name: String, center: Vector3, size: Vector3, facing: Vector3) -> void:
	var along_x := absf(facing.z) > 0.0
	var columns := int(max(2.0, floor((size.x if along_x else size.z) / 3.5)))
	var rows := int(max(2.0, floor(size.y / 3.0)))
	var face_offset := Vector3(0, 0, facing.z * (size.z * 0.5 + 0.035)) if along_x else Vector3(facing.x * (size.x * 0.5 + 0.035), 0, 0)
	var window_size := Vector3(0.95, 0.55, 0.05) if along_x else Vector3(0.05, 0.55, 0.95)
	var lit := Color(1.0, 0.78, 0.36)
	var dark := Color(0.08, 0.13, 0.18)

	for row in range(rows):
		for col in range(columns):
			var lateral := -float(columns - 1) * 1.35 + float(col) * 2.7
			var height := center.y - size.y * 0.38 + float(row) * 2.5
			var world_pos := center + face_offset
			if along_x:
				world_pos.x += lateral
			else:
				world_pos.z += lateral
			world_pos.y = height
			var color := lit if (row + col + abs(hash(node_name))) % 3 == 0 else dark
			_create_visual_box(node_name + "_Window_%d_%d" % [row, col], world_pos, window_size, color)

func _create_door(node_name: String, center: Vector3, size: Vector3) -> void:
	var door_pos := Vector3(center.x, 1.05, center.z + size.z * 0.5 + 0.04)
	_create_visual_box(node_name + "_Door", door_pos, Vector3(1.7, 2.1, 0.08), Color(0.04, 0.045, 0.055))

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

	var highlight := MeshInstance3D.new()
	var highlight_mesh := SphereMesh.new()
	highlight_mesh.radius = 0.72
	highlight.mesh = highlight_mesh
	highlight.position = Vector3(-0.28, 1.68, -0.18)
	highlight.material_override = _get_material("tree_highlight", Color(0.12, 0.42, 0.16))
	root.add_child(highlight)

func _create_marker(pos: Array) -> void:
	var root := Node3D.new()
	root.name = "MissionMarker"
	add_child(root)
	root.global_position = Vector3(float(pos[0]), float(pos[1]), float(pos[2]))

	var beam := MeshInstance3D.new()
	var beam_mesh := CylinderMesh.new()
	beam_mesh.height = 6.5
	beam_mesh.top_radius = 0.35
	beam_mesh.bottom_radius = 0.9
	beam.mesh = beam_mesh
	beam.position = Vector3(0, 3.25, 0)
	beam.material_override = _get_emissive_material("marker_beam", Color(1.0, 0.12, 0.08), 1.35)
	root.add_child(beam)

	var sphere_node := MeshInstance3D.new()
	var sphere := SphereMesh.new()
	sphere.radius = 0.65
	sphere_node.mesh = sphere
	sphere_node.position = Vector3(0, 1.15, 0)
	sphere_node.material_override = _get_emissive_material("marker_core", Color(1.0, 0.22, 0.12), 2.0)
	root.add_child(sphere_node)

	var base := MeshInstance3D.new()
	var base_mesh := CylinderMesh.new()
	base_mesh.height = 0.15
	base_mesh.top_radius = 1.35
	base_mesh.bottom_radius = 1.35
	base.mesh = base_mesh
	base.position = Vector3(0, 0.08, 0)
	base.material_override = _get_material("marker_base", Color(0.38, 0.05, 0.04))
	root.add_child(base)

func _get_material(key: String, color: Color) -> StandardMaterial3D:
	if _materials.has(key):
		return _materials[key] as StandardMaterial3D
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.8
	_materials[key] = mat
	return mat

func _get_emissive_material(key: String, color: Color, energy: float) -> StandardMaterial3D:
	if _materials.has(key):
		return _materials[key] as StandardMaterial3D
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color
	mat.emission_energy_multiplier = energy
	mat.roughness = 0.45
	_materials[key] = mat
	return mat
