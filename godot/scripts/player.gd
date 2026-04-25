extends CharacterBody3D

@export var speed := 6.0
var gravity := ProjectSettings.get_setting("physics/3d/default_gravity")

func _physics_process(delta):
    if not is_on_floor():
        velocity.y -= gravity * delta

    var input_dir = Input.get_vector("move_left", "move_right", "move_forward", "move_back")
    var dir = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

    if dir:
        velocity.x = dir.x * speed
        velocity.z = dir.z * speed
    else:
        velocity.x = move_toward(velocity.x, 0, speed)
        velocity.z = move_toward(velocity.z, 0, speed)

    move_and_slide()
