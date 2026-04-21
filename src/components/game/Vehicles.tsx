import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import { MalibuCarModel, PontiacCarModel } from './AssetLibrary';

function carVariantFromId(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0 ? 'malibu' : 'pontiac';
}

function VehicleMesh({
  id,
  type,
  color,
  isPlayerVehicle,
}: {
  id: string;
  type: 'car' | 'motorcycle';
  color: string;
  isPlayerVehicle: boolean;
}) {
  if (type === 'motorcycle') {
    return (
      <group>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 1.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.1, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    );
  }

  const variant = carVariantFromId(id);

  return (
    <group>
      <Suspense
        fallback={
          <>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.6, 0.5, 3.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.7, -0.2]} castShadow>
              <boxGeometry args={[1.4, 0.4, 1.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        }
      >
        {variant === 'pontiac' ? (
          <PontiacCarModel position={[0, 0.46, 0]} scale={0.38} />
        ) : (
          <MalibuCarModel position={[0, 0.68, 0]} scale={0.9} />
        )}
      </Suspense>

      {isPlayerVehicle && (
        <>
          <pointLight position={[0.5, 0.4, 1.8]} color="#ffffcc" intensity={2} distance={15} />
          <pointLight position={[-0.5, 0.4, 1.8]} color="#ffffcc" intensity={2} distance={15} />
        </>
      )}
    </group>
  );
}

export default function Vehicles() {
  const vehicles = useGameStore((state) => state.vehicles);
  const currentVehicle = useGameStore((state) => state.player.currentVehicle);
  const refs = useRef<Record<string, THREE.Group | null>>({});

  useFrame(() => {
    const player = useGameStore.getState().player;
    if (player.inVehicle && player.currentVehicle) {
      const ref = refs.current[player.currentVehicle];
      if (ref) {
        ref.position.set(...player.position);
        ref.rotation.y = player.rotation;
      }
    }
  });

  return (
    <group>
      {vehicles.map((vehicle) => {
        const isPlayerVehicle = currentVehicle === vehicle.id;

        return (
          <group
            key={vehicle.id}
            ref={(element) => {
              refs.current[vehicle.id] = element;
            }}
            position={vehicle.position}
            rotation={[0, vehicle.rotation, 0]}
          >
            <VehicleMesh
              id={vehicle.id}
              type={vehicle.type}
              color={vehicle.color}
              isPlayerVehicle={isPlayerVehicle}
            />
          </group>
        );
      })}
    </group>
  );
}
