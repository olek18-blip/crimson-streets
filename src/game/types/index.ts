// Game Types Definitions

export interface Weapon {
    name: string;
    damage: number;
    range: number;
}

export interface Vehicle {
    name: string;
    speed: number;
    capacity: number;
}

export interface Character {
    name: string;
    health: number;
    weapon: Weapon;
}

export interface Mission {
    title: string;
    completed: boolean;
    objective: string;
}

export interface GameState {
    currentMission: Mission;
    playerCharacter: Character;
    availableVehicles: Vehicle[];
}