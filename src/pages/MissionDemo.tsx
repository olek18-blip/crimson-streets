import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import mapBg from '../assets/map-background.png';

type SlicePhase = {
  id: string;
  title: string;
  category: 'briefing' | 'corruption' | 'street-control' | 'pursuit' | 'reveal' | 'hook';
  hint: string;
  location: string;
  actionLabel: string;
  result: string;
};

const phases: SlicePhase[] = [
  {
    id: 'phase-01',
    title: 'Briefing: Dirty Patrol Order',
    category: 'briefing',
    hint: 'Comisario Esteban Roldán te entrega una orden no escrita: patrulla oficial, cobro extraoficial.',
    location: 'Mandril — Police Access Point',
    actionLabel: 'Simular briefing corrupto',
    result: 'Daniel Vega acepta una patrulla sucia bajo cobertura institucional.',
  },
  {
    id: 'phase-02',
    title: 'Collect Protection Money',
    category: 'corruption',
    hint: 'Visita un negocio protegido y cobra sin levantar demasiado ruido. Aquí el sistema espera corrupción como rutina.',
    location: 'Mandril — Street Market Edge',
    actionLabel: 'Simular cobro de protección',
    result: 'La ciudad deja claro que la corrupción no es excepción, sino procedimiento.',
  },
  {
    id: 'phase-03',
    title: 'Respond to Gang Pressure',
    category: 'street-control',
    hint: 'Una banda local interpreta tu visita como intrusión. Debes medir fuerza, presencia y control territorial.',
    location: 'Mandril — Gang Blocks',
    actionLabel: 'Simular escalada con banda',
    result: 'La patrulla se convierte en fricción abierta entre policía corrupta y poder callejero.',
  },
  {
    id: 'phase-04',
    title: 'Night Chase Through Mandril',
    category: 'pursuit',
    hint: 'Un informante huye con datos comprometidos. Sube al coche y persíguelo antes de que entregue el material.',
    location: 'Mandril — Arterial Road',
    actionLabel: 'Simular persecución nocturna',
    result: 'La persecución demuestra conducción, presión, wanted state y urgencia narrativa.',
  },
  {
    id: 'phase-05',
    title: 'Secure the Evidence',
    category: 'reveal',
    hint: 'Recupera el material antes de que llegue a Asuntos Internos o a manos rivales.',
    location: 'Mandril — Club Edge / Back Lot',
    actionLabel: 'Simular recuperación de evidencia',
    result: 'La prueba conecta a policía, bandas y una capa de poder mucho más alta.',
  },
  {
    id: 'phase-06',
    title: 'Final Hook: The System Is Bigger',
    category: 'hook',
    hint: 'No era solo un soborno de barrio. La información apunta a una red política-criminal más amplia.',
    location: 'Mandril — End of Slice',
    actionLabel: 'Simular hook final',
    result: 'El slice termina dejando claro que Daniel ya está dentro de una arquitectura de poder más grande que la calle.',
  },
];

const categoryLabel: Record<SlicePhase['category'], string> = {
  briefing: 'Briefing',
  corruption: 'Corruption',
  'street-control': 'Street Control',
  pursuit: 'Pursuit',
  reveal: 'Reveal',
  hook: 'Hook',
};

const categoryColors: Record<SlicePhase['category'], string> = {
  briefing: 'text-amber-200',
  corruption: 'text-red-300',
  'street-control': 'text-orange-300',
  pursuit: 'text-sky-300',
  reveal: 'text-violet-300',
  hook: 'text-emerald-300',
};

export default function MissionDemo() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [money, setMoney] = useState(1200);
  const [wanted, setWanted] = useState(0);
  const [statusLog, setStatusLog] = useState<string[]>([
    'Vertical slice cargada.',
    'Mandril queda definido como MVP canónico.',
  ]);

  const currentPhase = phases[currentPhaseIndex];
  const completedCount = currentPhaseIndex;
  const sliceFinished = currentPhaseIndex >= phases.length;
  const progressPercent = sliceFinished ? 100 : Math.round((completedCount / phases.length) * 100);

  const activeObjectiveText = useMemo(() => {
    if (sliceFinished) {
      return 'Slice completada. El siguiente paso sería convertir este flujo en una misión jugable real dentro del distrito de Mandril.';
    }
    return currentPhase.title;
  }, [sliceFinished, currentPhase]);

  const completePhase = () => {
    if (sliceFinished) return;

    const nextIndex = currentPhaseIndex + 1;
    const phase = phases[currentPhaseIndex];
    const nextLog = [`✔ ${phase.title}`, ...statusLog].slice(0, 8);

    if (phase.category === 'corruption') {
      setMoney((value) => value + 800);
    }

    if (phase.category === 'street-control') {
      setWanted(1);
    }

    if (phase.category === 'pursuit') {
      setWanted(2);
    }

    if (phase.category === 'reveal') {
      setMoney((value) => value + 1800);
    }

    if (nextIndex >= phases.length) {
      setMoney((value) => value + 5000);
      setWanted(0);
      setCurrentPhaseIndex(phases.length);
      setStatusLog([
        '🏁 Slice cerrada. Mandril ya prueba tono, corrupción, persecución y hook narrativo.',
        ...nextLog,
      ].slice(0, 8));
      return;
    }

    setCurrentPhaseIndex(nextIndex);
    setStatusLog([
      `→ ${phase.result}`,
      `→ Nuevo beat: ${phases[nextIndex].title}`,
      ...nextLog,
    ].slice(0, 8));
  };

  const resetDemo = () => {
    setCurrentPhaseIndex(0);
    setMoney(1200);
    setWanted(0);
    setStatusLog([
      'Vertical slice reiniciada.',
      'Mandril queda definido como MVP canónico.',
    ]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <img src={mapBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/88" />
      </div>

      <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-amber-300/80 mb-2">Mandril Vertical Slice</div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">The Dangerous Spain — MVP Demo</h1>
            <p className="text-slate-300 mt-2 max-w-3xl">
              Demo de flujo pensada como vertical slice canónica: corrupción policial, fricción con bandas, persecución y hook político-criminal. Ya no representa solo un tutorial, sino el núcleo del MVP definido por el GDD.
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
              Reiniciar slice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-6">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-2">Beat activo</div>
                  <div className="text-2xl font-semibold leading-tight">{activeObjectiveText}</div>
                  {!sliceFinished && (
                    <div className={`mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm ${categoryColors[currentPhase.category]}`}>
                      <span className="font-semibold">{categoryLabel[currentPhase.category]}</span>
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
                <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>

              {!sliceFinished ? (
                <>
                  <div className="rounded-xl border border-white/8 bg-white/5 p-4 mb-4">
                    <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Lectura del beat</div>
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
                  <p className="text-emerald-100">La demo ya deja claro el pitch del juego: Daniel Vega, policía corrupto, opera en Mandril dentro de una red más grande que el crimen callejero.</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-4">Estructura del slice</div>
              <div className="space-y-3">
                {phases.map((phase, index) => {
                  const isDone = index < currentPhaseIndex;
                  const isCurrent = index === currentPhaseIndex && !sliceFinished;
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
                          <div className="text-sm text-slate-300 mb-1">Beat {index + 1}</div>
                          <div className="font-semibold text-lg">{phase.title}</div>
                          <div className={`text-xs mt-2 uppercase tracking-[0.2em] ${categoryColors[phase.category]}`}>
                            {categoryLabel[phase.category]}
                          </div>
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
                  <div className="text-2xl font-bold text-slate-200">{wanted}★</div>
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-4 mb-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Prueba del MVP</div>
                <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                  <li>Corrupción policial como loop principal.</li>
                  <li>Persecución significativa en Mandril.</li>
                  <li>Fricción visible entre policía y gangs.</li>
                  <li>Hook narrativo que abre la conspiración.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                <div className="text-[11px] tracking-[0.22em] uppercase text-slate-400 mb-2">Sub-áreas objetivo</div>
                <p className="text-slate-300 text-sm">
                  Police access point, street market, gang blocks, arterial road, club edge y un back lot / warehouse corto. Esa es la mezcla ideal para el slice canónico de Mandril.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-5">
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400 mb-4">Log de slice</div>
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
