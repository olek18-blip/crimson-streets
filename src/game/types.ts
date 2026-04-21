export type PlayerAnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'shoot' | 'hit' | 'death';

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  health: number;
  armor: number;
  money: number;
  wantedLevel: number;
  inVehicle: boolean;
  currentVehicle: string | null;
  weapon: 'fist' | 'knife' | 'pistol' | 'rifle';
  isShooting: boolean;
  isRunning: boolean;
  currentCity: string;
  animationState: PlayerAnimationState;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'motorcycle';
  position: [number, number, number];
  rotation: number;
  color: string;
  speed: number;
  city: string;
}

export interface NPC {
  id: string;
  type: 'civilian' | 'police' | 'gang';
  position: [number, number, number];
  rotation: number;
  health: number;
  isHostile: boolean;
  isAlive: boolean;
  city: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  status: 'available' | 'active' | 'completed' | 'failed';
  reward: number;
  city: string;
}

export type MissionObjectiveType = 'reach' | 'switch-weapon' | 'enter-vehicle' | 'eliminate-gangs';

export type MissionObjectiveEffect =
  | {
      type: 'add-money';
      amount: number;
    }
  | {
      type: 'set-min-wanted-level';
      level: number;
    }
  | {
      type: 'set-wanted-level';
      level: number;
    }
  | {
      type: 'set-npc-hostility';
      city: string;
      npcType?: NPC['type'];
      hostile: boolean;
    };

export interface MissionObjective {
  id: string;
  text: string;
  completed: boolean;
  targetPosition?: [number, number, number];
  objectiveType?: MissionObjectiveType;
  hint?: string;
  radius?: number;
  effects?: MissionObjectiveEffect[];
}

export type GameScreen = 'menu' | 'playing' | 'paused' | 'mission-complete' | 'game-over';

export interface CityZone {
  id: string;
  name: string;
  subtitle: string;
  center: [number, number, number];
  radius: number;
  color: string;
}

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  vehicles: Vehicle[];
  npcs: NPC[];
  missions: Mission[];
  activeMission: string | null;
  timeOfDay: number;
  cities: CityZone[];
  lastCompletedMission: string | null;
}
