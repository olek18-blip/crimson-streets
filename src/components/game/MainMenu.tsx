import mapBg from '../../assets/map-background.png';
import { hasSavedGame } from '../../game/save';
import { useGameStore } from '../../game/store';

export default function MainMenu() {
  const { startGame, continueGame } = useGameStore();
  const canContinue = hasSavedGame();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={mapBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, hsl(220 20% 8% / 0.6), hsl(220 20% 8% / 0.85))',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="font-display text-7xl md:text-9xl tracking-wider text-glow" style={{ color: 'hsl(var(--primary))' }}>
            THE DANGEROUS
          </h1>
          <h2 className="font-display text-5xl md:text-7xl tracking-widest" style={{ color: 'hsl(var(--secondary))' }}>
            SPAIN
          </h2>
        </div>

        <p className="text-muted-foreground text-center max-w-md text-sm">
          A corrupt cop. A criminal empire. One city that never sleeps.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={startGame}
            className="font-display text-2xl tracking-widest px-12 py-4 rounded transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(14 90% 40%))',
              color: 'hsl(var(--primary-foreground))',
              boxShadow: '0 0 30px hsl(var(--primary) / 0.4)',
            }}
          >
            NEW GAME
          </button>
          <button
            onClick={continueGame}
            disabled={!canContinue}
            className="font-display text-lg tracking-widest px-8 py-2 rounded border transition-all"
            style={{
              borderColor: canContinue ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
              color: canContinue ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
              opacity: canContinue ? 1 : 0.5,
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
          >
            CONTINUE
          </button>
        </div>

        <div className="mt-8 text-xs text-muted-foreground font-display tracking-wider text-center">
          PROTOTYPE v0.2 — AUTOSAVE ENABLED
        </div>
      </div>
    </div>
  );
}
