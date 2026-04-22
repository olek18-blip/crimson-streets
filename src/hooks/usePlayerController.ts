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
const GROUND_Y = 0.5;
const JUMP_VELOCITY = 6.8;
const GRAVITY = 20;
const HIT_REACTION_DURATION = 0.32;

export function usePlayerController() {
  const keys = useRef<Set<string>>(new Set());
  const jumpVelocity = useRef(0);
  const hitReactionTimer = useRef(0);
  const isTouchDeviceRef = useRef(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    keys.current.add(key);

    if (key.startsWith('arrow') || key === ' ') {
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
    jumpVelocity.current = 0;
    hitReactionTimer.current = 0;
    const { setRunning, setShooting, setPlayerAnimationState } = useGameStore.getState();
    setRunning(false);
    setShooting(false);
    setPlayerAnimationState('idle');
    useMobileControlsStore.getState().reset();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    isTouchDeviceRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
    const {
      screen,
      player,
      updatePlayerPosition,
      updatePlayerRotation,
      setShooting,
      setPlayerAnimationState,
    } = useGameStore.getState();
    const { axisX, axisY, sprint, shooting } = useMobileControlsStore.getState();

    if (screen !== 'playing') {
      return;
    }

    // Don't let "mobile controls" zero-state override desktop mouse shooting.
    if (isTouchDeviceRef.current) {
      setShooting(shooting);
    }

    const dt = Math.min(delta, MAX_DELTA);
    const playerIsDead = player.health <= 0 || player.animationState === 'death';

    if (playerIsDead) {
      if (player.animationState !== 'death') {
        setPlayerAnimationState('death');
      }
      return;
    }

    if (player.animationState === 'hit' && hitReactionTimer.current <= 0) {
      hitReactionTimer.current = HIT_REACTION_DURATION;
    }

    hitReactionTimer.current = Math.max(0, hitReactionTimer.current - dt);

    const usingTouchMovement = Math.abs(axisX) > 0.06 || Math.abs(axisY) > 0.06;
    const movingForward = keys.current.has('w') || keys.current.has('arrowup') || axisY < -0.1;
    const movingBackward = keys.current.has('s') || keys.current.has('arrowdown') || axisY > 0.1;
    const turningLeft = keys.current.has('a') || keys.current.has('arrowleft') || axisX < -0.1;
    const turningRight = keys.current.has('d') || keys.current.has('arrowright') || axisX > 0.1;
    const jumpPressed = keys.current.has(' ');
    const effectiveRunning = player.isRunning || sprint;
    const speed = player.inVehicle ? VEHICLE_SPEED : effectiveRunning ? RUN_SPEED : WALK_SPEED;

    let rotation = player.rotation;
    const position: [number, number, number] = [...player.position];
    let hasChanged = false;
    const isAirborne = position[1] > GROUND_Y + 0.01 || Math.abs(jumpVelocity.current) > 0.01;

    if (player.inVehicle) {
      if (position[1] !== GROUND_Y) {
        position[1] = GROUND_Y;
        updatePlayerPosition(position);
      }
      jumpVelocity.current = 0;
    } else if (jumpPressed && !isAirborne) {
      jumpVelocity.current = JUMP_VELOCITY;
      hasChanged = true;
    }

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

    if (!player.inVehicle && (Math.abs(jumpVelocity.current) > 0.01 || position[1] > GROUND_Y)) {
      jumpVelocity.current -= GRAVITY * dt;
      position[1] += jumpVelocity.current * dt;

      if (position[1] <= GROUND_Y) {
        position[1] = GROUND_Y;
        jumpVelocity.current = 0;
      }

      hasChanged = true;
    }

    position[0] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, position[0]));
    position[2] = Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, position[2]));

    if (hasChanged) {
      updatePlayerPosition(position);
      updatePlayerRotation(rotation);
    }

    const isMoving = movingForward || movingBackward;
    const nextAnimationState =
      hitReactionTimer.current > 0
        ? 'hit'
        : position[1] > GROUND_Y + 0.02 || Math.abs(jumpVelocity.current) > 0.1
          ? 'jump'
          : player.isShooting && player.weapon !== 'fist'
            ? 'shoot'
            : isMoving && effectiveRunning
              ? 'run'
              : isMoving
                ? 'walk'
                : 'idle';

    if (player.animationState !== nextAnimationState) {
      setPlayerAnimationState(nextAnimationState);
    }
  });

  return { keys };
}
