import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../../game/store';
import { usePlayerController } from '../../hooks/usePlayerController';
import { useMissionSystem } from '../../hooks/useMissionSystem';
import { useGamePersistence } from '../../hooks/useGamePersistence';
import Player from './Player';
import CityEnvironment from './CityEnvironment';
import Vehicles from './Vehicles';
import NPCs from './NPCs';
import GameCamera from './GameCamera';
import GameHUD from './GameHUD';
import Minimap from './Minimap';
import MainMenu from './MainMenu';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';
import MissionCompleteScreen from './MissionCompleteScreen';
import MissionBeacon from './MissionBeacon';
import MobileControls from './MobileControls';
import LoadingSplash from './LoadingSplash';

function GameLogic() {
  usePlayerController();
  useMissionSystem();
  useGamePersistence();
  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0a1520']} />
      <Sky sunPosition={[60, 8, 40]} turbidity={10} rayleigh={0.55} mieCoefficient={0.02} mieDirectionalG={0.95} />
      <ambientLight intensity={0.34} color="#99bce0" />
      <hemisphereLight args={['#88add2', '#17231a', 0.6]} />
      <directionalLight
        position={[65, 24, 30]}
        intensity={1.05}
        color="#adc4de"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
      />
      <pointLight position={[0, 9, 0]} color="#d28c45" intensity={1.45} distance={46} />
      <pointLight position={[18, 6, 12]} color="#ff5dd8" intensity={1.35} distance={24} />
      <pointLight position={[23, 5, 12]} color="#00cfff" intensity={1.05} distance={18} />
      <pointLight position={[3, 3.2, -28]} color="#ffe8a3" intensity={1.3} distance={14} />
      <fog attach="fog" args={['#102030', 58, 210]} />

      <GameCamera />
      <GameLogic />
      <MissionBeacon />
      <Player />
      <CityEnvironment />
      <Vehicles />
      <NPCs />
    </>
  );
}

export default function GameScene() {
  const screen = useGameStore((state) => state.screen);
  const [showLoading, setShowLoading] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.repeat) {
      return;
    }

    const { screen: currentScreen, pauseGame, resumeGame } = useGameStore.getState();

    if (currentScreen === 'playing') {
      pauseGame();
      return;
    }

    if (currentScreen === 'paused') {
      resumeGame();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (screen !== 'playing') {
      setShowLoading(false);
      return;
    }

    setShowLoading(true);
    const timeout = window.setTimeout(() => setShowLoading(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [screen]);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {screen === 'menu' && <MainMenu />}
      {screen === 'paused' && <PauseMenu />}
      {screen === 'game-over' && <GameOverScreen />}
      {screen === 'mission-complete' && <MissionCompleteScreen />}

      {screen !== 'menu' && (
        <>
          <GameHUD />
          <Minimap />
          <MobileControls />
        </>
      )}

      {showLoading && screen === 'playing' && <LoadingSplash progressText="Preparando Mandril, IA y misión activa…" />}

      <Canvas shadows camera={{ fov: 60, near: 0.1, far: 500 }} gl={{ antialias: true }} style={{ background: '#0a1520' }}>
        <Scene />
      </Canvas>
    </div>
  );
}
