extends CharacterBody3D

var path_points := []
var current_index := 0
var speed := 6.0

func setup(points, spd):
	path_points = points
	speed = spd
	global_position = points[0]

func _physics_process(delta):
	if path_points.size() < 2:
		return

	var target = path_points[current_index]
	var dir = (target - global_position)
	var dist = dir.length()

	if dist < 1.0:
		current_index = (current_index + 1) % path_points.size()
		return

	dir = dir.normalized()
	velocity = dir * speed

	look_at(target, Vector3.UP)
	move_and_slide()
