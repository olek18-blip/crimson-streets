import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

const POSITION_LERP = 0.11;
const LOOK_LERP = 0.14;
const YAW_LERP = 0.12;

function shortestAngleDelta(from: number, to: number) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export default function GameCamera() {
  const { camera, size } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const followYaw = useRef<number | null>(null);
  const lastPlayerPos = useRef<[number, number, number] | null>(null);

  useFrame(() => {
    const player = useGameStore.getState().player;
    const [px, py, pz] = player.position;
    const isMobile = size.width < 640;

    const previous = lastPlayerPos.current;
    const movedDistance = previous
      ? Math.hypot(px - previous[0], pz - previous[2])
      : 0;
    lastPlayerPos.current = [px, py, pz];

    const shouldFollowRotation =
      player.inVehicle ||
      player.isRunning ||
      player.isShooting ||
      movedDistance > 0.005;

    if (followYaw.current === null) {
      followYaw.current = player.rotation;
    } else if (shouldFollowRotation) {
      followYaw.current += shortestAngleDelta(followYaw.current, player.rotation) * YAW_LERP;
    }

    const yaw = followYaw.current ?? player.rotation;
    const camDist = player.inVehicle ? (isMobile ? 13.8 : 12.8) : isMobile ? 8.8 : 9.6;
    const camHeight = player.inVehicle ? (isMobile ? 7.2 : 6.2) : isMobile ? 6.2 : 5.4;
    const sideOffset = player.inVehicle ? 0 : isMobile ? 0.55 : 0.85;
    const lookAhead = player.inVehicle ? (isMobile ? 3.6 : 3.1) : isMobile ? 1.25 : 1.1;

    targetPos.current.set(
      px + Math.sin(yaw) * camDist + Math.cos(yaw) * sideOffset,
      py + camHeight,
      pz + Math.cos(yaw) * camDist - Math.sin(yaw) * sideOffset,
    );

    lookTarget.current.set(
      px - Math.sin(yaw) * lookAhead,
      py + (player.inVehicle ? 1.2 : 1.05),
      pz - Math.cos(yaw) * lookAhead,
    );

    camera.up.set(0, 1, 0);
    camera.position.lerp(targetPos.current, POSITION_LERP);

    if (smoothedLook.current.lengthSq() === 0) {
      smoothedLook.current.copy(lookTarget.current);
    } else {
      smoothedLook.current.lerp(lookTarget.current, LOOK_LERP);
    }

    camera.lookAt(smoothedLook.current);
  });

  return null;
}
