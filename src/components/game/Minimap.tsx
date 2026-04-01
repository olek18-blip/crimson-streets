import { useGameStore } from '../../game/store';
import { cities, WORLD_SIZE } from '../../game/worldData';

export default function Minimap() {
  const { player, missions, activeMission } = useGameStore();
  const mapSize = 160;
  const scale = mapSize / (WORLD_SIZE * 2);
  
  const toMap = (wx: number, wz: number) => ({
    x: (wx + WORLD_SIZE) * scale,
    y: (wz + WORLD_SIZE) * scale,
  });

  const playerMap = toMap(player.position[0], player.position[2]);

  return (
    <div className="absolute bottom-4 right-4 pointer-events-none" style={{ width: mapSize, height: mapSize }}>
      <div className="relative w-full h-full rounded-lg overflow-hidden border" style={{
        borderColor: 'hsl(var(--border) / 0.5)',
        background: 'hsl(var(--background) / 0.8)',
        backdropFilter: 'blur(5px)',
      }}>
        {/* Cities */}
        {cities.map(city => {
          const pos = toMap(city.center[0], city.center[2]);
          const r = city.radius * scale;
          return (
            <div key={city.id} className="absolute" style={{
              left: pos.x - r,
              top: pos.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: city.color + '30',
              border: `1px solid ${city.color}60`,
            }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-display tracking-wider whitespace-nowrap"
                style={{ color: city.color }}>
                {city.name}
              </span>
            </div>
          );
        })}

        {/* Highway lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapSize} ${mapSize}`}>
          {[
            [[40, 0], [140, -120]],
            [[40, 40], [100, 150]],
            [[-40, 40], [-120, 130]],
            [[-40, -40], [-80, -160]],
            [[180, -80], [160, 110]],
            [[-140, 90], [-130, -120]],
          ].map(([s, e], i) => {
            const start = toMap(s[0], s[1]);
            const end = toMap(e[0], e[1]);
            return (
              <line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                stroke="#555" strokeWidth="1" opacity="0.5" />
            );
          })}
        </svg>

        {/* Mission markers */}
        {missions.filter(m => m.status === 'available' || m.status === 'active').map(m => {
          const obj = m.objectives.find(o => !o.completed && o.targetPosition);
          if (!obj?.targetPosition) return null;
          const pos = toMap(obj.targetPosition[0], obj.targetPosition[2]);
          const isActive = m.id === activeMission;
          return (
            <div key={m.id} className="absolute w-2 h-2 rounded-full animate-pulse" style={{
              left: pos.x - 4,
              top: pos.y - 4,
              background: isActive ? '#ffaa00' : '#ff6600',
              boxShadow: isActive ? '0 0 6px #ffaa00' : 'none',
            }} />
          );
        })}

        {/* Player */}
        <div className="absolute" style={{
          left: playerMap.x - 4,
          top: playerMap.y - 4,
          width: 8,
          height: 8,
        }}>
          <div className="w-full h-full rounded-full" style={{
            background: 'hsl(var(--primary))',
            boxShadow: '0 0 8px hsl(var(--primary))',
            transform: `rotate(${-player.rotation * (180 / Math.PI)}deg)`,
          }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0"
              style={{ borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '4px solid hsl(var(--primary))' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
