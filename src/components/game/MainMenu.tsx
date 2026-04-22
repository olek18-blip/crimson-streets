import { Link } from 'react-router-dom';
import { hasSavedGame } from '../../game/save';
import { useGameStore } from '../../game/store';

export default function MainMenu() {
  const { startGame, continueGame } = useGameStore();
  const canContinue = hasSavedGame();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 py-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,86,34,0.18),transparent_28%),linear-gradient(180deg,#08111a_0%,#09131e_35%,#05090f_100%)]" />
      <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,212,255,0.05)_38%,transparent_55%,rgba(255,97,210,0.05)_78%,transparent_100%)]" />
      <div className="absolute left-[8%] top-[14%] h-28 w-[2px] bg-cyan-400/25 blur-[1px]" />
      <div className="absolute right-[14%] top-[18%] h-36 w-[2px] bg-orange-400/20 blur-[1px]" />
      <div className="absolute bottom-[22%] left-[12%] h-20 w-20 rounded-full border border-cyan-300/10" />
      <div className="absolute bottom-[16%] right-[10%] h-28 w-28 rounded-full border border-orange-300/10" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-7">
        <div className="text-center px-2">
          <div className="font-display text-[11px] sm:text-xs tracking-[0.35em] text-cyan-200/70 mb-3">MANDRIL VERTICAL SLICE</div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-8xl tracking-[0.12em] sm:tracking-wider leading-[0.92] text-glow" style={{ color: 'hsl(var(--primary))' }}>
            EL
            <br />
            PELIGROSO
          </h1>
          <h2 className="font-display mt-2 text-3xl sm:text-5xl md:text-6xl tracking-[0.14em] sm:tracking-widest leading-none" style={{ color: 'hsl(var(--secondary))' }}>
            ESPANA
          </h2>
        </div>

        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 text-center">
          <p className="text-slate-300 text-sm sm:text-base leading-snug">
            Juega la historia o entra directamente al editor para construir carreteras, edificios, arboles y farolas en 2D y revisarlo al instante en 3D.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
          <button
            onClick={startGame}
            className="rounded-3xl border border-orange-400/20 bg-black/25 p-6 text-left transition-all hover:-translate-y-1 hover:border-orange-300/40 hover:bg-black/35"
          >
            <div className="font-display text-[11px] tracking-[0.28em] text-orange-200/80">MODO HISTORIA</div>
            <div className="mt-3 font-display text-3xl tracking-[0.12em] text-white">JUGAR</div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Recorre Mandril, activa misiones y entra despues al modo construccion desde la partida para ajustar el mapa.
            </p>
          </button>

          <Link
            to="/builder"
            className="rounded-3xl border border-cyan-300/20 bg-black/25 p-6 text-left transition-all hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-black/35"
          >
            <div className="font-display text-[11px] tracking-[0.28em] text-cyan-200/80">MODO CONSTRUCCION</div>
            <div className="mt-3 font-display text-3xl tracking-[0.12em] text-white">CONSTRUIR</div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Disena la ciudad en planta 2D, cambia a vista 3D para revisar volumen y recoloca elementos sin salir del juego.
            </p>
          </Link>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 px-1">
          <button
            onClick={continueGame}
            disabled={!canContinue}
            className="font-display text-base sm:text-lg tracking-[0.18em] sm:tracking-widest px-6 py-3 rounded-xl border transition-all"
            style={{
              borderColor: canContinue ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
              color: canContinue ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
              opacity: canContinue ? 1 : 0.5,
              cursor: canContinue ? 'pointer' : 'not-allowed',
              background: 'rgba(3,7,18,0.35)',
            }}
          >
            CONTINUAR PARTIDA
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/mission-demo"
              className="font-display text-[11px] sm:text-sm tracking-[0.22em] sm:tracking-[0.28em] px-6 py-3 rounded-xl border text-center transition-all hover:bg-white/10"
              style={{
                borderColor: 'hsl(var(--secondary) / 0.35)',
                color: 'hsl(var(--foreground))',
                background: 'rgba(3,7,18,0.28)',
              }}
            >
              DEMOSTRACION DE LA MISION
            </Link>
            <Link
              to="/world-map"
              className="font-display text-[11px] sm:text-sm tracking-[0.22em] sm:tracking-[0.28em] px-6 py-3 rounded-xl border text-center transition-all hover:bg-white/10"
              style={{
                borderColor: 'rgba(34,211,238,0.35)',
                color: 'hsl(var(--foreground))',
                background: 'rgba(3,7,18,0.28)',
              }}
            >
              MAPA INTERACTIVO
            </Link>
          </div>
        </div>

        <div className="mt-1 text-[11px] sm:text-xs text-slate-400 font-display tracking-[0.16em] sm:tracking-wider text-center px-3">
          PROTOTIPO v0.3 - CONSTRUCTOR 2D/3D Y CARGA MAS LIGERA
        </div>
      </div>
    </div>
  );
}
