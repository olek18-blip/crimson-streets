import { useGameStore } from '../../game/store';

export default function MissionCompleteScreen() {
  const { resumeGame, missions, lastCompletedMission } = useGameStore();
  const completedMission = missions.find((mission) => mission.id === lastCompletedMission);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'hsl(var(--background) / 0.9)' }}>
      <div className="text-center flex flex-col items-center gap-6">
        <h2 className="font-display text-5xl tracking-wider" style={{ color: 'hsl(var(--game-gold))' }}>
          MISION COMPLETADA
        </h2>
        {completedMission && (
          <>
            <p className="font-display text-2xl text-foreground">{completedMission.title}</p>
            <p className="text-xl" style={{ color: 'hsl(var(--game-money))' }}>
              +${completedMission.reward.toLocaleString()}
            </p>
          </>
        )}
        <button
          onClick={resumeGame}
          className="font-display text-xl tracking-widest px-8 py-3 rounded hover:scale-105 transition-all mt-4"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
