import { create } from 'zustand';
import type { GameMode, GameState, MapEditorState, MissionObjectiveEffect, NPC, PlacedProp, PlayerAnimationState, PlayerState, PlaceableType } from './types';
import { cities, initialVehicles, initialNPCs, initialMissions } from './worldData';
import { clearSavedGame, loadGameState } from './save';

const INTRO_MISSION_ID = 'mission1';
const EXPLORATION_MODE = true;
const MAP_EDITOR_STORAGE_KEY = 'crimson_map_editor_v1';

function safeLoadEditorState(): MapEditorState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MAP_EDITOR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MapEditorState;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.placed)) return null;
    return {
      enabled: Boolean(parsed.enabled),
      view: parsed.view === '2d' ? '2d' : '3d',
      selected: parsed.selected ?? 'building',
      rotationY: typeof parsed.rotationY === 'number' ? parsed.rotationY : 0,
      placed: parsed.placed,
    };
  } catch {
    return null;
  }
}

function safeSaveEditorState(editor: MapEditorState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MAP_EDITOR_STORAGE_KEY, JSON.stringify(editor));
  } catch {
    // ignore
  }
}

const initialPlayer: PlayerState = {
  position: [6, 0.5, -36],
  rotation: -0.42,
  health: 100,
  armor: 0,
  money: 500,
  wantedLevel: 0,
  inVehicle: false,
  currentVehicle: null,
  weapon: 'fist',
  isShooting: false,
  isRunning: false,
  currentCity: 'madrona',
  animationState: 'idle',
};

interface GameStore extends GameState {
  startGame: () => void;
  startBuildMode: () => void;
  continueGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  updatePlayerRotation: (rot: number) => void;
  updateVehicleTransform: (id: string, position: [number, number, number], rotation: number) => void;
  updateNPCTransform: (id: string, position: [number, number, number], rotation: number) => void;
  updateNPCTransforms: (updates: Array<{ id: string; position: [number, number, number]; rotation: number }>) => void;
  setPlayerInVehicle: (vehicleId: string | null) => void;
  takeDamage: (amount: number) => void;
  addMoney: (amount: number) => void;
  setWantedLevel: (level: number) => void;
  setShooting: (shooting: boolean) => void;
  setRunning: (running: boolean) => void;
  setPlayerAnimationState: (animationState: PlayerAnimationState) => void;
  startMission: (id: string) => void;
  completeMissionObjective: (missionId: string, objectiveId: string) => void;
  completeMission: (id: string) => void;
  damageNPC: (id: string, amount: number) => void;
  switchWeapon: () => void;
  registerShot: (weapon: PlayerState['weapon']) => void;
  toggleEditor: () => void;
  openEditor: (view?: MapEditorState['view']) => void;
  closeEditor: () => void;
  setEditorView: (view: MapEditorState['view']) => void;
  setEditorSelected: (selected: PlaceableType) => void;
  rotateEditor: () => void;
  placeEditorProp: (prop: Omit<PlacedProp, 'id'>) => void;
  removeEditorPropNear: (position: [number, number, number], radius: number) => void;
  gameOver: () => void;
  resetGame: () => void;
}

const deepCopy = <T,>(arr: T[]): T[] => JSON.parse(JSON.stringify(arr));

function applyObjectiveEffects(
  player: PlayerState,
  npcs: NPC[],
  effects: MissionObjectiveEffect[] | undefined,
): Pick<GameState, 'player' | 'npcs'> {
  if (!effects?.length) {
    return { player, npcs };
  }

  let nextPlayer = player;
  let nextNPCs = npcs;

  for (const effect of effects) {
    if (effect.type === 'add-money') {
      nextPlayer = { ...nextPlayer, money: nextPlayer.money + effect.amount };
      continue;
    }

    if (effect.type === 'set-min-wanted-level') {
      nextPlayer = {
        ...nextPlayer,
        wantedLevel: Math.max(nextPlayer.wantedLevel, effect.level),
      };
      continue;
    }

    if (effect.type === 'set-wanted-level') {
      nextPlayer = { ...nextPlayer, wantedLevel: effect.level };
      continue;
    }

    if (effect.type === 'set-npc-hostility') {
      nextNPCs = nextNPCs.map((npc) => {
        if (npc.city !== effect.city) {
          return npc;
        }

        if (effect.npcType && npc.type !== effect.npcType) {
          return npc;
        }

        return { ...npc, isHostile: effect.hostile };
      });
    }
  }

  return { player: nextPlayer, npcs: nextNPCs };
}

function createEditorState(enabled = false, view: MapEditorState['view'] = '3d'): MapEditorState {
  const saved = safeLoadEditorState();
  return saved
    ? { ...saved, enabled, view }
    : ({
      enabled,
      view,
      selected: 'building',
      rotationY: 0,
      placed: [],
    } satisfies MapEditorState);
}

const createFreshState = (gameMode: GameMode = 'story'): Omit<GameState, 'screen'> => ({
  gameMode,
  player: { ...initialPlayer },
  vehicles: deepCopy(initialVehicles),
  npcs: deepCopy(initialNPCs),
  missions: deepCopy(initialMissions),
  cities,
  activeMission: null,
  timeOfDay: 12,
  lastCompletedMission: null,
  shotTick: 0,
  lastShotWeapon: null,
  editor: createEditorState(gameMode === 'build', gameMode === 'build' ? '2d' : '3d'),
});

// We keep the intro mission data, but we don't auto-activate it on start anymore.

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  ...createFreshState(),

  startGame: () => {
    clearSavedGame();
    set({
      screen: 'playing',
      ...createFreshState('story'),
    });
  },

  startBuildMode: () => {
    set({
      screen: 'playing',
      ...createFreshState('build'),
      editor: { ...createEditorState(true, '2d'), enabled: true, view: '2d' },
    });
  },

  continueGame: () => {
    const saved = loadGameState();

    if (!saved) {
      set({
        screen: 'playing',
        ...createFreshState('story'),
      });
      return;
    }

    // For now we always start in exploration mode (no active mission, no combat),
    // even if a previous session had a mission running.
    set({
      screen: 'playing',
      ...createFreshState('story'),
    });
  },

  pauseGame: () => set({ screen: 'paused' }),

  resumeGame: () =>
    set((state) => ({
      screen: 'playing',
      ...(state.screen === 'mission-complete' ? { lastCompletedMission: null } : {}),
    })),

  updatePlayerPosition: (pos) => {
    let currentCity = 'rural';

    for (const city of cities) {
      const dx = pos[0] - city.center[0];
      const dz = pos[2] - city.center[2];
      if (Math.sqrt(dx * dx + dz * dz) < city.radius) {
        currentCity = city.id;
        break;
      }
    }

    set((state) => ({ player: { ...state.player, position: pos, currentCity } }));
  },

  updatePlayerRotation: (rot) => set((state) => ({ player: { ...state.player, rotation: rot } })),

  updateVehicleTransform: (id, position, rotation) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, position, rotation } : vehicle)),
    })),

  updateNPCTransform: (id, position, rotation) =>
    set((state) => ({
      npcs: state.npcs.map((npc) => (npc.id === id ? { ...npc, position, rotation } : npc)),
    })),

  updateNPCTransforms: (updates) =>
    set((state) => {
      if (updates.length === 0) {
        return state;
      }

      const updateMap = new Map(updates.map((update) => [update.id, update]));

      return {
        npcs: state.npcs.map((npc) => {
          const update = updateMap.get(npc.id);
          return update ? { ...npc, position: update.position, rotation: update.rotation } : npc;
        }),
      };
    }),

  setPlayerInVehicle: (vehicleId) =>
    set((state) => {
      if (!vehicleId) {
        // Exit vehicle: place player next to the car.
        const exitOffset: [number, number, number] = [
          Math.cos(state.player.rotation + Math.PI / 2) * 1.2,
          0,
          Math.sin(state.player.rotation + Math.PI / 2) * 1.2,
        ];

        return {
          player: {
            ...state.player,
            inVehicle: false,
            currentVehicle: null,
            position: [state.player.position[0] + exitOffset[0], state.player.position[1], state.player.position[2] + exitOffset[2]],
            isShooting: false,
          },
        };
      }

      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) return state;

      return {
        player: {
          ...state.player,
          inVehicle: true,
          currentVehicle: vehicleId,
          position: [...vehicle.position] as [number, number, number],
          rotation: vehicle.rotation,
          isShooting: false,
        },
      };
    }),

  takeDamage: (amount) => {
    if (EXPLORATION_MODE) {
      return;
    }
    const state = get();
    const newHealth = Math.max(0, state.player.health - amount);

    if (newHealth <= 0) {
      set({
        player: { ...state.player, health: 0, animationState: 'death' },
        screen: 'game-over',
      });
      return;
    }

    set({
      player: {
        ...state.player,
        health: newHealth,
        animationState: 'hit',
      },
    });
  },

  addMoney: (amount) => set((state) => ({ player: { ...state.player, money: state.player.money + amount } })),

  setWantedLevel: (level) =>
    set((state) => ({
      player: { ...state.player, wantedLevel: Math.min(5, Math.max(0, level)) },
    })),

  setShooting: (shooting) => set((state) => ({ player: { ...state.player, isShooting: shooting } })),

  setRunning: (running) => set((state) => ({ player: { ...state.player, isRunning: running } })),

  setPlayerAnimationState: (animationState) =>
    set((state) => ({
      player: { ...state.player, animationState },
    })),

  startMission: (id) =>
    set((state) => ({
      activeMission: id,
      missions: state.missions.map((mission) =>
        mission.id === id ? { ...mission, status: 'active' as const } : mission,
      ),
    })),

  completeMissionObjective: (missionId, objectiveId) =>
    set((state) => {
      const mission = state.missions.find((item) => item.id === missionId);
      const objective = mission?.objectives.find((item) => item.id === objectiveId);

      const nextMissions = state.missions.map((existingMission) =>
        existingMission.id === missionId
          ? {
              ...existingMission,
              objectives: existingMission.objectives.map((existingObjective) =>
                existingObjective.id === objectiveId ? { ...existingObjective, completed: true } : existingObjective,
              ),
            }
          : existingMission,
      );

      const nextState = applyObjectiveEffects(state.player, state.npcs, objective?.effects);

      return {
        missions: nextMissions,
        ...nextState,
      };
    }),

  completeMission: (id) => {
    const mission = get().missions.find((item) => item.id === id);

    if (!mission) {
      return;
    }

    set((state) => ({
      screen: 'mission-complete',
      activeMission: null,
      lastCompletedMission: id,
      player: {
        ...state.player,
        money: state.player.money + mission.reward,
        wantedLevel: id === INTRO_MISSION_ID ? 0 : state.player.wantedLevel,
      },
      missions: state.missions.map((item) =>
        item.id === id ? { ...item, status: 'completed' as const } : item,
      ),
    }));
  },

  damageNPC: (id, amount) =>
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== id) {
          return npc;
        }

        const newHealth = Math.max(0, npc.health - amount);
        return { ...npc, health: newHealth, isAlive: newHealth > 0 };
      }),
    })),

  switchWeapon: () =>
    set((state) => {
      // Exploration mode: keep weapons simple until attachments/animations are solid.
      const weapons: ('fist' | 'knife' | 'pistol')[] = ['fist', 'knife', 'pistol'];
      const currentIndex = weapons.indexOf(state.player.weapon);

      if (state.player.inVehicle) {
        return state;
      }

      return {
        player: {
          ...state.player,
          weapon: weapons[(currentIndex + 1) % weapons.length] ?? 'fist',
          isShooting: false,
        },
      };
    }),

  registerShot: (weapon) =>
    set((state) => ({
      shotTick: state.shotTick + 1,
      lastShotWeapon: weapon,
    })),

  toggleEditor: () =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, enabled: !state.editor.enabled };
      safeSaveEditorState(next);
      return { editor: next, gameMode: next.enabled ? 'build' : 'story' };
    }),

  openEditor: (view = '3d') =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, enabled: true, view };
      safeSaveEditorState(next);
      return { editor: next, gameMode: 'build' };
    }),

  closeEditor: () =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, enabled: false };
      safeSaveEditorState(next);
      return { editor: next, gameMode: 'story' };
    }),

  setEditorView: (view) =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, view };
      safeSaveEditorState(next);
      return { editor: next };
    }),

  setEditorSelected: (selected) =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, selected };
      safeSaveEditorState(next);
      return { editor: next };
    }),

  rotateEditor: () =>
    set((state) => {
      const next: MapEditorState = { ...state.editor, rotationY: (state.editor.rotationY + Math.PI / 2) % (Math.PI * 2) };
      safeSaveEditorState(next);
      return { editor: next };
    }),

  placeEditorProp: (prop) =>
    set((state) => {
      const nextProp: PlacedProp = {
        id: `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`,
        ...prop,
      };
      const next: MapEditorState = { ...state.editor, placed: [...state.editor.placed, nextProp] };
      safeSaveEditorState(next);
      return { editor: next };
    }),

  removeEditorPropNear: (position, radius) =>
    set((state) => {
      const r2 = radius * radius;
      const nextPlaced = state.editor.placed.filter((p) => {
        const dx = p.position[0] - position[0];
        const dz = p.position[2] - position[2];
        return dx * dx + dz * dz > r2;
      });
      const next: MapEditorState = { ...state.editor, placed: nextPlaced };
      safeSaveEditorState(next);
      return { editor: next };
    }),

  gameOver: () => set({ screen: 'game-over' }),

  resetGame: () =>
    set({
      screen: 'menu',
      ...createFreshState('story'),
    }),
}));
