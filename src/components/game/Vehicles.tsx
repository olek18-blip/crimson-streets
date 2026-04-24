import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import { MalibuCarModel, PontiacCarModel } from './AssetLibrary';

const IS_MOBILE = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
const VEHICLE_INTERACT_RANGE = 4;
const TRAFFIC_SYNC_INTERVAL = 0.45;
const MAX_CARS = IS_MOBILE ? 2 : 4;
const MAX_RENDER_DIST = IS_MOBILE ? 90 : 130;
const HIGH_DETAIL_DIST = IS_MOBILE ? 0 : 25;

function carVariantFromId(id: string) {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0 ? 'malibu' : 'pontiac';
}

function getLaneConfig(index: number, origin: [number, number, number]) {
  const axis: 'x' | 'z' = index % 2 === 0 ? 'z' : 'x';
  const direction: 1 | -1 = index % 3 === 0 ? -1 : 1;
  const offset = ((index % 4) - 1.5) * 4;
  const startDistance = IS_MOBILE ? 24 + index * 7 : 32 + index * 9;

  if (axis === 'z') {
    return {
      axis,
      direction,
      x: origin[0] + offset,
      z: origin[2] - direction * startDistance,
      rotation: direction > 0 ? 0 : Math.PI,
      speed: IS_MOBILE ? 5.5 : 7,
    };
  }

  return {
    axis,
    direction,
    x: origin[0] - direction * startDistance,
    z: origin[2] + offset,
    rotation: direction > 0 ? Math.PI / 2 : -Math.PI / 2,
    speed: IS_MOBILE ? 5 : 6.5,
  };
}

function VehiclePrompt({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group position={[0, 1.7, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 18]} />
        <meshStandardMaterial color="#8fd3ff" emissive="#8fd3ff" emissiveIntensity={0.55} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function FakeShadow({ radius = 0.95 }: { radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
      <circleGeometry args={[radius, 16]} />
      <meshBasicMaterial color="#000000" opacity={0.28} transparent depthWrite={false} />
    </mesh>
  );
}

function SimpleVehicleBody({ type, color }: { type: 'car' | 'motorcycle'; color: string }) {
  if (type === 'motorcycle') {
    return (
      <group>
        <FakeShadow radius={0.55} />
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.38, 0.34, 1.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.1, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 10]} />
          <meshStandardMaterial color="#181818" />
        </mesh>
        <mesh position={[0, 0.1, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 10]} />
          <meshStandardMaterial color="#181818" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <FakeShadow radius={1.45} />
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.6, 0.5, 3.3]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.7, -0.16]}>
        <boxGeometry args={[1.25, 0.36, 1.55]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 1.7]}>
        <boxGeometry args={[1.2, 0.08, 0.06]} />
        <meshStandardMaterial color="#222" emissive="#ffdd88" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0, 0.32, -1.7]}>
        <boxGeometry args={[1.15, 0.07, 0.06]} />
        <meshStandardMaterial color="#221111" emissive="#ff3344" emissiveIntensity={0.22} />
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
    return <SimpleVehicleBody type={type} color={color} />;
  }

  const variant = carVariantFromId(id);

  return (
    <group>
      <FakeShadow radius={1.55} />
      <Suspense fallback={<SimpleVehicleBody type={type} color={color} />}>
        {variant === 'pontiac' ? (
          <PontiacCarModel position={[0, 0.46, 0]} scale={0.38} />
        ) : (
          <MalibuCarModel position={[0, 0.68, 0]} scale={0.9} />
        )}
      </Suspense>

      {isPlayerVehicle && !IS_MOBILE && (
        <>
          <mesh position={[0.5, 0.42, 1.85]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[-0.5, 0.42, 1.85]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={0.55} />
          </mesh>
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
  const laneStateRef = useRef<Record<string, { axis: 'x' | 'z'; direction: 1 | -1; speed: number; sync: number }>>({});

  useEffect(() => {
    vehicles.slice(0, MAX_CARS).forEach((vehicle, index) => {
      if (!laneStateRef.current[vehicle.id]) {
        const lane = getLaneConfig(index, playerPosition);
        laneStateRef.current[vehicle.id] = { axis: lane.axis, direction: lane.direction, speed: lane.speed, sync: 0 };
      }
    });
  }, [vehicles, playerPosition]);

  useFrame((_, delta) => {
    const player = useGameStore.getState().player;
    const dt = Math.min(delta, 0.05);

    vehicles.slice(0, MAX_CARS).forEach((vehicle, index) => {
      const ref = refs.current[vehicle.id];
      if (!ref) return;

      if (player.inVehicle && player.currentVehicle === vehicle.id) {
        ref.position.set(...player.position);
        ref.rotation.y = player.rotation;
        return;
      }

      let lane = laneStateRef.current[vehicle.id];
      if (!lane) {
        const cfg = getLaneConfig(index, player.position);
        lane = { axis: cfg.axis, direction: cfg.direction, speed: cfg.speed, sync: 0 };
        laneStateRef.current[vehicle.id] = lane;
        ref.position.set(cfg.x, vehicle.position[1], cfg.z);
        ref.rotation.y = cfg.rotation;
      }

      if (lane.axis === 'z') {
        ref.position.z += lane.direction * lane.speed * dt;
        ref.rotation.y = lane.direction > 0 ? 0 : Math.PI;
      } else {
        ref.position.x += lane.direction * lane.speed * dt;
        ref.rotation.y = lane.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      }

      const dx = ref.position.x - player.position[0];
      const dz = ref.position.z - player.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > (IS_MOBILE ? 44 : 62)) {
        const cfg = getLaneConfig(index, player.position);
        lane.axis = cfg.axis;
        lane.direction = cfg.direction;
        lane.speed = cfg.speed;
        ref.position.set(cfg.x, vehicle.position[1], cfg.z);
        ref.rotation.y = cfg.rotation;
      }

      lane.sync += dt;
      if (lane.sync >= TRAFFIC_SYNC_INTERVAL) {
        lane.sync = 0;
        updateVehicleTransform(vehicle.id, [ref.position.x, vehicle.position[1], ref.position.z], ref.rotation.y);
      }
    });
  });

  return (
    <group>
      {vehicles.slice(0, MAX_CARS).map((vehicle) => {
        const player = useGameStore.getState().player;
        const dx = vehicle.position[0] - player.position[0];
        const dz = vehicle.position[2] - player.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance > MAX_RENDER_DIST) {
          return null;
        }

        const isPlayerVehicle = currentVehicle === vehicle.id;
        const near = !player.inVehicle && distance < VEHICLE_INTERACT_RANGE;
        const useSimple = IS_MOBILE || distance > HIGH_DETAIL_DIST;

        return (
          <group
            key={vehicle.id}
            ref={(element) => {
              refs.current[vehicle.id] = element;
            }}
            position={vehicle.position}
            rotation={[0, vehicle.rotation, 0]}
          >
            {useSimple ? (
              <SimpleVehicleBody type={vehicle.type} color={vehicle.color} />
            ) : (
              <VehicleMesh id={vehicle.id} type={vehicle.type} color={vehicle.color} isPlayerVehicle={isPlayerVehicle} />
            )}
            <VehiclePrompt visible={near} />
          </group>
        );
      })}
    </group>
  );
}
