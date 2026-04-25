extends CanvasLayer

@export var map_texture_path := "res://assets/ui/barcelon_world_map.png"

@onready var root_panel: Control = $Root
@onready var map_rect: TextureRect = $Root/Panel/MapFrame/MapTexture
@onready var fog_layer: Control = $Root/Panel/MapFrame/FogLayer
@onready var title_label: Label = $Root/Panel/Header/Title
@onready var status_label: Label = $Root/Panel/Header/Status

var is_open := false
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

func _ready() -> void:
    hide_map()
    _load_map_texture()
    _redraw_fog()

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("open_map") or event.is_action_pressed("ui_cancel") and is_open:
        toggle_map()

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
    status_label.text = "ZONAS EXPLORADAS: %d / %d" % [_visited_count(), visited_regions.size()]
    _redraw_fog()

func hide_map() -> void:
    is_open = false
    root_panel.visible = false
    get_tree().paused = false

func mark_region_visited(region_id: String) -> void:
    if visited_regions.has(region_id):
        visited_regions[region_id] = true
    _redraw_fog()

func _load_map_texture() -> void:
    if ResourceLoader.exists(map_texture_path):
        map_rect.texture = load(map_texture_path)
    else:
        push_warning("Map texture missing. Add image at: " + map_texture_path)

func _visited_count() -> int:
    var count := 0
    for key in visited_regions.keys():
        if visited_regions[key]:
            count += 1
    return count

func _redraw_fog() -> void:
    if not fog_layer:
        return

    for child in fog_layer.get_children():
        child.queue_free()

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
        label.position = region_rects[key].position + Vector2(14, 14)
        label.mouse_filter = Control.MOUSE_FILTER_IGNORE
        fog_layer.add_child(label)
