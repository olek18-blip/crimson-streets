import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import mapBg from '../assets/map-background.png';

type DemoPhase = {
  id: string;
  title: string;
  objectiveType: 'reach' | 'switch-weapon' | 'enter-vehicle' | 'eliminate-gangs' | 'secure';
  hint: string;
  location: string;
  actionLabel: string;
};

const phases: DemoPhase[] = [
  {
    id: 'phase-01',
    title: 'Acércate al punto de encuentro',
    objectiveType: 'reach',
    hint: 'Muévete con WASD y alcanza el primer marcador en Madrona.',
    location: 'Madrona Centro',
    actionLabel: 'Simular llegada al contacto',
  },
  {
    id: 'phase-02',
    title: 'Equipa el arma principal',
    objectiveType: 'switch-weapon',
    hint: 'Pulsa Q hasta sacar la pistola o el rifle.',
    location: 'Zona segura',
    actionLabel: 'Simular cambio de arma',
  },
  {
    id: 'phase-03',
    title: 'Entra en un vehículo cercano',
    objectiveType: 'enter-vehicle',
    hint: 'Acércate al coche rojo y pulsa F para subir.',
    location: 'Calle lateral',
    actionLabel: 'Simular entrada en vehículo',
  },
  {
    id: 'phase-04',
    title: 'Llega al almacén de la banda',
    objectiveType: 'reach',
    hint: 'Sigue el beacon dorado y usa el minimapa para orientarte.',
    location: 'Distrito de almacenes',
    actionLabel: 'Simular llegada al almacén',
  },
  {
    id: 'phase-05',
    title: 'Elimina a los pandilleros del almacén',
    objectiveType: 'eliminate-gangs',
    hint: 'Apunta con calma. Los enemigos del tutorial no deberían sentirse injustos.',
    location: 'Exterior del almacén',
    actionLabel: 'Simular combate superado',
  },
  {
    id: 'phase-06',
    title: 'Recoge la evidencia y asegura la zona',
    objectiveType: 'secure',
    hint: 'Camina a la segunda marca para cerrar la operación.',
    location: 'Punto de evidencia',
    actionLabel: 'Simular cierre de misión',
  },
];

const typeLabel: Record<DemoPhase['objectiveType'], string> = {
  reach: 'Reach',
  'switch-weapon': 'Switch Weapon',
  'enter-vehicle': 'Enter Vehicle',
  'eliminate-gangs': 'Combat',
  secure: 'Secure',
};

export default function MissionDemo() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [money, setMoney] = useState(500);
  const [statusLog, setStatusLog] = useState<string[]>([
    'Inicio de demo cargado.',
    'Misión 01 preparada: Primeros Pasos en Madrona.',
  ]);

  const currentPhase = phases[currentPhaseIndex];
  const completedCount = currentPhaseIndex;
  const missionFinished = currentPhaseIndex >= phases.length;
  const progressPercent = missionFinished ? 100 : Math.round((completedCount / phases.length) * 100);

  const activeObjectiveText = useMemo(() => {
    if (missionFinished) {
      return 'Operación completada. El siguiente paso sería desbloquear la misión 02.';
    }
    return currentPhase.title;
  }, [missionFinished, currentPhase]);

  const completePhase = () => {
    if (missionFinished) return;

    const nextIndex = currentPhaseIndex + 1;
    const nextLog = [`✔ ${currentPhase.title}`, ...statusLog].slice(0, 7);

    if (nextIndex >= phases.length) {
      setMoney((value) => value + 5000);
      setCurrentPhaseIndex(phases.length);
      setStatusLog([
        '🏁 Misión completada. Recompensa entregada: $5,000.',
        ...nextLog,
      ].slice(0, 7));
      return;
    }

    setCurrentPhaseIndex(nextIndex);
    setStatusLog([
      `→ Nuevo objetivo: ${phases[nextIndex].title}`,
      ...nextLog,
    ].slice(0, 7));
  };

  const resetDemo = () => {
    setCurrentPhaseIndex(0);
    setMoney(500);
    setStatusLog([
      'Demo reiniciada.',
      'Misión 01 preparada: Primeros Pasos en Madrona.',
    ]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <img src={mapBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-amber-300/80 mb-2">Mission Demo</div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Primeros Pasos en Madrona</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Demo interactiva del flujo de misión. Sirve para validar ritmo, claridad de objetivos, tutorial hints y progresión antes de llevarlo a Godot.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Volver al juego
            </Link>
            <button
              onClick={resetDemo}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors"
            >
              Reiniciar demo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-2">Objetivo activo</div>
                  <div className="text-2xl font-semibold leading-tight">{activeObjectiveText}</div>
                  {!missionFinished && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-300/10 px-3 py-1 text-sm text-amber-200">
                      <span className="font-semibold">{typeLabel[currentPhase.objectiveType]}</span>
                      <span className="opacity-60">•</span>
                      <span>{currentPhase.location}</span>
                    </div>
                  )}
                </div>

                <div className="text-right min-w-[110px]">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-slate-400 mb-2">Progreso</div>
                  <div className="text-3xl font-bold text-amber-300">{progressPercent}%</div>
                </div>
              </div>

              <div className="h-2 rounded-full overflow-hidden bg-white/10 mb-4">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>

              {!missionFinished ? (
                <>
                  <div className="rounded-xl border border-white/8 bg-white/5 p-4 mb-4">
                    <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Hint actual</div>
                    <p className="text-slate-200">{currentPhase.hint}</p>
                  </div>

                  <button
                    onClick={completePhase}
                    className="w-full md:w-auto px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition-colors"
                  >
                    {currentPhase.actionLabel}
                  </button>
                </>
              ) : (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-300/10 p-4">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-emerald-200/80 mb-2">Resultado</div>
                  <p className="text-emerald-100">La misión termina con recompensa, limpieza del estado activo y preparación para desbloquear la siguiente operación.</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-4">Fases de la misión</div>
              <div className="space-y-3">
                {phases.map((phase, index) => {
                  const isDone = index < currentPhaseIndex;
                  const isCurrent = index === currentPhaseIndex && !missionFinished;
                  return (
                    <div
                      key={phase.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        isCurrent
                          ? 'border-amber-300/40 bg-amber-300/10'
                          : isDone
                            ? 'border-emerald-400/20 bg-emerald-300/10'
                            : 'border-white/8 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm text-slate-300 mb-1">Fase {index + 1}</div>
                          <div className="font-semibold text-lg">{phase.title}</div>
                        </div>
                        <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${isCurrent ? 'text-amber-200' : isDone ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {isDone ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-4">HUD simulado</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Dinero</div>
                  <div className="text-2xl font-bold text-emerald-300">${money.toLocaleString()}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Wanted</div>
                  <div className="text-2xl font-bold text-slate-200">0★</div>
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-4 mb-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Beacon + Minimap</div>
                <p className="text-slate-300 text-sm">
                  La demo enseña cómo debería cambiar el objetivo activo y cómo el marcador dorado y el minimapa deberían acompañar cada fase.
                </p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Uso recomendado</div>
                <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                  <li>Validar orden de objetivos.</li>
                  <li>Ajustar hints antes de implementarlos en Godot.</li>
                  <li>Comprobar si el ritmo del tutorial se siente natural.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-4">Log de misión</div>
              <div className="space-y-2">
                {statusLog.map((entry, index) => (
                  <div key={`${entry}-${index}`} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 border border-white/6">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
