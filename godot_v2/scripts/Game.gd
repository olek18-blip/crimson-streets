extends Node

var player: Node = null
var world: Node = null
var traffic: Node = null

func _ready():
	player = get_tree().get_first_node_in_group("player")
	world = get_node_or_null("World")
	traffic = get_node_or_null("Traffic")

	print("[GAME] Initialized clean base")

func _process(_delta):
	# future: global tick systems
	pass
