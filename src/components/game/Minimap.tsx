import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/store';
import { cities, WORLD_CONNECTIONS, WORLD_SIZE } from '../../game/worldData';
import type { NPC } from '../../game/types';

type MinimapSnapshot = {
  playerPosition: [number, number, number];
  playerRotation: number;
  currentCity: string;
  activeObjective: { targetPosition?: [number, number, number] } | null;
  visibleNpcs: NPC[];
  visibleMissions: ReturnType<typeof useGameStore.getState>['missions'];
  activeMission: string | null;
};

const IS_MOBILE = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

function readMinimapSnapshot(): MinimapSnapshot {
  const { player, missions, activeMission, npcs } = useGameStore.getState();
  const activeObjective =
    missions.find((item) => item.id === activeMission)?.objectives.find((item) => !item.completed && item.targetPosition) ?? null;

  return {
    playerPosition: player.position,
    playerRotation: player.rotation,
    currentCity: player.currentCity,
    activeObjective,
    visibleNpcs: npcs
      .filter((item) => item.isAlive && item.city === player.currentCity)
      .slice(0, IS_MOBILE ? 10 : 14),
    visibleMissions: missions.filter((item) => item.status === 'available' || item.status === 'active'),
    activeMission,
  };
}

export default function Minimap() {
  const [snapshot, setSnapshot] = useState<MinimapSnapshot>(() => readMinimapSnapshot());
  const mapSize = IS_MOBILE ? 120 : 180;
  const scale = mapSize / (WORLD_SIZE * 2);

  useEffect(() => {
    const update = () => setSnapshot(readMinimapSnapshot());
    update();
    const intervalId = window.setInterval(update, 250);
    return () => window.clearInterval(intervalId);
  }, []);

  const toMap = (wx: number, wz: number) => ({
    x: (wx + WORLD_SIZE) * scale,
    y: (wz + WORLD_SIZE) * scale,
  });

  const playerMap = toMap(snapshot.playerPosition[0], snapshot.playerPosition[2]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: mapSize,
        height: mapSize + 28,
        zIndex: 60,
        right: IS_MOBILE ? 10 : 16,
        bottom: IS_MOBILE ? 180 : 16,
      }}
    >
      <div className="mb-2 px-2 flex items-center justify-between text-[9px] font-display tracking-[0.2em] text-muted-foreground">
        <span>MINIMAPA</span>
        {snapshot.activeObjective?.targetPosition && <span className="text-amber-300">OBJETIVO</span>}
      </div>

      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          width: mapSize,
          height: mapSize,
          background: 'rgba(10,10,10,0.9)',
        }}
      >
        {snapshot.visibleNpcs.map((npc) => {
          const pos = toMap(npc.position[0], npc.position[2]);
          const color = npc.type === 'police' ? '#60a5fa' : npc.type === 'gang' ? '#f87171' : '#cbd5e1';
          return (
            <div
              key={npc.id}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: 3,
                height: 3,
                background: color,
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: playerMap.x,
            top: playerMap.y,
            width: 6,
            height: 6,
            background: '#ff3333',
          }}
        />
      </div>
    </div>
  );
}
