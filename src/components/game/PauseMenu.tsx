import { useGameStore } from '../../game/store';

export default function PauseMenu() {
  const { resumeGame, resetGame } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'hsl(var(--background) / 0.85)' }}>
      <div className="game-panel rounded-lg p-8 flex flex-col items-center gap-4">
        <h2 className="font-display text-4xl tracking-wider" style={{ color: 'hsl(var(--primary))' }}>PAUSED</h2>
        <button onClick={resumeGame} className="font-display text-xl tracking-widest px-8 py-3 rounded hover:scale-105 transition-all"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
          RESUME
        </button>
        <button onClick={resetGame} className="font-display text-lg tracking-widest px-8 py-2 rounded border transition-all"
          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
          QUIT TO MENU
        </button>
      </div>
    </div>
  );
}
