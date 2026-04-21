import { useEffect } from 'react';
import { useGameStore } from '../game/store';
import { saveGameState, shouldAutosave } from '../game/save';

const SAVE_INTERVAL_MS = 4000;

export function useGamePersistence() {
  useEffect(() => {
    const flushSave = () => {
      const state = useGameStore.getState();
      if (shouldAutosave(state.screen)) {
        saveGameState(state);
      }
    };

    const intervalId = window.setInterval(flushSave, SAVE_INTERVAL_MS);
    const unsubscribe = useGameStore.subscribe((state, previousState) => {
      const enteredStableScreen =
        shouldAutosave(state.screen) &&
        (state.screen !== previousState.screen || state.activeMission !== previousState.activeMission || state.lastCompletedMission !== previousState.lastCompletedMission);

      if (enteredStableScreen) {
        flushSave();
      }
    });

    window.addEventListener('beforeunload', flushSave);
    window.addEventListener('visibilitychange', flushSave);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', flushSave);
      window.removeEventListener('visibilitychange', flushSave);
      window.clearInterval(intervalId);
    };
  }, []);
}
