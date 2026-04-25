class_name StateMachine
extends Node

var current_state = null
var states = {}

func register(name, state):
    states[name] = state

func transition_to(name, params = {}):
    if current_state and current_state.has_method("exit"):
        current_state.exit()

    current_state = states.get(name)

    if current_state and current_state.has_method("enter"):
        current_state.enter(params)

func _physics_process(delta):
    if current_state and current_state.has_method("update"):
        current_state.update(delta)