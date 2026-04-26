extends Node

var player
var world
var traffic

func _ready():
	player = get_tree().get_first_node_in_group("player")
	world = get_node_or_null("World")
	traffic = get_node_or_null("Traffic")

	print("[GAME] Initialized clean base")

func _process(delta):
	# future: global tick systems
	pass
