import { useGameStore } from '../../game/store';

export default function GameHUD() {
  const { player, missions, activeMission } = useGameStore();
  const mission = missions.find(m => m.id === activeMission);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Health & Armor */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="game-panel rounded px-3 py-2 min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-display tracking-wider" style={{ color: 'hsl(var(--game-health))' }}>HEALTH</span>
            <span className="text-xs ml-auto font-bold" style={{ color: 'hsl(var(--game-health))' }}>{player.health}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${player.health}%`,
              background: `linear-gradient(90deg, hsl(var(--game-danger)), hsl(var(--game-health)))`,
            }} />
          </div>
        </div>
        {player.armor > 0 && (
          <div className="game-panel rounded px-3 py-2 min-w-[180px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-display tracking-wider" style={{ color: 'hsl(var(--game-armor))' }}>ARMOR</span>
              <span className="text-xs ml-auto font-bold" style={{ color: 'hsl(var(--game-armor))' }}>{player.armor}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
              <div className="h-full rounded-full" style={{ width: `${player.armor}%`, background: 'hsl(var(--game-armor))' }} />
            </div>
          </div>
        )}
      </div>

      {/* Money & Weapon */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        <div className="game-panel rounded px-4 py-2">
          <span className="font-display text-xl tracking-wider" style={{ color: 'hsl(var(--game-money))' }}>
            ${player.money.toLocaleString()}
          </span>
        </div>
        <div className="game-panel rounded px-3 py-1">
          <span className="font-display text-sm tracking-wider text-foreground uppercase">
            {player.weapon === 'fist' ? '👊 Fists' : player.weapon === 'pistol' ? '🔫 Pistol' : '🔫 Rifle'}
          </span>
        </div>
      </div>

      {/* Wanted Level */}
      {player.wantedLevel > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="game-panel rounded px-4 py-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-lg" style={{ opacity: i < player.wantedLevel ? 1 : 0.2 }}>⭐</span>
            ))}
          </div>
        </div>
      )}

      {/* Mission Tracker */}
      {mission && (
        <div className="absolute bottom-24 left-4 max-w-xs">
          <div className="game-panel rounded p-3">
            <h3 className="font-display text-sm tracking-wider" style={{ color: 'hsl(var(--game-gold))' }}>
              {mission.title}
            </h3>
            <div className="mt-2 flex flex-col gap-1">
              {mission.objectives.map(obj => (
                <div key={obj.id} className="flex items-center gap-2">
                  <span className={`text-xs ${obj.completed ? 'line-through opacity-50' : ''}`}>
                    {obj.completed ? '✅' : '⬜'} {obj.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="game-panel rounded px-4 py-2 flex gap-4 text-xs text-muted-foreground font-display tracking-wider">
          <span>WASD Move</span>
          <span>SHIFT Run</span>
          <span>F Vehicle</span>
          <span>Q Weapon</span>
          <span>CLICK Shoot</span>
        </div>
      </div>

      {/* Vehicle indicator */}
      {player.inVehicle && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="game-panel rounded px-3 py-1">
            <span className="font-display text-xs tracking-wider" style={{ color: 'hsl(var(--game-armor))' }}>
              🚗 IN VEHICLE — Press F to exit
            </span>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {player.weapon !== 'fist' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center" style={{ borderColor: 'hsl(var(--primary) / 0.7)' }}>
            <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
          </div>
        </div>
      )}
    </div>
  );
}
