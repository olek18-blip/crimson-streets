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

function readMinimapSnapshot(): MinimapSnapshot {
  const { player, missions, activeMission, npcs } = useGameStore.getState();
  const activeObjective =
    missions.find((item) => item.id === activeMission)?.objectives.find((item) => !item.completed && item.targetPosition) ?? null;

  return {
    playerPosition: player.position,
    playerRotation: player.rotation,
    currentCity: player.currentCity,
    activeObjective,
    visibleNpcs: npcs.filter((item) => item.isAlive && item.city === player.currentCity).slice(0, 20),
    visibleMissions: missions.filter((item) => item.status === 'available' || item.status === 'active'),
    activeMission,
  };
}

export default function Minimap() {
  const [snapshot, setSnapshot] = useState<MinimapSnapshot>(() => readMinimapSnapshot());
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const mapSize = isMobile ? 132 : 190;
  const scale = mapSize / (WORLD_SIZE * 2);

  useEffect(() => {
    const update = () => setSnapshot(readMinimapSnapshot());
    update();
    const intervalId = window.setInterval(update, 120);
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
        height: mapSize + (isMobile ? 18 : 24),
        zIndex: 60,
        right: isMobile ? 10 : 16,
        bottom: isMobile ? 188 : 16,
      }}
    >
      <div className="mb-1 px-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-display tracking-[0.18em] text-muted-foreground">
        <span>MAP</span>
        <span className="text-[7px] sm:text-[8px]" style={{ color: cities.find((city) => city.id === snapshot.currentCity)?.color ?? '#cbd5e1' }}>
          {snapshot.currentCity === 'rural' ? 'RURAL' : cities.find((city) => city.id === snapshot.currentCity)?.name ?? 'RURAL'}
        </span>
      </div>

      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          width: mapSize,
          height: mapSize,
          borderColor: 'hsl(var(--border) / 0.5)',
          background: 'radial-gradient(circle at center, rgba(15,23,42,0.94), rgba(2,6,23,0.98))',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: isMobile ? '14px 14px' : '18px 18px',
          }}
        />

        {cities.map((city) => {
          const pos = toMap(city.center[0], city.center[2]);
          const r = city.radius * scale;
          return (
            <div
              key={city.id}
              className="absolute"
              style={{
                left: pos.x - r,
                top: pos.y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                background: `${city.color}20`,
                border: `1px solid ${city.color}50`,
              }}
            >
              {!isMobile && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-display tracking-wider whitespace-nowrap"
                  style={{ color: city.color }}
                >
                  {city.name}
                </span>
              )}
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapSize} ${mapSize}`}>
          {WORLD_CONNECTIONS.map(([startPoint, endPoint], index) => {
            const start = toMap(startPoint[0], startPoint[1]);
            const end = toMap(endPoint[0], endPoint[1]);
            return (
              <line
                key={index}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#7c8ca4"
                strokeWidth={isMobile ? '0.9' : '1.1'}
                opacity="0.55"
                strokeDasharray="3 4"
              />
            );
          })}
        </svg>

        {snapshot.visibleNpcs.map((npc) => {
          const pos = toMap(npc.position[0], npc.position[2]);
          const color = npc.type === 'police' ? '#60a5fa' : npc.type === 'gang' ? '#f87171' : '#cbd5e1';
          return (
            <div
              key={npc.id}
              className="absolute rounded-full"
              style={{
                left: pos.x - 2,
                top: pos.y - 2,
                width: isMobile ? 3 : 4,
                height: isMobile ? 3 : 4,
                background: color,
                opacity: 0.95,
              }}
            />
          );
        })}

        {snapshot.visibleMissions.map((mission) => {
          const objective = mission.objectives.find((item) => !item.completed && item.targetPosition);
          if (!objective?.targetPosition) return null;
          const pos = toMap(objective.targetPosition[0], objective.targetPosition[2]);
          const isActive = mission.id === snapshot.activeMission;
          const size = isActive ? (isMobile ? 8 : 10) : isMobile ? 6 : 8;
          return (
            <div
              key={mission.id}
              className={`absolute rounded-full ${isActive ? 'animate-pulse' : ''}`}
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
                background: isActive ? '#fbbf24' : '#f97316',
                boxShadow: isActive ? '0 0 12px rgba(251,191,36,0.8)' : '0 0 8px rgba(249,115,22,0.5)',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
          );
        })}

        <div
          className="absolute"
          style={{
            left: playerMap.x - (isMobile ? 12 : 16),
            top: playerMap.y - (isMobile ? 12 : 16),
            width: isMobile ? 24 : 32,
            height: isMobile ? 24 : 32,
            transform: `rotate(${-snapshot.playerRotation * (180 / Math.PI)}deg)`,
          }}
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${isMobile ? 6 : 8}px solid transparent`,
              borderRight: `${isMobile ? 6 : 8}px solid transparent`,
              borderBottom: `${isMobile ? 13 : 18}px solid rgba(244,63,94,0.24)`,
              filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.35))',
            }}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: playerMap.x - (isMobile ? 4 : 5),
            top: playerMap.y - (isMobile ? 4 : 5),
            width: isMobile ? 8 : 10,
            height: isMobile ? 8 : 10,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'hsl(var(--primary))',
              boxShadow: '0 0 10px hsl(var(--primary))',
              border: '2px solid rgba(255,255,255,0.6)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
