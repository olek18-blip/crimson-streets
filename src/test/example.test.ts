import { afterEach, describe, expect, it } from "vitest";
import { saveGameState } from "@/game/save";
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

  it("continues the saved story state instead of starting over", () => {
    useGameStore.getState().startGame();
    useGameStore.getState().addMoney(750);
    useGameStore.getState().setWantedLevel(2);
    useGameStore.getState().startMission("mission1");
    saveGameState(useGameStore.getState());

    useGameStore.getState().resetGame();
    useGameStore.getState().continueGame();

    const state = useGameStore.getState();
    expect(state.screen).toBe("playing");
    expect(state.player.money).toBe(1250);
    expect(state.player.wantedLevel).toBe(2);
    expect(state.activeMission).toBe("mission1");
    expect(state.missions.find((mission) => mission.id === "mission1")?.status).toBe("active");
  });

  it("cycles through every supported on-foot weapon", () => {
    useGameStore.getState().startGame();

    useGameStore.getState().switchWeapon();
    expect(useGameStore.getState().player.weapon).toBe("knife");

    useGameStore.getState().switchWeapon();
    expect(useGameStore.getState().player.weapon).toBe("pistol");

    useGameStore.getState().switchWeapon();
    expect(useGameStore.getState().player.weapon).toBe("rifle");

    useGameStore.getState().switchWeapon();
    expect(useGameStore.getState().player.weapon).toBe("fist");
  });
});
