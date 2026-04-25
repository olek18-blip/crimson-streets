extends CharacterBody3D

@export var acceleration := 14.0
@export var max_speed := 22.0
@export var friction := 0.96
@export var turn_speed := 2.8

var current_speed := 0.0
var driver = null

func has_driver():
    return driver != null

func set_driver(p):
    driver = p

func remove_driver():
    driver = null

func _physics_process(delta):
    if not has_driver():
        return

    var steer = Input.get_axis("steer_left", "steer_right")
    var accel = Input.get_axis("move_back", "move_forward")

    current_speed += accel * acceleration * delta
    current_speed = clamp(current_speed, -max_speed * 0.4, max_speed)

    rotation.y += steer * turn_speed * delta * (current_speed / max_speed)

    var forward = -transform.basis.z
    velocity = forward * current_speed

    velocity *= friction

    move_and_slide()