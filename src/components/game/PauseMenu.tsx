import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../game/store';

export default function PauseMenu() {
  const navigate = useNavigate();
  const { resumeGame, resetGame } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'hsl(var(--background) / 0.85)' }}>
      <div className="game-panel rounded-lg p-8 flex flex-col items-center gap-4 min-w-[320px]">
        <h2 className="font-display text-4xl tracking-wider" style={{ color: 'hsl(var(--primary))' }}>PAUSA</h2>
        <button
          onClick={resumeGame}
          className="font-display text-xl tracking-widest px-8 py-3 rounded hover:scale-105 transition-all"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          REANUDAR
        </button>
        <button
          onClick={() => {
            navigate('/builder');
          }}
          className="font-display text-sm tracking-[0.18em] px-8 py-3 rounded border transition-all"
          style={{ borderColor: 'rgba(34,211,238,0.35)', color: '#b6f3ff' }}
        >
          ABRIR CONSTRUCCION
        </button>
        <button
          onClick={resetGame}
          className="font-display text-lg tracking-widest px-8 py-2 rounded border transition-all"
          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        >
          VOLVER AL MENU
        </button>
      </div>
    </div>
  );
}
