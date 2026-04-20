import { useMemo } from 'react';
import { useGameStore } from '../../game/store';
import { cities, WORLD_SIZE } from '../../game/worldData';

export default function Minimap() {
  const { player, missions, activeMission, npcs } = useGameStore();
  const mapSize = 180;
  const scale = mapSize / (WORLD_SIZE * 2);

  const activeObjective = useMemo(() => {
    const mission = missions.find((item) => item.id === activeMission);
    return mission?.objectives.find((item) => !item.completed && item.targetPosition) ?? null;
  }, [missions, activeMission]);

  const toMap = (wx: number, wz: number) => ({
    x: (wx + WORLD_SIZE) * scale,
    y: (wz + WORLD_SIZE) * scale,
  });

  const playerMap = toMap(player.position[0], player.position[2]);

  return (
    <div className="absolute bottom-4 right-4 pointer-events-none hidden sm:block" style={{ width: mapSize, height: mapSize + 28 }}>
      <div className="mb-2 px-2 flex items-center justify-between text-[9px] font-display tracking-[0.2em] text-muted-foreground">
        <span>MINIMAPA</span>
        {activeObjective?.targetPosition && <span className="text-amber-300">OBJETIVO</span>}
      </div>

      <div
        className="relative w-full h-[180px] rounded-xl overflow-hidden border"
        style={{
          borderColor: 'hsl(var(--border) / 0.45)',
          background: 'radial-gradient(circle at center, rgba(15,23,42,0.92), rgba(2,6,23,0.95))',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }} />

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
                background: `${city.color}22`,
                border: `1px solid ${city.color}50`,
              }}
            >
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-display tracking-wider whitespace-nowrap"
                style={{ color: city.color }}
              >
                {city.name}
              </span>
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapSize} ${mapSize}`}>
          {[
            [[40, 0], [140, -120]],
            [[40, 40], [100, 150]],
            [[-40, 40], [-120, 130]],
            [[-40, -40], [-80, -160]],
            [[180, -80], [160, 110]],
            [[-140, 90], [-130, -120]],
          ].map(([startPoint, endPoint], index) => {
            const start = toMap(startPoint[0], startPoint[1]);
            const end = toMap(endPoint[0], endPoint[1]);
            return (
              <line
                key={index}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.55"
                strokeDasharray="3 4"
              />
            );
          })}
        </svg>

        {npcs.filter((item) => item.isAlive && item.city === player.currentCity).slice(0, 16).map((npc) => {
          const pos = toMap(npc.position[0], npc.position[2]);
          const color = npc.type === 'police' ? '#60a5fa' : npc.type === 'gang' ? '#f87171' : '#cbd5e1';
          return (
            <div
              key={npc.id}
              className="absolute rounded-full"
              style={{
                left: pos.x - 2,
                top: pos.y - 2,
                width: 4,
                height: 4,
                background: color,
                opacity: 0.9,
              }}
            />
          );
        })}

        {missions.filter((item) => item.status === 'available' || item.status === 'active').map((mission) => {
          const objective = mission.objectives.find((item) => !item.completed && item.targetPosition);
          if (!objective?.targetPosition) return null;
          const pos = toMap(objective.targetPosition[0], objective.targetPosition[2]);
          const isActive = mission.id === activeMission;
          return (
            <div
              key={mission.id}
              className={`absolute rounded-full ${isActive ? 'animate-pulse' : ''}`}
              style={{
                left: pos.x - (isActive ? 5 : 4),
                top: pos.y - (isActive ? 5 : 4),
                width: isActive ? 10 : 8,
                height: isActive ? 10 : 8,
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
            left: playerMap.x - 16,
            top: playerMap.y - 16,
            width: 32,
            height: 32,
            transform: `rotate(${-player.rotation * (180 / Math.PI)}deg)`,
          }}
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '18px solid rgba(244,63,94,0.22)',
              filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.35))',
            }}
          />
        </div>

        <div
          className="absolute"
          style={{
            left: playerMap.x - 5,
            top: playerMap.y - 5,
            width: 10,
            height: 10,
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
