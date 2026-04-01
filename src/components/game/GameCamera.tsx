import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

export default function GameCamera() {
  const { camera } = useThree();
  const { player } = useGameStore();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame(() => {
    const [px, py, pz] = player.position;
    const rot = player.rotation;
    
    const camDist = player.inVehicle ? 12 : 8;
    const camHeight = player.inVehicle ? 6 : 5;
    
    targetPos.current.set(
      px + Math.sin(rot) * camDist,
      py + camHeight,
      pz + Math.cos(rot) * camDist
    );
    
    targetLook.current.set(px, py + 1, pz);

    camera.position.lerp(targetPos.current, 0.08);
    const lookTarget = new THREE.Vector3().copy(camera.position).lerp(targetLook.current, 1);
    camera.lookAt(targetLook.current);
  });

  return null;
}
