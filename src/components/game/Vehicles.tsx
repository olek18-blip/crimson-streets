import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import { isFastDev } from '../../game/env';
import { MalibuCarModel, PontiacCarModel } from './AssetLibrary';

const VEHICLE_INTERACT_RANGE = 4;
const TRAFFIC_SYNC_INTERVAL = 0.28;

function carVariantFromId(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0 ? 'malibu' : 'pontiac';
}

function VehiclePrompt({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group position={[0, 1.7, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 24]} />
        <meshStandardMaterial color="#8fd3ff" emissive="#8fd3ff" emissiveIntensity={0.9} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#ffffff" emissive="#8fd3ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
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
  const playerPosition = useGameStore((state) => state.player.position);
  const updateVehicleTransform = useGameStore((state) => state.updateVehicleTransform);
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const homeRef = useRef<Record<string, [number, number, number]>>({});
  const trafficStateRef = useRef<Record<string, { angle: number; radius: number; speed: number; sync: number; yawOffset: number }>>({});

  useEffect(() => {
    vehicles.forEach((vehicle, index) => {
      if (!homeRef.current[vehicle.id]) {
        homeRef.current[vehicle.id] = [...vehicle.position] as [number, number, number];
      }
      if (!trafficStateRef.current[vehicle.id]) {
        const base = vehicle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 13;
        trafficStateRef.current[vehicle.id] = {
          angle: (base % 360) * (Math.PI / 180),
          radius: vehicle.type === 'motorcycle' ? 4 + (base % 3) : 6 + (base % 5),
          speed: vehicle.type === 'motorcycle' ? 0.8 + (base % 4) * 0.08 : 0.45 + (base % 5) * 0.05,
          sync: 0,
          yawOffset: (base % 5) * 0.18,
        };
      }
    });
  }, [vehicles]);

  useFrame((_, delta) => {
    const player = useGameStore.getState().player;

    vehicles.forEach((vehicle) => {
      const ref = refs.current[vehicle.id];
      if (!ref) return;

      if (player.inVehicle && player.currentVehicle === vehicle.id) {
        ref.position.set(...player.position);
        ref.rotation.y = player.rotation;
        return;
      }

      const home = homeRef.current[vehicle.id] ?? vehicle.position;
      const traffic = trafficStateRef.current[vehicle.id];
      if (!traffic) return;

      traffic.angle += delta * traffic.speed;
      traffic.sync += delta;

      const wobble = Math.sin(traffic.angle * 2.1 + traffic.yawOffset) * (vehicle.type === 'motorcycle' ? 0.6 : 1.1);
      const nextX = home[0] + Math.cos(traffic.angle) * traffic.radius;
      const nextZ = home[2] + Math.sin(traffic.angle) * (traffic.radius * 0.68) + wobble;
      const lookAheadX = home[0] + Math.cos(traffic.angle + 0.08) * traffic.radius;
      const lookAheadZ = home[2] + Math.sin(traffic.angle + 0.08) * (traffic.radius * 0.68) + Math.sin((traffic.angle + 0.08) * 2.1 + traffic.yawOffset) * (vehicle.type === 'motorcycle' ? 0.6 : 1.1);
      const nextRot = Math.atan2(lookAheadX - nextX, lookAheadZ - nextZ);

      ref.position.set(nextX, vehicle.position[1], nextZ);
      ref.rotation.y = nextRot;

      if (traffic.sync >= TRAFFIC_SYNC_INTERVAL) {
        traffic.sync = 0;
        updateVehicleTransform(vehicle.id, [nextX, vehicle.position[1], nextZ], nextRot);
      }
    });
  });

  return (
    <group>
      {vehicles.map((vehicle) => {
        const playerDx = vehicle.position[0] - playerPosition[0];
        const playerDz = vehicle.position[2] - playerPosition[2];
        if (playerDx * playerDx + playerDz * playerDz > (isFastDev ? 90 * 90 : 170 * 170)) {
          return null;
        }

        const isPlayerVehicle = currentVehicle === vehicle.id;
        const player = useGameStore.getState().player;
        const dx = vehicle.position[0] - player.position[0];
        const dz = vehicle.position[2] - player.position[2];
        const near = !player.inVehicle && Math.sqrt(dx * dx + dz * dz) < VEHICLE_INTERACT_RANGE;

        return (
          <group
            key={vehicle.id}
            ref={(element) => {
              refs.current[vehicle.id] = element;
            }}
            position={vehicle.position}
            rotation={[0, vehicle.rotation, 0]}
          >
            <VehicleMesh id={vehicle.id} type={vehicle.type} color={vehicle.color} isPlayerVehicle={isPlayerVehicle} />
            <VehiclePrompt visible={near} />
          </group>
        );
      })}
    </group>
  );
}
