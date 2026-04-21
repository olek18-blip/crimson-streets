import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

export default function GameCamera() {
  const { camera, size } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame(() => {
    const player = useGameStore.getState().player;
    const [px, py, pz] = player.position;
    const rot = player.rotation;
    const isMobile = size.width < 640;

    const camDist = player.inVehicle ? (isMobile ? 15.5 : 14) : isMobile ? 8.6 : 10;
    const camHeight = player.inVehicle ? (isMobile ? 8.6 : 7) : isMobile ? 7.2 : 6;
    const lookAhead = player.inVehicle ? (isMobile ? 4.2 : 3.2) : isMobile ? 1.6 : 1;

    targetPos.current.set(
      px + Math.sin(rot) * camDist,
      py + camHeight,
      pz + Math.cos(rot) * camDist,
    );

    targetLook.current.set(
      px - Math.sin(rot) * lookAhead,
      py + (isMobile ? 1.3 : 1),
      pz - Math.cos(rot) * lookAhead,
    );

    camera.position.lerp(targetPos.current, isMobile ? 0.085 : 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}
