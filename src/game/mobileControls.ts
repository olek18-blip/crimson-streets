import { create } from 'zustand';

type MobileControlsState = {
  axisX: number;
  axisY: number;
  sprint: boolean;
  shooting: boolean;
  setAxis: (axisX: number, axisY: number) => void;
  setSprint: (sprint: boolean) => void;
  setShooting: (shooting: boolean) => void;
  reset: () => void;
};

export const useMobileControlsStore = create<MobileControlsState>((set) => ({
  axisX: 0,
  axisY: 0,
  sprint: false,
  shooting: false,
  setAxis: (axisX, axisY) => set({ axisX, axisY }),
  setSprint: (sprint) => set({ sprint }),
  setShooting: (shooting) => set({ shooting }),
  reset: () => set({ axisX: 0, axisY: 0, sprint: false, shooting: false }),
}));
