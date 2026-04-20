import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../game/store';
import { useMobileControlsStore } from '../game/mobileControls';
import { WORLD_SIZE } from '../game/worldData';

const WALK_SPEED = 7;
const RUN_SPEED = 12;
const ROTATE_SPEED = 2.4;
const VEHICLE_SPEED = 18;
const MAX_DELTA = 0.05;

export function usePlayerController() {
  const keys = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    keys.current.add(key);

    if (key.startsWith('arrow')) {
      event.preventDefault();
    }

    if (key === 'shift') {
      useGameStore.getState().setRunning(true);
    }

    if (event.repeat && (key === 'q' || key === 'f')) {
      return;
    }

    if (key === 'q') {
      useGameStore.getState().switchWeapon();
      return;
    }

    if (key === 'f') {
      const { player, vehicles, setPlayerInVehicle } = useGameStore.getState();

      if (player.inVehicle) {
        setPlayerInVehicle(null);
        return;
      }

      const nearVehicle = vehicles.find((vehicle) => {
        const dx = vehicle.position[0] - player.position[0];
        const dz = vehicle.position[2] - player.position[2];
        return Math.sqrt(dx * dx + dz * dz) < 4;
      });

      if (nearVehicle) {
        setPlayerInVehicle(nearVehicle.id);
      }
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    keys.current.delete(key);

    if (key === 'shift') {
      useGameStore.getState().setRunning(false);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    const { screen, setShooting } = useGameStore.getState();
    if (screen === 'playing') {
      setShooting(true);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    useGameStore.getState().setShooting(false);
  }, []);

  const handleWindowBlur = useCallback(() => {
    keys.current.clear();
    const { setRunning, setShooting } = useGameStore.getState();
    setRunning(false);
    setShooting(false);
    useMobileControlsStore.getState().reset();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleWindowBlur]);

  useFrame((_, delta) => {
    const { screen, player, updatePlayerPosition, updatePlayerRotation, setShooting } = useGameStore.getState();
    const { axisX, axisY, sprint, shooting } = useMobileControlsStore.getState();

    if (screen !== 'playing') {
      return;
    }

    setShooting(shooting);

    const dt = Math.min(delta, MAX_DELTA);
    const usingTouchMovement = Math.abs(axisX) > 0.06 || Math.abs(axisY) > 0.06;
    const movingForward = keys.current.has('w') || keys.current.has('arrowup') || axisY < -0.1;
    const movingBackward = keys.current.has('s') || keys.current.has('arrowdown') || axisY > 0.1;
    const turningLeft = keys.current.has('a') || keys.current.has('arrowleft') || axisX < -0.1;
    const turningRight = keys.current.has('d') || keys.current.has('arrowright') || axisX > 0.1;
    const effectiveRunning = player.isRunning || sprint;
    const speed = player.inVehicle ? VEHICLE_SPEED : effectiveRunning ? RUN_SPEED : WALK_SPEED;

    let rotation = player.rotation;
    const position: [number, number, number] = [...player.position];
    let hasChanged = false;

    if (turningLeft) {
      const rotateFactor = usingTouchMovement ? Math.min(1, Math.abs(axisX)) : 1;
      rotation += ROTATE_SPEED * rotateFactor * dt;
      hasChanged = true;
    }

    if (turningRight) {
      const rotateFactor = usingTouchMovement ? Math.min(1, Math.abs(axisX)) : 1;
      rotation -= ROTATE_SPEED * rotateFactor * dt;
      hasChanged = true;
    }

    if (movingForward) {
      const moveFactor = usingTouchMovement ? Math.min(1, Math.abs(axisY)) : 1;
      position[0] -= Math.sin(rotation) * speed * moveFactor * dt;
      position[2] -= Math.cos(rotation) * speed * moveFactor * dt;
      hasChanged = true;
    }

    if (movingBackward) {
      const moveFactor = usingTouchMovement ? Math.min(1, Math.abs(axisY)) : 1;
      position[0] += Math.sin(rotation) * speed * moveFactor * dt;
      position[2] += Math.cos(rotation) * speed * moveFactor * dt;
      hasChanged = true;
    }

    position[0] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, position[0]));
    position[2] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, position[2]));

    if (!hasChanged) {
      return;
    }

    updatePlayerPosition(position);
    updatePlayerRotation(rotation);
  });

  return { keys };
}
