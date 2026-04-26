extends CanvasLayer

var logs := []
var max_logs := 200
var visible_console := false

func _ready():
    visible = false

func _input(event):
    if event.is_action_pressed("open_console"):
        visible_console = !visible_console
        visible = visible_console

func log(msg: String):
    logs.append(msg)
    if logs.size() > max_logs:
        logs.pop_front()

func _draw():
    if not visible_console:
        return
    var y := 20
    for l in logs:
        draw_string(get_theme_default_font(), Vector2(10, y), l)
        y += 14
