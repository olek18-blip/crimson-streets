extends Control

@export var world_min := Vector2(-80, -80)
@export var world_max := Vector2(80, 80)
@export var minimap_size := Vector2(170, 170)
@export var minimap_margin := Vector2(24, 28)

var player: Node3D
var mission_title := "Entra en la ruta del circuito"
var mission_hint := "Acércate al marcador para iniciar la operación."
var zone_name := "BARCELON"
var money := 500
var health := 100

func _ready():
	set_process(true)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	player = get_tree().get_first_node_in_group("player")

func _process(_delta):
	if not player:
		player = get_tree().get_first_node_in_group("player")
	queue_redraw()

func _draw():
	_draw_top_status()
	_draw_mission_card()
	_draw_minimap()

func _draw_top_status():
	var panel := Rect2(Vector2(24, 18), Vector2(size.x - 48, 72))
	draw_rect(panel, Color(0.02, 0.04, 0.07, 0.82), true)
	draw_rect(panel, Color(0.35, 0.55, 0.75, 0.25), false, 2.0)
	_draw_text(Vector2(46, 45), zone_name, 14, Color(0.75, 0.9, 1.0))
	_draw_text(Vector2(size.x - 150, 45), "$%d" % money, 22, Color(0.2, 1.0, 0.35))
	var bar := Rect2(Vector2(46, 62), Vector2((size.x - 210) * health / 100.0, 8))
	draw_rect(bar, Color(0.15, 0.9, 0.2), true)

func _draw_mission_card():
	var panel := Rect2(Vector2(24, 108), Vector2(size.x - 48, 108))
	draw_rect(panel, Color(0.025, 0.04, 0.07, 0.86), true)
	draw_rect(panel, Color(0.35, 0.55, 0.75, 0.22), false, 2.0)
	_draw_text(Vector2(46, 138), "OPERACIÓN DISPONIBLE", 12, Color(0.55, 0.95, 1.0))
	_draw_text(Vector2(46, 166), mission_title, 20, Color(0.95, 0.97, 1.0))
	_draw_text(Vector2(46, 196), mission_hint, 14, Color(0.65, 0.72, 0.82))

func _draw_minimap():
	var pos := Vector2(size.x - minimap_size.x - minimap_margin.x, size.y - minimap_size.y - minimap_margin.y)
	var rect := Rect2(pos, minimap_size)
	draw_rect(rect, Color(0.01, 0.015, 0.02, 0.88), true)
	draw_rect(rect, Color(0.4, 0.6, 0.85, 0.35), false, 2.0)
	_draw_text(pos + Vector2(8, -12), "MINIMAPA", 11, Color(0.65, 0.78, 0.9))

	_draw_roads_on_minimap(rect)
	_draw_entities_on_minimap(rect)

func _draw_roads_on_minimap(rect: Rect2):
	var road_color := Color(0.25, 0.34, 0.42, 0.9)
	_draw_map_line(rect, Vector3(0,0,-58), Vector3(0,0,58), road_color, 4.0)
	_draw_map_line(rect, Vector3(-42,0,18), Vector3(42,0,18), road_color, 4.0)
	_draw_map_line(rect, Vector3(-34,0,-52), Vector3(-34,0,12), road_color, 3.0)
	_draw_map_line(rect, Vector3(34,0,-54), Vector3(34,0,10), road_color, 3.0)

func _draw_entities_on_minimap(rect: Rect2):
	if player:
		var p := _world_to_minimap(rect, player.global_position)
		draw_circle(p, 5, Color(1.0, 0.15, 0.12))

	for car in get_tree().get_nodes_in_group("car"):
		var c := _world_to_minimap(rect, car.global_position)
		draw_rect(Rect2(c - Vector2(3,3), Vector2(6,6)), Color(0.25, 0.65, 1.0), true)

	# Mission marker
	var m := _world_to_minimap(rect, Vector3(0, 0, -54))
	draw_circle(m, 4, Color(1.0, 0.82, 0.18))

func _draw_map_line(rect: Rect2, a: Vector3, b: Vector3, color: Color, width: float):
	draw_line(_world_to_minimap(rect, a), _world_to_minimap(rect, b), color, width)

func _world_to_minimap(rect: Rect2, pos: Vector3) -> Vector2:
	var nx := inverse_lerp(world_min.x, world_max.x, pos.x)
	var nz := inverse_lerp(world_min.y, world_max.y, pos.z)
	return rect.position + Vector2(clamp(nx, 0.0, 1.0), clamp(nz, 0.0, 1.0)) * rect.size

func _draw_text(pos: Vector2, text: String, font_size: int, color: Color):
	draw_string(get_theme_default_font(), pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, color)
