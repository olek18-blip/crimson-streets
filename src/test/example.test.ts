import { afterEach, describe, expect, it } from "vitest";
import { useGameStore } from "@/game/store";

describe("mission objective effects", () => {
  afterEach(() => {
    useGameStore.getState().resetGame();
    window.localStorage.clear();
  });

  it("applies scripted rewards and pressure beats from Dirty Patrol", () => {
    const store = useGameStore.getState();
    store.startGame();

    store.completeMissionObjective("mission1", "obj3");
    let state = useGameStore.getState();
    expect(state.player.money).toBe(1300);

    store.completeMissionObjective("mission1", "obj4");
    state = useGameStore.getState();
    expect(state.player.wantedLevel).toBe(1);

    store.completeMissionObjective("mission1", "obj5");
    state = useGameStore.getState();
    expect(state.player.wantedLevel).toBe(2);
    expect(state.npcs.filter((npc) => npc.city === "madrona" && npc.type === "gang").every((npc) => npc.isHostile)).toBe(true);

    store.completeMissionObjective("mission1", "obj6");
    state = useGameStore.getState();
    expect(state.player.wantedLevel).toBe(3);

    store.completeMissionObjective("mission1", "obj7");
    state = useGameStore.getState();
    expect(state.player.wantedLevel).toBe(1);
  });
});
