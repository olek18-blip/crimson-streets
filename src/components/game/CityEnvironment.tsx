import { cities, WORLD_SIZE } from '../../game/worldData';

function rand(seed: number) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function cityRand(cx: number, cz: number, i: number) {
  return rand(cx * 91.17 + cz * 53.41 + i * 17.73);
}

function Building({
  position,
  size,
  color,
  emissive,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} emissive={emissive || '#000000'} emissiveIntensity={emissive ? 0.18 : 0} />
      </mesh>
      <mesh position={[0, size[1] + 0.08, 0]} castShadow>
        <boxGeometry args={[size[0] * 0.9, 0.16, size[2] * 0.9]} />
        <meshStandardMaterial color="#171b22" />
      </mesh>
    </group>
  );
}

function NeonSign({ position, size = [2.8, 0.28, 0.05] as [number, number, number], color = '#ff4fd8' }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
    </mesh>
  );
}

function WindowBands({
  basePosition,
  width,
  height,
  depth,
  color,
}: {
  basePosition: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}) {
  const rows = Math.max(1, Math.floor(height / 2.5));
  return (
    <group position={basePosition}>
      {Array.from({ length: rows }).map((_, i) => (
        <mesh key={i} position={[0, 1 + i * 2.05, depth / 2 + 0.03]}>
          <boxGeometry args={[width * 0.74, 0.16, 0.04]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function WetPatch({ position, size, rotation = 0 }: { position: [number, number, number]; size: [number, number]; rotation?: number }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, rotation, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#111820" emissive="#162330" emissiveIntensity={0.18} transparent opacity={0.62} />
    </mesh>
  );
}

function MissionZone({
  position,
  radius,
  color,
  height = 4,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  height?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.45, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, height, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function CityBuildings({ cx, cz, radius, cityId }: { cx: number; cz: number; radius: number; cityId: string }) {
  const palette: Record<string, { base: string[]; window: string; sign?: string }> = {
    madrona: { base: ['#343946', '#2b303a', '#414857', '#262a33', '#535b69'], window: '#d6a258', sign: '#ff9d3a' },
    barceloma: { base: ['#412f42', '#32263a', '#57374d', '#261d2e', '#684160'], window: '#ff61d2', sign: '#00d4ff' },
    valentia: { base: ['#31414d', '#253640', '#415767', '#1f2e36', '#586b78'], window: '#8cc3ff', sign: '#cf6d2b' },
    sevira: { base: ['#5b4838', '#4b3a2d', '#6a5647', '#3d2d25', '#806b58'], window: '#e5bf86', sign: '#9b6730' },
    costadelsol: { base: ['#365366', '#284356', '#46657a', '#203746', '#607988'], window: '#ffd57b', sign: '#f0b04d' },
  };

  const colors = palette[cityId] || palette.madrona;
  const denseFactor = cityId === 'madrona' ? 1.45 : cityId === 'barceloma' ? 1.25 : cityId === 'costadelsol' ? 1.1 : 1;
  const count = Math.floor(radius * 0.95);

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = cityRand(cx, cz, i) * Math.PI * 2;
        const dist = 8 + cityRand(cx, cz, i + 100) * (radius - 10);
        const bx = cx + Math.cos(angle) * dist;
        const bz = cz + Math.sin(angle) * dist;

        const roadCross = Math.abs(bx - cx) < 5 || Math.abs(bz - cz) < 5;
        if (roadCross) return null;

        const w = 2.7 + cityRand(cx, cz, i + 200) * 6.2;
        const d = 2.7 + cityRand(cx, cz, i + 300) * 6.2;
        const h = 3 + cityRand(cx, cz, i + 400) * 14 * denseFactor;
        const color = colors.base[Math.floor(cityRand(cx, cz, i + 500) * colors.base.length)];
        const glow = (cityId === 'madrona' || cityId === 'barceloma') && cityRand(cx, cz, i + 600) > 0.72;

        return (
          <group key={`${cityId}-b-${i}`}>
            <Building position={[bx, 0, bz]} size={[w, h, d]} color={color} emissive={glow ? colors.window : undefined} />
            <WindowBands basePosition={[bx, 0, bz]} width={w} height={h} depth={d} color={glow ? colors.window : '#91a0ad'} />
            {glow && colors.sign && (
              <NeonSign position={[bx, Math.min(h - 1, 2.4), bz + d / 2 + 0.18]} size={[Math.min(3.2, w * 0.82), 0.32, 0.05]} color={colors.sign} />
            )}
          </group>
        );
      })}
    </group>
  );
}

function CityLandmarks({ cityId, cx, cz }: { cityId: string; cx: number; cz: number }) {
  switch (cityId) {
    case 'madrona':
      return (
        <group>
          <Building position={[cx, 0, cz]} size={[14, 10, 10]} color="#545b68" />
          <mesh position={[cx, 10.8, cz]}>
            <coneGeometry args={[4.8, 3.5, 4]} />
            <meshStandardMaterial color="#b9923d" emissive="#8b6b25" emissiveIntensity={0.25} />
          </mesh>
          <Building position={[cx + 18, 0, cz - 14]} size={[5, 22, 5]} color="#2d3550" emissive="#d6a258" />
          <Building position={[cx + 24, 0, cz - 14]} size={[4, 17, 4]} color="#39425b" emissive="#d6a258" />
        </group>
      );
    case 'barceloma':
      return (
        <group>
          <mesh position={[cx + 28, 0.35, cz]} receiveShadow>
            <boxGeometry args={[4, 0.7, 34]} />
            <meshStandardMaterial color="#8f7558" />
          </mesh>
          <Building position={[cx + 9, 0, cz + 6]} size={[12, 7, 9]} color="#261d36" emissive="#ff61d2" />
          <pointLight position={[cx + 9, 8, cz + 6]} color="#ff61d2" intensity={3.5} distance={24} />
          <pointLight position={[cx + 13, 4, cz + 8]} color="#00d4ff" intensity={2.5} distance={16} />
        </group>
      );
    case 'valentia':
      return (
        <group>
          <mesh position={[cx + 24, 8, cz + 22]}>
            <boxGeometry args={[1, 16, 1]} />
            <meshStandardMaterial color="#cf6d2b" />
          </mesh>
          <mesh position={[cx + 29, 15, cz + 22]}>
            <boxGeometry args={[12, 0.6, 1]} />
            <meshStandardMaterial color="#cf6d2b" />
          </mesh>
          <Building position={[cx + 18, 0, cz + 16]} size={[16, 5, 10]} color="#3a342f" />
          {[0, 3.2, 6.4, 9.6].map((i, idx) => (
            <mesh key={idx} position={[cx + 18 + i, 1.05, cz + 28]} castShadow>
              <boxGeometry args={[2.8, 2.1, 5.3]} />
              <meshStandardMaterial color={['#c14545', '#3564cc', '#3ca35b', '#d28f2f'][idx]} />
            </mesh>
          ))}
        </group>
      );
    case 'sevira':
      return (
        <group>
          <mesh position={[cx, 0.05, cz]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[9, 36]} />
            <meshStandardMaterial color="#c3a27a" />
          </mesh>
          <mesh position={[cx, 1.5, cz]}>
            <cylinderGeometry args={[2, 2.5, 3, 16]} />
            <meshStandardMaterial color="#8b837a" />
          </mesh>
          <Building position={[cx - 16, 0, cz + 11]} size={[5, 15, 5]} color="#857159" />
          <mesh position={[cx - 16, 16.7, cz + 11]}>
            <coneGeometry args={[2.2, 4, 4]} />
            <meshStandardMaterial color="#6d5336" />
          </mesh>
        </group>
      );
    case 'costadelsol':
      return (
        <group>
          <Building position={[cx, 0, cz]} size={[16, 8, 12]} color="#294152" emissive="#ffd57b" />
          <pointLight position={[cx, 9, cz]} color="#f0b04d" intensity={4} distance={28} />
          <mesh position={[cx - 20, 0.28, cz - 10]}>
            <boxGeometry args={[3, 0.55, 25]} />
            <meshStandardMaterial color="#8c7255" />
          </mesh>
          <mesh position={[cx - 25, 0.7, cz - 15]}>
            <boxGeometry args={[2.2, 1.4, 7]} />
            <meshStandardMaterial color="#f4f4f4" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Road({ start, end, width = 5 }: { start: [number, number]; end: [number, number]; width?: number }) {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (start[0] + end[0]) / 2;
  const cz = (start[1] + end[1]) / 2;
  return (
    <group position={[cx, 0, cz]} rotation={[0, angle, 0]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[width + 1.1, 0.04, length + 1]} />
        <meshStandardMaterial color="#4c4c4c" />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.06, length]} />
        <meshStandardMaterial color="#24272c" />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.12, 0.01, length * 0.92]} />
        <meshStandardMaterial color="#d4b46b" emissive="#d4b46b" emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

function StreetLight({ position, color = '#ffcc66' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshStandardMaterial color="#565b63" />
      </mesh>
      <mesh position={[0, 3.7, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
      </mesh>
      <pointLight position={[0, 3.5, 0]} color={color} intensity={2.2} distance={16} />
    </group>
  );
}

function SidewalkGrid({ cityId, cx, cz, radius }: { cityId: string; cx: number; cz: number; radius: number }) {
  const pieces: JSX.Element[] = [];
  const step = 10;
  for (let x = -radius; x <= radius; x += step) {
    pieces.push(
      <mesh key={`${cityId}-sx-${x}`} position={[cx + x, 0.055, cz - 4.2]} receiveShadow>
        <boxGeometry args={[8, 0.06, 2.2]} />
        <meshStandardMaterial color="#6a6763" />
      </mesh>
    );
    pieces.push(
      <mesh key={`${cityId}-sx2-${x}`} position={[cx + x, 0.055, cz + 4.2]} receiveShadow>
        <boxGeometry args={[8, 0.06, 2.2]} />
        <meshStandardMaterial color="#6a6763" />
      </mesh>
    );
  }
  for (let z = -radius; z <= radius; z += step) {
    pieces.push(
      <mesh key={`${cityId}-sz-${z}`} position={[cx - 4.2, 0.055, cz + z]} receiveShadow>
        <boxGeometry args={[2.2, 0.06, 8]} />
        <meshStandardMaterial color="#6a6763" />
      </mesh>
    );
    pieces.push(
      <mesh key={`${cityId}-sz2-${z}`} position={[cx + 4.2, 0.055, cz + z]} receiveShadow>
        <boxGeometry args={[2.2, 0.06, 8]} />
        <meshStandardMaterial color="#6a6763" />
      </mesh>
    );
  }
  return <group>{pieces}</group>;
}

function MarketStall({ position, canopy = '#8c3c2e' }: { position: [number, number, number]; canopy?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#4b3a2b" />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[3.2, 0.22, 2.1]} />
        <meshStandardMaterial color={canopy} emissive={canopy} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function PoliceBarrier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[4.5, 0.9, 0.28]} />
        <meshStandardMaterial color="#223450" />
      </mesh>
      <mesh position={[0, 0.85, 0.16]}>
        <boxGeometry args={[4.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#e6e6e6" emissive="#e6e6e6" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Dumpster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.3, 1.6, 1.2]} />
        <meshStandardMaterial color="#355448" />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[2.35, 0.15, 1.25]} />
        <meshStandardMaterial color="#243a32" />
      </mesh>
    </group>
  );
}

function MandrilDistrictPass() {
  return (
    <group>
      <MissionZone position={[3, 0, -18]} radius={3.4} color="#5fb4ff" height={4.8} />
      <MissionZone position={[-18, 0, 8]} radius={4.1} color="#d6a258" height={4.2} />
      <MissionZone position={[18, 0, 8]} radius={4.4} color="#ff61d2" height={4.8} />
      <MissionZone position={[26, 0, 24]} radius={4.8} color="#ff9d3a" height={4.8} />
      <MissionZone position={[28, 0, 25]} radius={3.1} color="#ffe082" height={3.8} />

      <WetPatch position={[-18, 0.105, 2]} size={[22, 8]} rotation={0.08} />
      <WetPatch position={[12, 0.105, -4]} size={[18, 7]} rotation={-0.12} />
      <WetPatch position={[23, 0.105, 22]} size={[16, 6]} rotation={0.05} />

      <mesh position={[-18, 0.06, 6]} receiveShadow>
        <boxGeometry args={[18, 0.08, 10]} />
        <meshStandardMaterial color="#69655f" />
      </mesh>
      {[-24, -19, -14, -9].map((x, i) => (
        <MarketStall key={`stall-${i}`} position={[x, 0, 7 + (i % 2) * 2.4]} canopy={i % 2 === 0 ? '#8c3c2e' : '#70542d'} />
      ))}

      <PoliceBarrier position={[0, 0, -18]} />
      <PoliceBarrier position={[6, 0, -18]} />
      <pointLight position={[3, 3.5, -18]} color="#5fb4ff" intensity={1.8} distance={12} />
      <pointLight position={[-2, 2.8, -14]} color="#4c8dff" intensity={0.8} distance={10} />

      <Building position={[18, 0, 8]} size={[12, 8, 10]} color="#251c35" emissive="#ff61d2" />
      <NeonSign position={[18, 4.2, 13.2]} size={[4.4, 0.38, 0.05]} color="#ff61d2" />
      <NeonSign position={[22.8, 2.8, 13.2]} size={[2.5, 0.24, 0.05]} color="#00d4ff" />
      <pointLight position={[18, 6, 12]} color="#ff61d2" intensity={2.6} distance={16} />
      <pointLight position={[22, 4, 11]} color="#00d4ff" intensity={1.8} distance={10} />

      <Building position={[26, 0, 24]} size={[14, 5, 11]} color="#3a342f" />
      <Dumpster position={[20, 0, 23]} />
      <Dumpster position={[31, 0, 27]} />
      <mesh position={[26, 0.08, 30]} receiveShadow>
        <boxGeometry args={[18, 0.08, 7]} />
        <meshStandardMaterial color="#6a6763" />
      </mesh>
      <mesh position={[26, 2.4, 29.5]}>
        <boxGeometry args={[7, 0.22, 0.05]} />
        <meshStandardMaterial color="#ff9d3a" emissive="#ff9d3a" emissiveIntensity={0.9} />
      </mesh>

      <Building position={[10, 0, -10]} size={[7, 12, 7]} color="#39425b" emissive="#d6a258" />
      <Building position={[15, 0, -12]} size={[5, 15, 5]} color="#2d3550" emissive="#d6a258" />

      {[[-8, -6], [-2, -6], [4, -6], [10, -6], [16, -6], [22, -6]].map((p, i) => (
        <StreetLight key={`mandril-light-${i}`} position={[p[0], 0, p[1]]} color={i < 2 ? '#ffcc66' : i < 4 ? '#5fb4ff' : '#ff7f59'} />
      ))}
    </group>
  );
}

function DistrictProps({ cityId, cx, cz }: { cityId: string; cx: number; cz: number }) {
  switch (cityId) {
    case 'madrona':
      return (
        <group>
          {[-14, -8, -2, 4].map((z, i) => (
            <MarketStall key={i} position={[cx - 18, 0, cz + z]} canopy={i % 2 === 0 ? '#8c3c2e' : '#70542d'} />
          ))}
        </group>
      );
    case 'barceloma':
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <Building key={i} position={[cx - 10 + i * 5, 0, cz - 10]} size={[3, 2.6, 2]} color={i === 1 ? '#2f2440' : '#2b2440'} emissive={i === 1 ? '#ff61d2' : undefined} />
          ))}
        </group>
      );
    case 'valentia':
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[cx + 8 + i * 4, 1.1, cz + 10]} castShadow>
              <boxGeometry args={[3.4, 2.2, 6]} />
              <meshStandardMaterial color={['#c14545', '#3564cc', '#3ca35b'][i]} />
            </mesh>
          ))}
        </group>
      );
    case 'sevira':
      return (
        <group>
          <Building position={[cx + 12, 0, cz - 8]} size={[5, 3.6, 4]} color="#6a503c" />
        </group>
      );
    case 'costadelsol':
      return (
        <group>
          <Building position={[cx + 14, 0, cz + 8]} size={[4, 3.2, 4]} color="#e5d5b8" emissive="#ffd57b" />
          <pointLight position={[cx + 14, 3.5, cz + 8]} color="#ffd57b" intensity={1.6} distance={12} />
        </group>
      );
    default:
      return null;
  }
}

function Waterfront() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[210, -0.28, 0]}>
        <planeGeometry args={[420, 820]} />
        <meshStandardMaterial color="#10324b" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-210, -0.3, -210]}>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#123047" transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

function RuralZones() {
  const trees: [number, number, number][] = [];
  for (let i = 0; i < 220; i++) {
    const angle = (i / 220) * Math.PI * 2 * 5 + i * 0.71;
    const dist = 65 + Math.sin(i * 0.27) * 82;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const inCity = cities.some((c) => {
      const dx = x - c.center[0];
      const dz = z - c.center[2];
      return Math.sqrt(dx * dx + dz * dz) < c.radius + 12;
    });
    if (!inCity && Math.abs(x) < WORLD_SIZE && Math.abs(z) < WORLD_SIZE) {
      trees.push([x, 0, z]);
    }
  }

  return (
    <group>
      {trees.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 3]} />
            <meshStandardMaterial color="#5c3b1f" />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[1.6, 3.2, 7]} />
            <meshStandardMaterial color="#214c24" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DistrictMarker({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group>
      <mesh position={[x, 0.11, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 3.55, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.55} />
      </mesh>
      <mesh position={[x, 3.8, z]}>
        <cylinderGeometry args={[0.08, 0.08, 7.6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export default function CityEnvironment() {
  const lights: [number, number, number][] = [];
  for (let i = -WORLD_SIZE; i < WORLD_SIZE; i += 24) {
    lights.push([3.5, 0, i]);
    lights.push([i, 0, 3.5]);
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]} receiveShadow>
        <planeGeometry args={[WORLD_SIZE * 2.8, WORLD_SIZE * 2.8]} />
        <meshStandardMaterial color="#1b3320" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
        <planeGeometry args={[WORLD_SIZE * 2.4, WORLD_SIZE * 2.4]} />
        <meshStandardMaterial color="#1d2620" transparent opacity={0.15} />
      </mesh>

      <Waterfront />

      {cities.map((city) => (
        <group key={`district-${city.id}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[city.center[0], 0.012, city.center[2]]} receiveShadow>
            <circleGeometry args={[city.radius, 40]} />
            <meshStandardMaterial color={city.id === 'barceloma' ? '#282034' : city.id === 'valentia' ? '#262c31' : '#2b2b2b'} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[city.center[0], 0.018, city.center[2]]} receiveShadow>
            <ringGeometry args={[city.radius - 0.45, city.radius, 40]} />
            <meshStandardMaterial color={city.color} emissive={city.color} emissiveIntensity={0.15} transparent opacity={0.18} />
          </mesh>
          <SidewalkGrid cityId={city.id} cx={city.center[0]} cz={city.center[2]} radius={Math.min(city.radius - 6, 32)} />
        </group>
      ))}

      {cities.map((city) => (
        <CityBuildings key={city.id} cx={city.center[0]} cz={city.center[2]} radius={city.radius} cityId={city.id} />
      ))}
      {cities.map((city) => (
        <CityLandmarks key={`lm-${city.id}`} cityId={city.id} cx={city.center[0]} cz={city.center[2]} />
      ))}
      {cities.map((city) => (
        <DistrictProps key={`props-${city.id}`} cityId={city.id} cx={city.center[0]} cz={city.center[2]} />
      ))}

      <MandrilDistrictPass />

      <Road start={[40, 0]} end={[140, -120]} width={6} />
      <Road start={[40, 40]} end={[100, 150]} width={6} />
      <Road start={[-40, 40]} end={[-120, 130]} width={6} />
      <Road start={[-40, -40]} end={[-80, -160]} width={6} />
      <Road start={[180, -80]} end={[160, 110]} width={5} />
      <Road start={[-140, 90]} end={[-130, -120]} width={5} />
      <Road start={[140, -120]} end={[180, -80]} width={5} />
      <Road start={[140, 150]} end={[160, 110]} width={5} />
      <Road start={[-40, -40]} end={[40, -40]} width={5} />
      <Road start={[-40, 0]} end={[40, 0]} width={5} />
      <Road start={[0, -40]} end={[0, 40]} width={5} />

      {lights.slice(0, 34).map((pos, i) => (
        <StreetLight key={i} position={pos} />
      ))}

      <pointLight position={[190, 6, -112]} color="#ff61d2" intensity={2.5} distance={20} />
      <pointLight position={[198, 5, -106]} color="#00d4ff" intensity={2} distance={14} />
      <pointLight position={[0, 5, 0]} color="#d6a258" intensity={1.2} distance={22} />

      {cities.map((city) => {
        const offset = city.id === 'madrona' ? [25, 25] : [city.center[0] + 10, city.center[2] + 10];
        return <DistrictMarker key={`marker-${city.id}`} x={offset[0]} z={offset[1]} color={city.color} />;
      })}

      <RuralZones />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[2200, 2200]} />
        <meshStandardMaterial color="#0a2235" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}
