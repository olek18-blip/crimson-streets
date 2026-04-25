extends Node

var move_vector := Vector2.ZERO
var interact_pressed := false

func set_move_vector(value: Vector2) -> void:
    move_vector = value.limit_length(1.0)

func consume_interact() -> bool:
    if interact_pressed:
        interact_pressed = false
        return true
    return false

func press_interact() -> void:
    interact_pressed = true
