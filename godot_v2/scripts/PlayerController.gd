extends CharacterBody3D

@export var move_speed := 7.0
@export var run_speed := 11.0

var current_vehicle: Node = null

func _physics_process(delta):
	if current_vehicle:
		return

	var dir := Vector3.ZERO
	var input := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_back", "move_forward")
	)

	var basis := global_transform.basis
	dir += -basis.z * input.y
	dir += basis.x * input.x

	if dir.length() > 0:
		dir = dir.normalized()

	var speed := run_speed if Input.is_action_pressed("run") else move_speed
	velocity = dir * speed

	move_and_slide()

	if Input.is_action_just_pressed("interact"):
		_try_enter_vehicle()

func _try_enter_vehicle():
	for body in get_tree().get_nodes_in_group("car"):
		if body.global_position.distance_to(global_position) < 3.5:
			if body.has_method("enter_vehicle") and body.enter_vehicle(self):
				current_vehicle = body
				return

func exit_vehicle():
	if current_vehicle:
		var v = current_vehicle
		current_vehicle = null
		v.exit_vehicle()

func _input(event):
	if current_vehicle and event.is_action_pressed("interact"):
		exit_vehicle()
