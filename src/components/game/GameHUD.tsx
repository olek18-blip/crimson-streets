import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/store';
import { cities } from '../../game/worldData';
import type { Mission, MissionObjective, PlayerState } from '../../game/types';

function formatDistance(distance: number) {
  return distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`;
}

function getWeaponLabel(weapon: PlayerState['weapon']) {
  switch (weapon) {
    case 'knife':
      return 'CUCHILLO';
    case 'pistol':
      return 'PISTOLA';
    case 'rifle':
      return 'RIFLE';
    default:
      return 'PUÑOS';
  }
}

type HudSnapshot = {
  player: PlayerState;
  mission: Mission | null;
  currentObjective: MissionObjective | null;
  objectiveDistance: number | null;
  nearVehicleDistance: number | null;
};

function readHudSnapshot(): HudSnapshot {
  const { player, missions, activeMission, vehicles } = useGameStore.getState();
  const mission = missions.find((item) => item.id === activeMission) ?? null;
  const currentObjective = mission?.objectives.find((item) => !item.completed) ?? null;

  let objectiveDistance: number | null = null;
  if (currentObjective?.targetPosition) {
    const dx = currentObjective.targetPosition[0] - player.position[0];
    const dz = currentObjective.targetPosition[2] - player.position[2];
    objectiveDistance = Math.sqrt(dx * dx + dz * dz);
  }

  let nearVehicleDistance: number | null = null;
  if (!player.inVehicle) {
    for (const vehicle of vehicles) {
      const dx = vehicle.position[0] - player.position[0];
      const dz = vehicle.position[2] - player.position[2];
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < 4 && (nearVehicleDistance === null || d < nearVehicleDistance)) {
        nearVehicleDistance = d;
      }
    }
  }

  return {
    player,
    mission,
    currentObjective,
    objectiveDistance,
    nearVehicleDistance,
  };
}

export default function GameHUD() {
  const [snapshot, setSnapshot] = useState<HudSnapshot>(() => readHudSnapshot());
  const { player, mission, currentObjective, objectiveDistance, nearVehicleDistance } = snapshot;
  const editor = useGameStore((state) => state.editor);
  const cityData = cities.find((item) => item.id === player.currentCity);

  useEffect(() => {
    const update = () => setSnapshot(readHudSnapshot());
    update();
    const intervalId = window.setInterval(update, 120);
    return () => window.clearInterval(intervalId);
  }, []);

  const wantedLabel =
    player.wantedLevel >= 4 ? 'CAZA TOTAL' : player.wantedLevel >= 2 ? 'FUERZAS ACTIVAS' : player.wantedLevel > 0 ? 'SOSPECHOSO' : null;
  const missionMood =
    mission?.id === 'mission1'
      ? 'Patrulla sucia en Mandril: cobro, presión de banda y handoff.'
      : mission?.description;
  const showCrosshair = player.weapon === 'pistol' || player.weapon === 'rifle';

  return (
    <div className="fixed inset-0 pointer-events-none z-10 select-none">
      <div className="sm:hidden absolute top-2 left-2 right-2 flex flex-col gap-2">
        <div className="game-panel rounded-xl px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[9px] tracking-[0.22em] text-slate-400 font-display">{cityData?.name || 'RURAL'}</div>
              <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${player.health}%`,
                    background: player.health > 50 ? 'hsl(var(--game-health))' : player.health > 25 ? '#cc8800' : 'hsl(var(--game-danger))',
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] tracking-[0.18em] text-slate-400 font-display">DINERO</div>
              <div className="text-sm font-display" style={{ color: 'hsl(var(--game-money))' }}>${player.money}</div>
            </div>
          </div>
        </div>

        {mission && currentObjective && (
          <div className="game-panel rounded-xl px-3 py-2 border border-amber-400/15">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[9px] tracking-[0.2em] text-amber-300 font-display">MISIÓN</div>
                <div className="text-[12px] text-white leading-snug mt-1">{currentObjective.text}</div>
                {objectiveDistance !== null && <div className="text-[10px] text-slate-400 mt-1">{formatDistance(objectiveDistance)}</div>}
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] tracking-[0.18em] text-slate-400 font-display">ARMA</div>
                <div className="text-[10px] text-white mt-1">{getWeaponLabel(player.weapon)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {player.wantedLevel > 0 && (
        <div className="sm:hidden absolute top-[7.6rem] left-1/2 -translate-x-1/2">
          <div className="game-panel rounded-full px-3 py-1.5 flex items-center gap-2 border border-red-300/12 shadow-[0_0_18px_rgba(127,29,29,0.16)]">
            <div className="flex gap-1 text-sm leading-none">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} style={{ opacity: index < player.wantedLevel ? 1 : 0.18 }}>★</span>
              ))}
            </div>
            {wantedLabel && <span className="text-[9px] font-display tracking-[0.18em] text-red-300">{wantedLabel}</span>}
          </div>
        </div>
      )}

      <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 text-center flex-col items-center gap-2 w-[92vw] max-w-md sm:top-4 sm:w-auto">
        {player.wantedLevel > 0 && (
          <div className="game-panel rounded px-3 py-1.5 flex flex-col items-center min-w-[180px]">
            <div className="flex gap-1 justify-center text-lg leading-none">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} style={{ opacity: index < player.wantedLevel ? 1 : 0.22 }}>★</span>
              ))}
            </div>
            {wantedLabel && <span className="text-[10px] font-display tracking-[0.22em] text-red-300 mt-1">{wantedLabel}</span>}
          </div>
        )}

        <div className="game-panel rounded px-4 py-2 min-w-[220px] max-w-[92vw]">
          <span className="font-display text-lg tracking-widest" style={{ color: cityData?.color || 'hsl(var(--foreground))' }}>
            {cityData?.name || 'ZONA RURAL'}
          </span>
          {cityData && <span className="block text-[10px] text-muted-foreground mt-0.5">{cityData.subtitle}</span>}
        </div>
      </div>

      <div className="hidden sm:grid absolute top-4 left-4 right-auto grid-cols-2 gap-2 min-w-[190px]">
        <div className="game-panel rounded px-3 py-2 col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-display tracking-[0.2em]" style={{ color: 'hsl(var(--game-health))' }}>SALUD</span>
            <span className="text-[10px] ml-auto font-bold" style={{ color: 'hsl(var(--game-health))' }}>{player.health}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${player.health}%`, background: player.health > 50 ? 'hsl(var(--game-health))' : player.health > 25 ? '#cc8800' : 'hsl(var(--game-danger))' }} />
          </div>
        </div>

        <div className="game-panel rounded px-3 py-2">
          <div className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-1">ESTADO</div>
          <div className="flex items-center justify-between text-[11px]"><span className="text-foreground">Ciudad</span><span style={{ color: cityData?.color || 'hsl(var(--foreground))' }}>{cityData?.name || 'RURAL'}</span></div>
          <div className="flex items-center justify-between text-[11px] mt-1"><span className="text-foreground">Vehículo</span><span className="text-muted-foreground">{player.inVehicle ? 'OCUPADO' : 'A PIE'}</span></div>
        </div>

        <div className="game-panel rounded px-3 py-2 text-right">
          <div className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-0.5">DINERO</div>
          <span className="font-display text-xl tracking-wider" style={{ color: 'hsl(var(--game-money))' }}>${player.money.toLocaleString()}</span>
        </div>

        <div className="game-panel rounded px-3 py-2 text-right col-span-2 max-w-[220px] ml-auto">
          <div className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-0.5">ARMA ACTIVA</div>
          <span className="font-display text-xs tracking-[0.2em] text-foreground uppercase">{getWeaponLabel(player.weapon)}</span>
        </div>
      </div>

      {mission && (
        <div className="hidden sm:block absolute left-4 right-auto bottom-24 max-w-sm">
          <div className="game-panel rounded-xl p-4 border border-amber-400/20 max-h-[46vh] overflow-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-display tracking-[0.22em] text-amber-300 mb-1">MISIÓN ACTIVA</div>
                <h3 className="font-display text-base tracking-[0.08em] text-foreground leading-tight">{mission.title}</h3>
                {missionMood && <div className="text-[11px] text-slate-400 mt-1 leading-snug">{missionMood}</div>}
              </div>
              {objectiveDistance !== null && <div className="text-right shrink-0"><div className="text-[10px] font-display tracking-[0.2em] text-muted-foreground">DISTANCIA</div><div className="text-sm font-semibold text-amber-200">{formatDistance(objectiveDistance)}</div></div>}
            </div>

            {currentObjective && (
              <div className="mt-3 rounded-lg px-3 py-2 bg-black/20 border border-white/5">
                <div className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-1">OBJETIVO ACTUAL</div>
                <div className="text-[12px] text-foreground leading-snug">{currentObjective.text}</div>
                {currentObjective.hint && <div className="text-[11px] text-slate-400 mt-1 leading-snug">{currentObjective.hint}</div>}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-1.5">
              {mission.objectives.map((objective, index) => {
                const currentIndex = mission.objectives.findIndex((item) => !item.completed);
                return (
                  <div key={objective.id} className="flex items-start gap-2 text-[11px] leading-snug">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5" style={{ background: objective.completed ? 'rgba(34,197,94,0.18)' : index === currentIndex ? 'rgba(245,158,11,0.16)' : 'rgba(255,255,255,0.08)', color: objective.completed ? '#86efac' : index === currentIndex ? '#fbbf24' : '#cbd5e1' }}>{objective.completed ? '✓' : index + 1}</span>
                    <span className={objective.completed ? 'line-through opacity-45' : 'text-foreground'}>{objective.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="hidden sm:block absolute bottom-4 left-4 right-auto">
        <div className="game-panel rounded px-3 py-2 flex gap-3 text-[9px] text-muted-foreground font-display tracking-wider flex-wrap justify-start max-w-[560px]">
          <span>WASD MOVER</span><span>SHIFT CORRER</span><span>F VEHÍCULO</span><span>Q ARMA</span><span>CLICK ACCIÓN</span><span>ESC PAUSA</span>
        </div>
      </div>

      {nearVehicleDistance !== null && (
        <div className="absolute bottom-16 left-2 right-2 sm:left-4 sm:right-auto sm:bottom-16">
          <div className="game-panel rounded px-3 py-2 text-center sm:text-left border border-cyan-300/15">
            <span className="font-display text-[10px] tracking-[0.16em] text-cyan-200">F PARA ENTRAR AL VEHÃCULO</span>
          </div>
        </div>
      )}

      {editor.enabled && (
        <div className="absolute bottom-28 left-2 right-2 sm:left-4 sm:right-auto sm:bottom-28">
          <div className="game-panel rounded px-3 py-2 text-center sm:text-left border border-emerald-300/15">
            <span className="font-display text-[10px] tracking-[0.14em] text-emerald-200">
              BUILD MODE: `IJKL` MOVER, `SPACE/ENTER` COLOCAR, `R` ROTAR, `X` BORRAR, `1-5` PIEZA, `B` SALIR
            </span>
          </div>
        </div>
      )}

      {player.inVehicle && (
        <div className="absolute bottom-16 left-2 right-2 sm:left-4 sm:right-auto sm:bottom-14">
          <div className="game-panel rounded px-3 py-1.5 text-center sm:text-left">
            <span className="font-display text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-wider" style={{ color: 'hsl(var(--game-armor))' }}>
              {typeof window !== 'undefined' && window.innerWidth < 640 ? 'VEHÍCULO ACTIVO' : 'EN VEHÍCULO - F PARA SALIR'}
            </span>
          </div>
        </div>
      )}

      {showCrosshair && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'hsl(var(--primary) / 0.45)' }} />
            <div className="absolute w-3 h-px" style={{ background: 'hsl(var(--primary) / 0.7)' }} />
            <div className="absolute h-3 w-px" style={{ background: 'hsl(var(--primary) / 0.7)' }} />
            <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(var(--primary))', boxShadow: '0 0 8px hsl(var(--primary))' }} />
          </div>
        </div>
      )}
    </div>
  );
}
