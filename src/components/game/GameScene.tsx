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
      <color attach="background" args={['#08111a']} />
      <Sky sunPosition={[60, 8, 40]} turbidity={10} rayleigh={0.55} mieCoefficient={0.02} mieDirectionalG={0.95} />
      <ambientLight intensity={0.24} color="#8fb4d8" />
      <hemisphereLight args={['#7da0c4', '#132016', 0.42]} />
      <directionalLight
        position={[65, 24, 30]}
        intensity={0.8}
        color="#9cb7d3"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
      />
      <pointLight position={[0, 9, 0]} color="#d28c45" intensity={1.25} distance={42} />
      <pointLight position={[18, 6, 12]} color="#ff5dd8" intensity={1.2} distance={24} />
      <pointLight position={[23, 5, 12]} color="#00cfff" intensity={0.95} distance={18} />
      <fog attach="fog" args={['#0c1722', 42, 165]} />

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
    if (screen === 'menu') {
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

      {showLoading && screen !== 'menu' && <LoadingSplash progressText="Preparando Mandril, IA y misión activa…" />}

      <Canvas shadows camera={{ fov: 60, near: 0.1, far: 500 }} gl={{ antialias: true }} style={{ background: '#08111a' }}>
        <Scene />
      </Canvas>
    </div>
  );
}
