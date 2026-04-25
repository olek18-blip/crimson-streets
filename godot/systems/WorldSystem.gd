class_name WorldSystem
extends Node3D

const LOAD_RADIUS := 1
const UNLOAD_RADIUS := 2

@export var player_path: NodePath
@export var chunk_size := 60.0
@export var chunk_root := "res://world/chunks"

var player: Node3D
var loaded_chunks: Dictionary = {}
var loading_chunks: Dictionary = {}

var chunk_scenes := {
    Vector2i(0, 0): "chunk_0_0.tscn",
    Vector2i(1, 0): "chunk_1_0.tscn",
    Vector2i(0, 1): "chunk_0_1.tscn",
    Vector2i(-1, 0): "chunk_-1_0.tscn",
    Vector2i(0, -1): "chunk_0_-1.tscn"
}

func _ready() -> void:
    player = get_node_or_null(player_path)
    if not player:
        player = get_tree().get_first_node_in_group("player")
    tick()

func _process(_delta: float) -> void:
    tick()
    _poll_loading_chunks()

func tick() -> void:
    if not player:
        return

    var current := world_to_chunk(player.global_position)
    var wanted: Dictionary = {}

    for offset in _get_offsets_in_radius(LOAD_RADIUS):
        var coord: Vector2i = current + offset
        if not chunk_scenes.has(coord):
            continue
        wanted[coord] = true
        if not loaded_chunks.has(coord) and not loading_chunks.has(coord):
            _request_chunk(coord)

    for coord in loaded_chunks.keys():
        if coord.distance_to(current) > UNLOAD_RADIUS:
            _unload_chunk(coord)

func world_to_chunk(pos: Vector3) -> Vector2i:
    return Vector2i(floor(pos.x / chunk_size), floor(pos.z / chunk_size))

func chunk_to_world_origin(coord: Vector2i) -> Vector3:
    return Vector3(coord.x * chunk_size, 0, coord.y * chunk_size)

func _get_offsets_in_radius(radius: int) -> Array[Vector2i]:
    var offsets: Array[Vector2i] = []
    for x in range(-radius, radius + 1):
        for z in range(-radius, radius + 1):
            offsets.append(Vector2i(x, z))
    return offsets

func _chunk_path(coord: Vector2i) -> String:
    return "%s/%s" % [chunk_root, chunk_scenes[coord]]

func _request_chunk(coord: Vector2i) -> void:
    var path := _chunk_path(coord)
    if not ResourceLoader.exists(path):
        push_warning("Missing chunk scene: " + path)
        return

    var err := ResourceLoader.load_threaded_request(path)
    if err != OK:
        push_warning("Could not request threaded chunk load: " + path)
        return

    loading_chunks[coord] = path

func _poll_loading_chunks() -> void:
    for coord in loading_chunks.keys():
        var path: String = loading_chunks[coord]
        var status := ResourceLoader.load_threaded_get_status(path)

        if status == ResourceLoader.THREAD_LOAD_LOADED:
            var packed := ResourceLoader.load_threaded_get(path) as PackedScene
            loading_chunks.erase(coord)
            _instantiate_chunk(coord, packed)
            return

        if status == ResourceLoader.THREAD_LOAD_FAILED or status == ResourceLoader.THREAD_LOAD_INVALID_RESOURCE:
            loading_chunks.erase(coord)
            push_warning("Chunk threaded load failed: " + path)
            return

func _instantiate_chunk(coord: Vector2i, packed: PackedScene) -> void:
    if not packed or loaded_chunks.has(coord):
        return

    var chunk := packed.instantiate() as Node3D
    chunk.name = "Chunk_%d_%d" % [coord.x, coord.y]
    chunk.global_position = chunk_to_world_origin(coord)
    add_child(chunk)
    loaded_chunks[coord] = chunk

func _unload_chunk(coord: Vector2i) -> void:
    if not loaded_chunks.has(coord):
        return

    var chunk: Node = loaded_chunks[coord]
    loaded_chunks.erase(coord)
    if is_instance_valid(chunk):
        chunk.queue_free()
