import { useGameStore } from '../../game/store';
import { cities } from '../../game/worldData';

export default function GameHUD() {
  const { player, missions, activeMission } = useGameStore();
  const mission = missions.find(m => m.id === activeMission);
  const cityData = cities.find(c => c.id === player.currentCity);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Current City */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        {player.wantedLevel > 0 && (
          <div className="game-panel rounded px-4 py-1 mb-2 flex gap-1 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-lg" style={{ opacity: i < player.wantedLevel ? 1 : 0.2 }}>⭐</span>
            ))}
          </div>
        )}
        <div className="game-panel rounded px-4 py-1">
          <span className="font-display text-lg tracking-widest" style={{ color: cityData?.color || 'hsl(var(--foreground))' }}>
            {cityData?.name || 'ZONA RURAL'}
          </span>
          {cityData && (
            <span className="block text-[10px] text-muted-foreground">{cityData.subtitle}</span>
          )}
        </div>
      </div>

      {/* Health & Armor */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="game-panel rounded px-3 py-2 min-w-[160px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-display tracking-wider" style={{ color: 'hsl(var(--game-health))' }}>SALUD</span>
            <span className="text-[10px] ml-auto font-bold" style={{ color: 'hsl(var(--game-health))' }}>{player.health}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${player.health}%`,
              background: player.health > 50 ? 'hsl(var(--game-health))' : player.health > 25 ? '#cc8800' : 'hsl(var(--game-danger))',
            }} />
          </div>
        </div>
      </div>

      {/* Money & Weapon */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        <div className="game-panel rounded px-3 py-1.5">
          <span className="font-display text-lg tracking-wider" style={{ color: 'hsl(var(--game-money))' }}>
            ${player.money.toLocaleString()}
          </span>
        </div>
        <div className="game-panel rounded px-3 py-1">
          <span className="font-display text-xs tracking-wider text-foreground uppercase">
            {player.weapon === 'fist' ? '👊 Puños' : player.weapon === 'pistol' ? '🔫 Pistola' : '🔫 Rifle'}
          </span>
        </div>
      </div>

      {/* Mission Tracker */}
      {mission && (
        <div className="absolute bottom-44 left-4 max-w-xs">
          <div className="game-panel rounded p-3">
            <h3 className="font-display text-sm tracking-wider" style={{ color: 'hsl(var(--game-gold))' }}>
              📋 {mission.title}
            </h3>
            <div className="mt-2 flex flex-col gap-1">
              {mission.objectives.map(obj => (
                <div key={obj.id} className="flex items-center gap-2">
                  <span className={`text-[11px] ${obj.completed ? 'line-through opacity-50' : ''}`}>
                    {obj.completed ? '✅' : '⬜'} {obj.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Available missions list */}
      {!activeMission && (
        <div className="absolute bottom-44 left-4 max-w-xs">
          <div className="game-panel rounded p-3">
            <h3 className="font-display text-xs tracking-wider text-muted-foreground mb-2">MISIONES DISPONIBLES</h3>
            {missions.filter(m => m.status === 'available').slice(0, 3).map(m => {
              const mCity = cities.find(c => c.id === m.city);
              return (
                <div key={m.id} className="text-[10px] mb-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: mCity?.color || '#888' }} />
                  <span className="text-foreground">{m.title}</span>
                  <span className="text-muted-foreground">— {mCity?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4">
        <div className="game-panel rounded px-3 py-1.5 flex gap-3 text-[9px] text-muted-foreground font-display tracking-wider">
          <span>WASD Mover</span>
          <span>SHIFT Correr</span>
          <span>F Vehículo</span>
          <span>Q Arma</span>
          <span>CLICK Disparar</span>
        </div>
      </div>

      {/* Vehicle indicator */}
      {player.inVehicle && (
        <div className="absolute bottom-12 left-4">
          <div className="game-panel rounded px-3 py-1">
            <span className="font-display text-[10px] tracking-wider" style={{ color: 'hsl(var(--game-armor))' }}>
              🚗 EN VEHÍCULO — F para salir
            </span>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {player.weapon !== 'fist' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border rounded-full flex items-center justify-center" style={{ borderColor: 'hsl(var(--primary) / 0.6)' }}>
            <div className="w-0.5 h-0.5 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
          </div>
        </div>
      )}
    </div>
  );
}
