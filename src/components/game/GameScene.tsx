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
      <color attach="background" args={['#172233']} />
      <Sky sunPosition={[26, 10, 14]} turbidity={9} rayleigh={0.42} mieCoefficient={0.018} mieDirectionalG={0.86} />
      <ambientLight intensity={0.9} color="#9ab5d0" />
      <hemisphereLight args={['#a8bdd3', '#213222', 1.05]} />
      <directionalLight
        position={[24, 22, 14]}
        intensity={1.55}
        color="#fff1cf"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={220}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
      />

      <pointLight position={[0, 9, -16]} color="#f2c885" intensity={2.2} distance={34} />
      <pointLight position={[18, 7, 12]} color="#ff67bf" intensity={2.8} distance={28} />
      <pointLight position={[22, 5.6, 11]} color="#5ce1ff" intensity={2.2} distance={22} />
      <pointLight position={[3, 4.1, -18]} color="#7ab8ff" intensity={2.1} distance={18} />
      <pointLight position={[8, 4.2, -24]} color="#ffc175" intensity={1.8} distance={16} />
      <pointLight position={[26, 5.6, 24]} color="#ffad63" intensity={2.2} distance={22} />
      <pointLight position={[0, 8, 0]} color="#7db0ff" intensity={1.4} distance={46} />

      <fog attach="fog" args={['#1a2433', 38, 180]} />

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
        style={{ background: '#172233' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
