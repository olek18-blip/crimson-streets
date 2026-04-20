import { useEffect } from 'react';
import { useGameStore } from '../game/store';
import { saveGameState, shouldAutosave } from '../game/save';

const SAVE_DEBOUNCE_MS = 250;

export function useGamePersistence() {
  useEffect(() => {
    let timeoutId: number | null = null;

    const flushSave = () => {
      const state = useGameStore.getState();
      if (shouldAutosave(state.screen)) {
        saveGameState(state);
      }
    };

    const unsubscribe = useGameStore.subscribe((state) => {
      if (!shouldAutosave(state.screen)) {
        return;
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        saveGameState(useGameStore.getState());
        timeoutId = null;
      }, SAVE_DEBOUNCE_MS);
    });

    window.addEventListener('beforeunload', flushSave);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', flushSave);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);
}
