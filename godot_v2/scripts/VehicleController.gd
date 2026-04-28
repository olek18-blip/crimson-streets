extends CharacterBody3D

@export var acceleration: float = 18.0
@export var brake_force: float = 28.0
@export var max_forward_speed: float = 24.0
@export var max_reverse_speed: float = 9.0
@export var turn_rate: float = 2.4
@export var idle_drag: float = 0.93
@export var moving_drag: float = 0.985

var driver: Node3D = null
var current_speed: float = 0.0

@onready var driver_anchor: Node3D = get_node_or_null("DriverAnchor")
@onready var exit_anchor: Node3D = get_node_or_null("ExitAnchor")

func has_driver() -> bool:
	return driver != null

func enter_vehicle(new_driver: Node3D) -> bool:
	if has_driver():
		return false
	driver = new_driver
	driver.visible = false
	driver.set_physics_process(false)
	if driver_anchor:
		driver.global_position = driver_anchor.global_position
	return true

func exit_vehicle() -> Node3D:
	if not driver:
		return null
	var old_driver: Node3D = driver
	driver = null
	current_speed = 0.0
	old_driver.visible = true
	old_driver.set_physics_process(true)
	old_driver.global_position = get_exit_position()
	return old_driver

func get_exit_position() -> Vector3:
	if exit_anchor:
		return exit_anchor.global_position
	return global_position + global_transform.basis.x * 2.5

func _physics_process(delta: float) -> void:
	if not has_driver():
		current_speed = move_toward(current_speed, 0.0, brake_force * 0.25 * delta)
		velocity = -global_transform.basis.z * current_speed
		move_and_slide()
		return

	var steer: float = Input.get_axis("steer_left", "steer_right")
	var throttle: float = Input.get_axis("brake", "accelerate")

	if throttle > 0.01:
		current_speed += throttle * acceleration * delta
	elif throttle < -0.01:
		current_speed += throttle * brake_force * delta
	else:
		current_speed *= idle_drag

	current_speed = clampf(current_speed, -max_reverse_speed, max_forward_speed)

	var speed_ratio: float = clampf(absf(current_speed) / max_forward_speed, 0.0, 1.0)
	if speed_ratio > 0.03:
		var reverse: float = -1.0 if current_speed < 0.0 else 1.0
		rotation.y += steer * turn_rate * delta * speed_ratio * reverse

	current_speed *= moving_drag
	velocity = -global_transform.basis.z * current_speed
	move_and_slide()
