import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { useGameStore } from '../../game/store';
import { useGamePersistence } from '../../hooks/useGamePersistence';
import { useMissionSystem } from '../../hooks/useMissionSystem';
import { usePlayerController } from '../../hooks/usePlayerController';
import CityEnvironment from './CityEnvironment';
import GameCamera from './GameCamera';
import GameHUD from './GameHUD';
import GameOverScreen from './GameOverScreen';
import LoadingSplash from './LoadingSplash';
import MainMenu from './MainMenu';
import Minimap from './Minimap';
import MissionBeacon from './MissionBeacon';
import MissionCompleteScreen from './MissionCompleteScreen';
import MobileControls from './MobileControls';
import NPCs from './NPCs';
import PauseMenu from './PauseMenu';
import Player from './Player';
import Vehicles from './Vehicles';

function GameLogic() {
  usePlayerController();
  useMissionSystem();
  useGamePersistence();
  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#07090d']} />
      <Sky sunPosition={[30, 5, 18]} turbidity={16} rayleigh={0.18} mieCoefficient={0.03} mieDirectionalG={0.96} />
      <ambientLight intensity={0.34} color="#677d92" />
      <hemisphereLight args={['#566f88', '#121712', 0.46]} />
      <directionalLight
        position={[18, 16, 10]}
        intensity={0.62}
        color="#8ea4b7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={220}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
      />

      <pointLight position={[0, 7.5, -16]} color="#f2b25d" intensity={1.15} distance={24} />
      <pointLight position={[18, 6, 12]} color="#ff3ca6" intensity={2.05} distance={22} />
      <pointLight position={[22, 4.8, 11]} color="#00d8ff" intensity={1.65} distance={16} />
      <pointLight position={[3, 3.1, -18]} color="#62a8ff" intensity={1.5} distance={14} />
      <pointLight position={[8, 3.6, -24]} color="#ffb15a" intensity={1.1} distance={11} />
      <pointLight position={[26, 4.8, 24]} color="#ff8d3b" intensity={1.45} distance={16} />

      <fog attach="fog" args={['#0a0c10', 14, 78]} />

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

      {showLoading && screen === 'playing' && <LoadingSplash progressText="Preparando Mandril, IA y mision activa..." />}

      <Canvas
        dpr={[1, 1.25]}
        shadows
        camera={{ fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ background: '#07090d' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
