extends CharacterBody3D

@export var move_speed: float = 7.0
@export var run_speed: float = 11.0
@export var gravity: float = 24.0

var current_vehicle: Node = null

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

	var dir: Vector3 = Vector3.ZERO
	var input: Vector2 = Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_back", "move_forward")
	)

	var player_basis: Basis = global_transform.basis
	dir += -player_basis.z * input.y
	dir += player_basis.x * input.x

	if dir.length() > 0:
		dir = dir.normalized()

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
