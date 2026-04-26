extends Node

var base_colors = []
var car_palettes = {}

func load_colors():
    var data = load_json("res://data/vehicle_colors.json")
    base_colors = data["base_colors"]
    car_palettes = data["car_palettes"]

func get_random_color_pair(car_name: String):
    if not car_palettes.has(car_name):
        return Color.WHITE
    var palette = car_palettes[car_name]
    var pair = palette[randi() % palette.size()]
    return Color(base_colors[pair[0]][0]/255.0, base_colors[pair[0]][1]/255.0, base_colors[pair[0]][2]/255.0)

func load_json(path):
    var file = FileAccess.open(path, FileAccess.READ)
    var text = file.get_as_text()
    return JSON.parse_string(text)
