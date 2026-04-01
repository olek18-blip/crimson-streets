import { useGameStore } from '../../game/store';

export default function GameOverScreen() {
  const { resetGame } = useGameStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'hsl(0 85% 10% / 0.9)' }}>
      <div className="text-center flex flex-col items-center gap-6">
        <h2 className="font-display text-6xl tracking-wider" style={{ color: 'hsl(var(--game-danger))' }}>WASTED</h2>
        <p className="text-muted-foreground">You have been eliminated.</p>
        <button onClick={resetGame} className="font-display text-xl tracking-widest px-8 py-3 rounded hover:scale-105 transition-all"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
          RETRY
        </button>
      </div>
    </div>
  );
}
