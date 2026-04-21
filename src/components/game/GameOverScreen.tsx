import { useGameStore } from '../../game/store';

export default function GameOverScreen() {
  const { resetGame } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'hsl(0 85% 10% / 0.9)' }}>
      <div className="text-center flex flex-col items-center gap-5 max-w-sm">
        <div className="text-[11px] tracking-[0.34em] uppercase text-red-200/60">Corte vertical de Mandril</div>
        <h2 className="font-display text-5xl sm:text-6xl tracking-[0.08em]" style={{ color: 'hsl(var(--game-danger))' }}>
          DESPERDICIADO
        </h2>
        <p className="text-slate-200 text-lg">Has sido eliminado.</p>
        <button
          onClick={resetGame}
          className="font-display text-lg tracking-[0.22em] px-8 py-3 rounded-xl hover:scale-105 transition-all"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          REINICIAR
        </button>
      </div>
    </div>
  );
}
