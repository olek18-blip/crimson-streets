class_name DayTimeSystem
extends Node

signal time_changed(hour: int, minute: int)

@export_range(0, 23) var hour := 12
@export_range(0, 59) var minute := 0
@export var time_scale := 1.0
@export var minutes_per_real_second := 1.0

var _minute_accumulator := 0.0

func _process(delta: float) -> void:
    if time_scale <= 0.0:
        return

    _minute_accumulator += delta * minutes_per_real_second * time_scale
    if _minute_accumulator >= 1.0:
        var add_minutes := int(_minute_accumulator)
        _minute_accumulator -= add_minutes
        add_time(0, add_minutes)

func set_time(new_hour: int, new_minute: int) -> void:
    hour = clamp(new_hour, 0, 23)
    minute = clamp(new_minute, 0, 59)
    time_changed.emit(hour, minute)

func add_time(add_hours: int, add_minutes: int) -> void:
    var total := hour * 60 + minute + add_hours * 60 + add_minutes
    total = ((total % 1440) + 1440) % 1440
    hour = int(total / 60)
    minute = total % 60
    time_changed.emit(hour, minute)

func get_time_string() -> String:
    return "%02d:%02d" % [hour, minute]

func get_day_factor() -> float:
    return abs(sin((float(hour) + float(minute) / 60.0) / 24.0 * TAU))
