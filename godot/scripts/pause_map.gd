extends CanvasLayer

@export var map_texture_path := "res://assets/ui/barcelon_world_map.png"
@export var world_min := Vector2(-100, -100)
@export var world_max := Vector2(100, 100)

@onready var root_panel: Control = $Root
@onready var map_rect: TextureRect = $Root/Panel/MapFrame/MapTexture
@onready var route_layer: Control = $Root/Panel/MapFrame/RouteLayer
@onready var fog_layer: Control = $Root/Panel/MapFrame/FogLayer
@onready var marker_layer: Control = $Root/Panel/MapFrame/MarkerLayer
@onready var title_label: Label = $Root/Panel/Header/Title
@onready var status_label: Label = $Root/Panel/Header/Status

var is_open := false
var player: Node3D
var gps_target_world := Vector3(34, 0, -42)

var visited_regions := {
    "barcelon_start": true,
    "central_hub": false,
    "industrial_west": false,
    "coast_docks": false,
    "desert_track": false,
    "pink_district": false
}

var region_rects := {
    "barcelon_start": Rect2(510, 355, 260, 150),
    "central_hub": Rect2(360, 170, 230, 170),
    "industrial_west": Rect2(40, 70, 330, 240),
    "coast_docks": Rect2(650, 250, 260, 180),
    "desert_track": Rect2(600, 35, 300, 190),
    "pink_district": Rect2(250, 410, 360, 150)
}

var mission_markers := [
    {"id": "intro", "title": "Contacto en Barcelon", "world": Vector3(34, 0, -42), "type": "mission"},
    {"id": "hideout_01", "title": "Guarida del muelle", "world": Vector3(68, 0, -18), "type": "gang"},
    {"id": "heist_01", "title": "Robo del archivo", "world": Vector3(-54, 0, 36), "type": "heist"}
]

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    player = get_tree().get_first_node_in_group("player")
    hide_map()
    _load_map_texture()
    _redraw_all()

func _process(_delta: float) -> void:
    if is_open:
        _redraw_dynamic_layers()

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("open_map"):
        toggle_map()
    elif event.is_action_pressed("ui_cancel") and is_open:
        hide_map()

func toggle_map() -> void:
    if is_open:
        hide_map()
    else:
        show_map()

func show_map() -> void:
    is_open = true
    root_panel.visible = true
    get_tree().paused = true
    title_label.text = "BARCELON · MAPA OPERATIVO"
    _redraw_all()

func hide_map() -> void:
    is_open = false
    root_panel.visible = false
    get_tree().paused = false

func set_gps_target(target: Vector3) -> void:
    gps_target_world = target
    _redraw_dynamic_layers()

func mark_region_visited(region_id: String) -> void:
    if visited_regions.has(region_id):
        visited_regions[region_id] = true
    _redraw_all()

func _load_map_texture() -> void:
    if ResourceLoader.exists(map_texture_path):
        map_rect.texture = load(map_texture_path)
    else:
        push_warning("Missing map texture. Add the image at: " + map_texture_path)

func _visited_count() -> int:
    var count := 0
    for key in visited_regions.keys():
        if visited_regions[key]:
            count += 1
    return count

func _redraw_all() -> void:
    status_label.text = "EXPLORADO: %d / %d · M: CERRAR" % [_visited_count(), visited_regions.size()]
    _redraw_fog()
    _redraw_dynamic_layers()

func _redraw_dynamic_layers() -> void:
    _clear_children(route_layer)
    _clear_children(marker_layer)
    _draw_gps_route()
    _draw_mission_markers()
    _draw_player_marker()

func _redraw_fog() -> void:
    _clear_children(fog_layer)
    for key in region_rects.keys():
        if visited_regions.get(key, false):
            continue

        var fog := ColorRect.new()
        fog.color = Color(0.0, 0.0, 0.0, 0.72)
        fog.position = region_rects[key].position
        fog.size = region_rects[key].size
        fog.mouse_filter = Control.MOUSE_FILTER_IGNORE
        fog_layer.add_child(fog)

        var label := Label.new()
        label.text = "NO EXPLORADO"
        label.modulate = Color(0.65, 0.78, 0.95, 0.55)
        label.position = region_rects[key].position + Vector2(12, 12)
        label.mouse_filter = Control.MOUSE_FILTER_IGNORE
        fog_layer.add_child(label)

func _draw_gps_route() -> void:
    if not player:
        return

    var start := _world_to_map(player.global_position)
    var end := _world_to_map(gps_target_world)
    var mid := Vector2(start.x, end.y)

    _add_route_segment(start, mid)
    _add_route_segment(mid, end)
    _add_dot(route_layer, end, Color(1.0, 0.78, 0.15, 1.0), 12.0)

func _add_route_segment(a: Vector2, b: Vector2) -> void:
    var glow := Line2D.new()
    glow.width = 11.0
    glow.default_color = Color(0.1, 0.65, 1.0, 0.22)
    glow.points = PackedVector2Array([a, b])
    route_layer.add_child(glow)

    var line := Line2D.new()
    line.width = 5.0
    line.default_color = Color(0.1, 0.65, 1.0, 0.9)
    line.points = PackedVector2Array([a, b])
    route_layer.add_child(line)

func _draw_mission_markers() -> void:
    for marker in mission_markers:
        var pos := _world_to_map(marker["world"])
        var color := Color(1, 0.8, 0.2)
        if marker["type"] == "gang":
            color = Color(1, 0.25, 0.25)
        elif marker["type"] == "heist":
            color = Color(0.35, 1, 0.45)
        _add_dot(marker_layer, pos, color, 9.0)

func _draw_player_marker() -> void:
    if not player:
        return
    var pos := _world_to_map(player.global_position)
    _add_dot(marker_layer, pos, Color(1, 0.1, 0.1), 8.0)

func _add_dot(layer: Control, pos: Vector2, color: Color, size: float) -> void:
    var dot := ColorRect.new()
    dot.color = color
    dot.size = Vector2(size, size)
    dot.position = pos - dot.size * 0.5
    dot.mouse_filter = Control.MOUSE_FILTER_IGNORE
    layer.add_child(dot)

func _world_to_map(world_pos: Vector3) -> Vector2:
    var frame_size := map_rect.size
    if frame_size.x <= 1 or frame_size.y <= 1:
        frame_size = Vector2(900, 560)

    var nx := inverse_lerp(world_min.x, world_max.x, world_pos.x)
    var ny := inverse_lerp(world_min.y, world_max.y, world_pos.z)

    return Vector2(
        clamp(nx, 0.0, 1.0) * frame_size.x,
        clamp(ny, 0.0, 1.0) * frame_size.y
    )

func _clear_children(node: Node) -> void:
    if not node:
        return
    for child in node.get_children():
        child.queue_free()
