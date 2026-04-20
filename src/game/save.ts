import type { GameState, GameScreen } from './types';

const SAVE_KEY = 'crimson-streets-save-v1';

type PersistedGameState = Pick<
  GameState,
  'player' | 'vehicles' | 'npcs' | 'missions' | 'activeMission' | 'timeOfDay' | 'lastCompletedMission'
> & {
  version: 1;
  savedAt: string;
};

const AUTOSAVE_SCREENS: GameScreen[] = ['playing', 'paused', 'mission-complete'];

export function shouldAutosave(screen: GameScreen) {
  return AUTOSAVE_SCREENS.includes(screen);
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined' || !shouldAutosave(state.screen)) {
    return;
  }

  const payload: PersistedGameState = {
    version: 1,
    savedAt: new Date().toISOString(),
    player: state.player,
    vehicles: state.vehicles,
    npcs: state.npcs,
    missions: state.missions,
    activeMission: state.activeMission,
    timeOfDay: state.timeOfDay,
    lastCompletedMission: state.lastCompletedMission,
  };

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

export function loadGameState(): Partial<GameState> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedGameState>;

    if (!parsed.player || !Array.isArray(parsed.vehicles) || !Array.isArray(parsed.npcs) || !Array.isArray(parsed.missions)) {
      return null;
    }

    return {
      screen: 'playing',
      player: parsed.player,
      vehicles: parsed.vehicles,
      npcs: parsed.npcs,
      missions: parsed.missions,
      activeMission: typeof parsed.activeMission === 'string' ? parsed.activeMission : null,
      timeOfDay: typeof parsed.timeOfDay === 'number' ? parsed.timeOfDay : 12,
      lastCompletedMission: typeof parsed.lastCompletedMission === 'string' ? parsed.lastCompletedMission : null,
    };
  } catch {
    clearSavedGame();
    return null;
  }
}

export function hasSavedGame() {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!window.localStorage.getItem(SAVE_KEY);
}

export function clearSavedGame() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SAVE_KEY);
}
