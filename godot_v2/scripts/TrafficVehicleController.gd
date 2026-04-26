extends CharacterBody3D

@export var acceleration := 10.0
@export var brake_force := 20.0
@export var max_speed := 9.0
@export var turn_lerp := 8.0
@export var safe_distance := 7.0
@export var slow_distance := 13.0

var lane_id := ""
var points: Array[Vector3] = []
var target_index := 0
var current_speed := 0.0
var desired_speed := 7.0
var active := false

func setup(path_points: Array[Vector3], lane_speed: float, id: String) -> void:
	points = path_points
	desired_speed = min(lane_speed, max_speed)
	lane_id = id
	target_index = 1 if points.size() > 1 else 0
	current_speed = 0.0
	active = points.size() > 1
	if active:
		global_position = points[0]
		look_at(points[target_index], Vector3.UP)
	visible = active
	set_physics_process(active)

func reset() -> void:
	active = false
	points.clear()
	target_index = 0
	current_speed = 0.0
	velocity = Vector3.ZERO
	visible = false
	set_physics_process(false)

func _physics_process(delta: float) -> void:
	if not active or points.size() < 2:
		return

	var target := points[target_index]
	var to_target := target - global_position
	to_target.y = 0

	if to_target.length() < 1.2:
		target_index = (target_index + 1) % points.size()
		return

	var blocked_factor := _get_blocked_factor()
	var target_speed := desired_speed * blocked_factor

	if current_speed < target_speed:
		current_speed = move_toward(current_speed, target_speed, acceleration * delta)
	else:
		current_speed = move_toward(current_speed, target_speed, brake_force * delta)

	var direction := to_target.normalized()
	var target_yaw := atan2(-direction.x, -direction.z)
	rotation.y = lerp_angle(rotation.y, target_yaw, turn_lerp * delta)

	velocity = -global_transform.basis.z * current_speed
	move_and_slide()

func _get_blocked_factor() -> float:
	var forward := -global_transform.basis.z.normalized()
	var closest := INF

	for node in get_tree().get_nodes_in_group("car"):
		if node == self:
			continue
		var offset: Vector3 = node.global_position - global_position
		offset.y = 0
		var forward_distance := offset.dot(forward)
		if forward_distance <= 0.0 or forward_distance > slow_distance:
			continue
		var lateral := (offset - forward * forward_distance).length()
		if lateral < 2.8:
			closest = min(closest, forward_distance)

	var player := get_tree().get_first_node_in_group("player")
	if player:
		var p_offset: Vector3 = player.global_position - global_position
		p_offset.y = 0
		var p_forward := p_offset.dot(forward)
		if p_forward > 0.0 and p_forward < slow_distance:
			var p_lateral := (p_offset - forward * p_forward).length()
			if p_lateral < 2.4:
				closest = min(closest, p_forward)

	if closest < safe_distance:
		return 0.0
	if closest < slow_distance:
		return clamp((closest - safe_distance) / (slow_distance - safe_distance), 0.0, 1.0)
	return 1.0
