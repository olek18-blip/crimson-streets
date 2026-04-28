extends CanvasLayer

@export var mission_system_path: NodePath = NodePath("../MissionSystem")

var _mission_system: Node = null
var _player: Node3D = null

var _title_label: Label
var _objective_label: Label
var _distance_label: Label
var _status_label: Label
var _health_bar: ProgressBar
var _health_label: Label
var _minimap: ColorRect
var _player_dot: ColorRect
var _target_dot: ColorRect
var _north_label: Label

func _ready() -> void:
	_mission_system = get_node_or_null(mission_system_path)
	_player = get_tree().get_first_node_in_group("player") as Node3D
	_build_ui()

func _process(_delta: float) -> void:
	_update_hud()

func _build_ui() -> void:
	var root := Control.new()
	root.name = "HUDRoot"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(root)

	var panel := ColorRect.new()
	panel.name = "MissionPanel"
	panel.color = Color(0.02, 0.025, 0.03, 0.78)
	panel.anchor_left = 0.0
	panel.anchor_top = 0.0
	panel.anchor_right = 0.0
	panel.anchor_bottom = 0.0
	panel.offset_left = 24.0
	panel.offset_top = 22.0
	panel.offset_right = 420.0
	panel.offset_bottom = 146.0
	root.add_child(panel)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 16)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_bottom", 12)
	panel.add_child(margin)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 6)
	margin.add_child(stack)

	_title_label = _make_label(18, Color(0.95, 0.96, 0.9))
	stack.add_child(_title_label)

	_objective_label = _make_label(14, Color(0.86, 0.88, 0.82))
	_objective_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	stack.add_child(_objective_label)

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 18)
	stack.add_child(row)

	_distance_label = _make_label(13, Color(0.72, 0.86, 1.0))
	row.add_child(_distance_label)

	_status_label = _make_label(13, Color(1.0, 0.78, 0.45))
	row.add_child(_status_label)

	_build_health_ui(root)
	_build_minimap_ui(root)

func _build_health_ui(root: Control) -> void:
	var panel := ColorRect.new()
	panel.name = "HealthPanel"
	panel.color = Color(0.02, 0.025, 0.03, 0.78)
	panel.anchor_left = 0.0
	panel.anchor_top = 1.0
	panel.anchor_right = 0.0
	panel.anchor_bottom = 1.0
	panel.offset_left = 24.0
	panel.offset_top = -78.0
	panel.offset_right = 280.0
	panel.offset_bottom = -24.0
	root.add_child(panel)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 8)
	panel.add_child(margin)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 6)
	margin.add_child(stack)

	_health_label = _make_label(13, Color(0.94, 0.95, 0.9))
	stack.add_child(_health_label)

	_health_bar = ProgressBar.new()
	_health_bar.min_value = 0
	_health_bar.max_value = 100
	_health_bar.value = 100
	_health_bar.show_percentage = false
	_health_bar.custom_minimum_size = Vector2(220, 12)
	stack.add_child(_health_bar)

func _build_minimap_ui(root: Control) -> void:
	_minimap = ColorRect.new()
	_minimap.name = "Minimap"
	_minimap.color = Color(0.015, 0.018, 0.02, 0.82)
	_minimap.anchor_left = 1.0
	_minimap.anchor_top = 0.0
	_minimap.anchor_right = 1.0
	_minimap.anchor_bottom = 0.0
	_minimap.offset_left = -182.0
	_minimap.offset_top = 22.0
	_minimap.offset_right = -24.0
	_minimap.offset_bottom = 180.0
	root.add_child(_minimap)

	_north_label = _make_label(12, Color(0.9, 0.9, 0.86))
	_north_label.text = "N"
	_north_label.position = Vector2(74, 6)
	_minimap.add_child(_north_label)

	_target_dot = _make_dot(Color(1.0, 0.18, 0.12))
	_minimap.add_child(_target_dot)

	_player_dot = _make_dot(Color(0.2, 0.75, 1.0))
	_minimap.add_child(_player_dot)

func _make_dot(color: Color) -> ColorRect:
	var dot := ColorRect.new()
	dot.color = color
	dot.size = Vector2(8, 8)
	return dot

func _make_label(font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.clip_text = true
	return label

func _update_hud() -> void:
	if _mission_system == null:
		_title_label.text = "No mission system"
		_objective_label.text = ""
		_distance_label.text = ""
		_status_label.text = ""
		_update_health_hud()
		_update_minimap()
		return

	var title: String = str(_mission_system.call("get_current_mission_title"))
	if title == "":
		_title_label.text = "Mission complete"
		_objective_label.text = "Reward secured. Awaiting next job."
		_distance_label.text = ""
		_status_label.text = _get_player_state()
		_update_health_hud()
		_update_minimap()
		return

	var step_number: int = int(_mission_system.call("get_current_step_number"))
	var step_count: int = int(_mission_system.call("get_step_count"))
	var reward: int = int(_mission_system.call("get_reward"))

	_title_label.text = "%s  %d/%d  $%d" % [title, step_number, step_count, reward]
	_objective_label.text = str(_mission_system.call("get_current_step_text"))
	_distance_label.text = "Dist: %dm" % int(round(_get_distance_to_target()))
	_status_label.text = _get_player_state()
	_update_health_hud()
	_update_minimap()

func _get_distance_to_target() -> float:
	if _player == null or _mission_system == null:
		return 0.0
	var target := _mission_system.call("get_current_target") as Vector3
	return _player.global_position.distance_to(target)

func _get_player_state() -> String:
	if _player == null:
		return "No player"
	var current_vehicle: Variant = _player.get("current_vehicle")
	if current_vehicle is Node3D:
		return "In vehicle"
	return "On foot"

func _update_health_hud() -> void:
	if _health_bar == null or _health_label == null:
		return
	if _player == null:
		_health_label.text = "Health --"
		_health_bar.value = 0
		return
	var health: int = int(_player.get("health"))
	var max_health: int = max(1, int(_player.get("max_health")))
	_health_bar.max_value = max_health
	_health_bar.value = clampi(health, 0, max_health)
	_health_label.text = "Health %d/%d" % [health, max_health]

func _update_minimap() -> void:
	if _minimap == null or _player_dot == null or _target_dot == null:
		return
	if _player == null:
		return
	_position_dot(_player_dot, _player.global_position)
	if _mission_system == null:
		_target_dot.visible = false
		return
	var title: String = str(_mission_system.call("get_current_mission_title"))
	if title == "":
		_target_dot.visible = false
		return
	_target_dot.visible = true
	var target := _mission_system.call("get_current_target") as Vector3
	_position_dot(_target_dot, target)

func _position_dot(dot: ColorRect, world_position: Vector3) -> void:
	var map_size := Vector2(158, 158)
	var half := map_size * 0.5
	var scale := 0.8
	var x := clampf(world_position.x * scale + half.x, 8.0, map_size.x - 8.0)
	var y := clampf(world_position.z * scale + half.y, 8.0, map_size.y - 8.0)
	dot.position = Vector2(x - dot.size.x * 0.5, y - dot.size.y * 0.5)
