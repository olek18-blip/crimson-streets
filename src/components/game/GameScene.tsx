import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../game/store';
import { usePlayerController } from '../../hooks/usePlayerController';
import { useMissionSystem } from '../../hooks/useMissionSystem';
import Player from './Player';
import CityEnvironment from './CityEnvironment';
import Vehicles from './Vehicles';
import NPCs from './NPCs';
import GameCamera from './GameCamera';
import GameHUD from './GameHUD';
import MainMenu from './MainMenu';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';
import MissionCompleteScreen from './MissionCompleteScreen';

function GameLogic() {
  usePlayerController();
  useMissionSystem();
  return null;
}

function Scene() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={2} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[50, 50, 30]} intensity={1} castShadow shadow-mapSize={2048} />
      <fog attach="fog" args={['#0a1520', 30, 80]} />
      
      <GameCamera />
      <GameLogic />
      <Player />
      <CityEnvironment />
      <Vehicles />
      <NPCs />
    </>
  );
}

export default function GameScene() {
  const { screen, pauseGame, resumeGame } = useGameStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (screen === 'playing') pauseGame();
      else if (screen === 'paused') resumeGame();
    }
  }, [screen, pauseGame, resumeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-screen h-screen relative">
      {screen === 'menu' && <MainMenu />}
      {screen === 'paused' && <PauseMenu />}
      {screen === 'game-over' && <GameOverScreen />}
      {screen === 'mission-complete' && <MissionCompleteScreen />}
      
      {screen !== 'menu' && <GameHUD />}
      
      <Canvas shadows camera={{ fov: 60, near: 0.1, far: 200 }}
        style={{ background: '#0a1520' }}>
        <Scene />
      </Canvas>
    </div>
  );
}
