import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
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
import MapEditor from './MapEditor';
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
      <color attach="background" args={['#050505']} />
      <Sky sunPosition={[10, 20, 10]} turbidity={12} rayleigh={0.24} mieCoefficient={0.02} mieDirectionalG={0.9} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.35} color="#9fb8ff" />

      <pointLight position={[5, 3, 5]} color="#ff0066" intensity={1.8} distance={12} />
      <pointLight position={[-5, 4, 8]} color="#00ffff" intensity={1.3} distance={10} />

      <fog attach="fog" args={['#0a0a0a', 20, 90]} />

      <GameCamera />
      <GameLogic />
      <MissionBeacon />
      <Player />
      <CityEnvironment />
      <MapEditor />
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
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#050505' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
