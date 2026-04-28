extends CharacterBody3D

@export var move_speed: float = 7.0
@export var run_speed: float = 11.0
@export var gravity: float = 24.0
@export var jump_velocity: float = 8.5
@export var turn_speed: float = 3.4
@export var max_health: int = 100

var current_vehicle: Node = null
var health: int = 100

func get_camera_target() -> Node3D:
	if current_vehicle is Node3D:
		return current_vehicle
	return self

func _physics_process(delta):
	if current_vehicle:
		return

	var vertical_velocity: float = velocity.y
	if not is_on_floor():
		vertical_velocity -= gravity * delta
	else:
		vertical_velocity = 0.0
		if Input.is_action_just_pressed("jump"):
			vertical_velocity = jump_velocity

	var turn_input: float = Input.get_axis("move_left", "move_right")
	rotation.y -= turn_input * turn_speed * delta

	var forward_input: float = Input.get_axis("move_forward", "move_back")
	var dir: Vector3 = -global_transform.basis.z.normalized() * forward_input

	var speed: float = run_speed if Input.is_action_pressed("run") else move_speed
	velocity = dir * speed
	velocity.y = vertical_velocity

	move_and_slide()

	if Input.is_action_just_pressed("interact"):
		_try_enter_vehicle()

func _try_enter_vehicle():
	for body in get_tree().get_nodes_in_group("car"):
		var vehicle := body as Node3D
		if vehicle == null:
			continue
		if vehicle.global_position.distance_to(global_position) < 3.5:
			if vehicle.has_method("enter_vehicle") and bool(vehicle.call("enter_vehicle", self)):
				current_vehicle = vehicle
				return

func exit_vehicle():
	if current_vehicle:
		var v: Node = current_vehicle
		current_vehicle = null
		v.call("exit_vehicle")

func _input(event):
	if current_vehicle and event.is_action_pressed("interact"):
		exit_vehicle()
