import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../game/store';
import { WORLD_SIZE } from '../game/worldData';

const MOVE_SPEED = 0.15;
const RUN_SPEED = 0.28;
const ROTATE_SPEED = 0.04;
const VEHICLE_SPEED = 0.45;

export function usePlayerController() {
  const keys = useRef<Set<string>>(new Set());
  
  const {
    player, screen, updatePlayerPosition, updatePlayerRotation,
    setRunning, setShooting, switchWeapon, setPlayerInVehicle, vehicles
  } = useGameStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keys.current.add(e.key.toLowerCase());
    if (e.key.toLowerCase() === 'shift') setRunning(true);
    if (e.key.toLowerCase() === 'q') switchWeapon();
    if (e.key.toLowerCase() === 'f') {
      if (player.inVehicle) {
        setPlayerInVehicle(null);
      } else {
        const nearVehicle = vehicles.find(v => {
          const dx = v.position[0] - player.position[0];
          const dz = v.position[2] - player.position[2];
          return Math.sqrt(dx * dx + dz * dz) < 4;
        });
        if (nearVehicle) setPlayerInVehicle(nearVehicle.id);
      }
    }
  }, [player.inVehicle, player.position, vehicles, setRunning, switchWeapon, setPlayerInVehicle]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keys.current.delete(e.key.toLowerCase());
    if (e.key.toLowerCase() === 'shift') setRunning(false);
  }, [setRunning]);

  const handleMouseDown = useCallback(() => setShooting(true), [setShooting]);
  const handleMouseUp = useCallback(() => setShooting(false), [setShooting]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp]);

  useFrame(() => {
    if (screen !== 'playing') return;
    
    const speed = player.inVehicle ? VEHICLE_SPEED : (player.isRunning ? RUN_SPEED : MOVE_SPEED);
    let rot = player.rotation;
    const pos: [number, number, number] = [...player.position];
    let moved = false;

    if (keys.current.has('a') || keys.current.has('arrowleft')) {
      rot += ROTATE_SPEED;
      moved = true;
    }
    if (keys.current.has('d') || keys.current.has('arrowright')) {
      rot -= ROTATE_SPEED;
      moved = true;
    }
    if (keys.current.has('w') || keys.current.has('arrowup')) {
      pos[0] -= Math.sin(rot) * speed;
      pos[2] -= Math.cos(rot) * speed;
      moved = true;
    }
    if (keys.current.has('s') || keys.current.has('arrowdown')) {
      pos[0] += Math.sin(rot) * speed;
      pos[2] += Math.cos(rot) * speed;
      moved = true;
    }

    // Clamp to world bounds
    pos[0] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, pos[0]));
    pos[2] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, pos[2]));

    if (moved) {
      updatePlayerPosition(pos);
      updatePlayerRotation(rot);
    }
  });

  return { keys };
}
