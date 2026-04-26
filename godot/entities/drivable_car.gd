extends CharacterBody3D

@export var motor_power := 18.0
@export var brake_power := 24.0
@export var max_forward_speed := 24.0
@export var max_reverse_speed := 9.0
@export var turn_power := 2.6
@export var drag := 0.985
@export var idle_drag := 0.92

var driver_node: Node3D = null
var current_speed := 0.0

@onready var driver_anchor: Node3D = get_node_or_null("DriverAnchor")
@onready var exit_anchor: Node3D = get_node_or_null("ExitAnchor")

func has_driver() -> bool:
    return driver_node != null

func enter_car(driver: Node3D) -> bool:
    if has_driver():
        return false

    driver_node = driver
    if driver_anchor:
        driver.global_position = driver_anchor.global_position
    driver.visible = false
    driver.set_physics_process(false)
    return true

func exit_car() -> Node3D:
    if not has_driver():
        return null

    var old_driver := driver_node
    driver_node = null
    current_speed = 0.0

    if old_driver:
        old_driver.visible = true
        old_driver.set_physics_process(true)
        old_driver.global_position = get_exit_position()

    return old_driver

func get_exit_position() -> Vector3:
    if exit_anchor:
        return exit_anchor.global_position
    return global_position + transform.basis.x * 2.4

func _physics_process(delta: float) -> void:
    if not has_driver():
        current_speed = move_toward(current_speed, 0.0, brake_power * 0.35 * delta)
        velocity = -transform.basis.z * current_speed
        move_and_slide()
        return

    var steer := Input.get_axis("steer_left", "steer_right")
    var throttle := Input.get_axis("brake", "accelerate")

    if abs(throttle) > 0.01:
        current_speed += throttle * motor_power * delta
    else:
        current_speed *= idle_drag

    current_speed = clamp(current_speed, -max_reverse_speed, max_forward_speed)

    var speed_factor := clamp(abs(current_speed) / max_forward_speed, 0.0, 1.0)
    if speed_factor > 0.02:
        var reverse_factor := -1.0 if current_speed < 0.0 else 1.0
        rotation.y += steer * turn_power * delta * speed_factor * reverse_factor

    current_speed *= drag
    velocity = -transform.basis.z * current_speed
    move_and_slide()
