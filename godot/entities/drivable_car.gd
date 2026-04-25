extends CharacterBody3D

@export var motor_power := 14.0
@export var max_forward_speed := 22.0
@export var max_reverse_speed := 8.0
@export var turn_power := 2.8
@export var drag := 0.94

var driver_node: Node3D = null
var current_speed := 0.0

func has_driver() -> bool:
    return driver_node != null

func enter_car(driver: Node3D) -> void:
    driver_node = driver

func exit_car() -> Node3D:
    var old_driver := driver_node
    driver_node = null
    current_speed = 0.0
    return old_driver

func _physics_process(delta: float) -> void:
    if not has_driver():
        current_speed = move_toward(current_speed, 0.0, motor_power * delta)
        return

    var steer := Input.get_axis("steer_left", "steer_right")
    var throttle := Input.get_axis("brake", "accelerate")

    current_speed += throttle * motor_power * delta
    current_speed = clamp(current_speed, -max_reverse_speed, max_forward_speed)
    current_speed *= drag

    if abs(current_speed) > 0.2:
        rotation.y += steer * turn_power * delta * clamp(current_speed / max_forward_speed, -1.0, 1.0)

    velocity = -transform.basis.z * current_speed
    move_and_slide()
