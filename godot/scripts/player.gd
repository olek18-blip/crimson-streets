extends CharacterBody3D

@export var speed := 6.0
var gravity := ProjectSettings.get_setting("physics/3d/default_gravity")

var current_car = null

func _physics_process(delta):
    if current_car:
        return  # NO controlar player si está en coche

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

func _input(event):
    if event.is_action_pressed("interact"):
        if current_car:
            exit_car()
        else:
            try_enter_car()

func try_enter_car():
    var cars = get_tree().get_nodes_in_group("car")

    for car in cars:
        if global_position.distance_to(car.global_position) < 3:
            current_car = car
            car.enter_car(self)
            visible = false
            return

func exit_car():
    if not current_car:
        return

    global_position = current_car.global_position + Vector3(2,0,0)
    current_car.exit_car()
    current_car = null
    visible = true