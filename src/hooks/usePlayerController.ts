import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../game/store';

const MOVE_SPEED = 0.12;
const RUN_SPEED = 0.22;
const ROTATE_SPEED = 0.04;
const VEHICLE_SPEED = 0.3;

export function usePlayerController() {
  const keys = useRef<Set<string>>(new Set());
  const meshRef = useRef<THREE.Group>(null);
  
  const {
    player, screen, updatePlayerPosition, updatePlayerRotation,
    setRunning, setShooting, switchWeapon, setPlayerInVehicle, vehicles
  } = useGameStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keys.current.add(e.key.toLowerCase());
    if (e.key.toLowerCase() === 'shift') setRunning(true);
    if (e.key.toLowerCase() === 'q') switchWeapon();
    if (e.key.toLowerCase() === 'f') {
      // Enter/exit vehicle
      if (player.inVehicle) {
        setPlayerInVehicle(null);
      } else {
        const nearVehicle = vehicles.find(v => {
          const dx = v.position[0] - player.position[0];
          const dz = v.position[2] - player.position[2];
          return Math.sqrt(dx * dx + dz * dz) < 3;
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
    pos[0] = Math.max(-50, Math.min(50, pos[0]));
    pos[2] = Math.max(-50, Math.min(50, pos[2]));

    if (moved) {
      updatePlayerPosition(pos);
      updatePlayerRotation(rot);
    }
  });

  return { meshRef, keys };
}
