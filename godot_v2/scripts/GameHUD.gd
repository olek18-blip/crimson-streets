extends CanvasLayer

@export var mission_system_path: NodePath = NodePath("../MissionSystem")

var _mission_system: Node = null
var _player: Node3D = null

var _title_label: Label
var _objective_label: Label
var _distance_label: Label
var _status_label: Label

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
		return

	var title: String = str(_mission_system.call("get_current_mission_title"))
	if title == "":
		_title_label.text = "Mission complete"
		_objective_label.text = "Reward secured. Awaiting next job."
		_distance_label.text = ""
		_status_label.text = _get_player_state()
		return

	var step_number: int = int(_mission_system.call("get_current_step_number"))
	var step_count: int = int(_mission_system.call("get_step_count"))
	var reward: int = int(_mission_system.call("get_reward"))

	_title_label.text = "%s  %d/%d  $%d" % [title, step_number, step_count, reward]
	_objective_label.text = str(_mission_system.call("get_current_step_text"))
	_distance_label.text = "Dist: %dm" % int(round(_get_distance_to_target()))
	_status_label.text = _get_player_state()

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
