import { cities, WORLD_SIZE } from '../../game/worldData';

// Generate buildings for a city
function CityBuildings({ cx, cz, radius, cityId }: { cx: number; cz: number; radius: number; cityId: string }) {
  const buildings: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [];
  
  // Seeded random based on city position
  const seed = Math.abs(cx * 100 + cz * 37);
  const rng = (i: number) => {
    const x = Math.sin(seed + i * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const palette: Record<string, string[]> = {
    madrona: ['#4a4a5a', '#3a3a4a', '#5a5a6a', '#6a6a7a', '#2d2d3d'],
    barceloma: ['#5a3a3a', '#6a4040', '#4a3535', '#7a5050', '#3a2525'],
    valentia: ['#3a4a5a', '#2a3a4a', '#4a5a6a', '#1a2a3a', '#5a6a7a'],
    sevira: ['#5a4a3a', '#6a5a4a', '#4a3a2a', '#7a6a5a', '#3a2a1a'],
    costadelsol: ['#4a5a4a', '#3a4a3a', '#5a6a5a', '#2a3a2a', '#6a7a6a'],
  };
  const colors = palette[cityId] || palette.madrona;

  const numBuildings = Math.floor(radius * 0.8);
  for (let i = 0; i < numBuildings; i++) {
    const angle = rng(i) * Math.PI * 2;
    const dist = rng(i + 100) * (radius - 8) * 0.8;
    const bx = cx + Math.cos(angle) * dist;
    const bz = cz + Math.sin(angle) * dist;
    const w = 2 + rng(i + 200) * 6;
    const h = 3 + rng(i + 300) * (cityId === 'madrona' ? 18 : 12);
    const d = 2 + rng(i + 400) * 6;
    buildings.push({
      pos: [bx, 0, bz],
      size: [w, h, d],
      color: colors[Math.floor(rng(i + 500) * colors.length)],
    });
  }

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.pos[0], b.size[1] / 2, b.pos[2]]} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
}

// Special landmarks per city
function CityLandmarks({ cityId, cx, cz }: { cityId: string; cx: number; cz: number }) {
  switch (cityId) {
    case 'madrona':
      return (
        <group>
          {/* Government Palace */}
          <mesh position={[cx, 5, cz]} castShadow>
            <boxGeometry args={[12, 10, 8]} />
            <meshStandardMaterial color="#5a5a6a" />
          </mesh>
          <mesh position={[cx, 10.5, cz]}>
            <coneGeometry args={[4, 3, 4]} />
            <meshStandardMaterial color="#c4a035" />
          </mesh>
          {/* Financial towers */}
          <mesh position={[cx + 20, 10, cz - 15]} castShadow>
            <boxGeometry args={[5, 20, 5]} />
            <meshStandardMaterial color="#3a3a5a" />
          </mesh>
          <mesh position={[cx + 25, 8, cz - 15]} castShadow>
            <boxGeometry args={[4, 16, 4]} />
            <meshStandardMaterial color="#4a4a6a" />
          </mesh>
        </group>
      );
    case 'barceloma':
      return (
        <group>
          {/* Beach pier */}
          <mesh position={[cx + 30, 0.5, cz]} receiveShadow>
            <boxGeometry args={[4, 1, 30]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          {/* Nightclub */}
          <mesh position={[cx + 10, 3, cz + 5]} castShadow>
            <boxGeometry args={[10, 6, 8]} />
            <meshStandardMaterial color="#2a1a3a" />
          </mesh>
          <pointLight position={[cx + 10, 7, cz + 5]} color="#ff00ff" intensity={3} distance={20} />
          <pointLight position={[cx + 15, 4, cz + 8]} color="#00ffff" intensity={2} distance={15} />
        </group>
      );
    case 'valentia':
      return (
        <group>
          {/* Port cranes */}
          <mesh position={[cx + 25, 8, cz + 20]}>
            <boxGeometry args={[1, 16, 1]} />
            <meshStandardMaterial color="#cc6600" />
          </mesh>
          <mesh position={[cx + 25, 15, cz + 20]}>
            <boxGeometry args={[12, 0.5, 1]} />
            <meshStandardMaterial color="#cc6600" />
          </mesh>
          {/* Warehouses */}
          <mesh position={[cx + 20, 2.5, cz + 15]} castShadow>
            <boxGeometry args={[14, 5, 10]} />
            <meshStandardMaterial color="#3d3025" />
          </mesh>
          {/* Container stacks */}
          {[0, 3, 6].map(i => (
            <mesh key={i} position={[cx + 18 + i, 1, cz + 25]} castShadow>
              <boxGeometry args={[2.5, 2, 5]} />
              <meshStandardMaterial color={['#cc3333', '#3333cc', '#33cc33'][i / 3]} />
            </mesh>
          ))}
        </group>
      );
    case 'sevira':
      return (
        <group>
          {/* Plaza central */}
          <mesh position={[cx, 0.05, cz]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[8, 32]} />
            <meshStandardMaterial color="#c4a882" />
          </mesh>
          {/* Fountain */}
          <mesh position={[cx, 1.5, cz]}>
            <cylinderGeometry args={[2, 2.5, 3, 16]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          {/* Church tower */}
          <mesh position={[cx - 15, 7, cz + 10]} castShadow>
            <boxGeometry args={[5, 14, 5]} />
            <meshStandardMaterial color="#8a7a5a" />
          </mesh>
          <mesh position={[cx - 15, 15, cz + 10]}>
            <coneGeometry args={[2, 4, 4]} />
            <meshStandardMaterial color="#6a5a3a" />
          </mesh>
        </group>
      );
    case 'costadelsol':
      return (
        <group>
          {/* Casino */}
          <mesh position={[cx, 4, cz]} castShadow>
            <boxGeometry args={[15, 8, 12]} />
            <meshStandardMaterial color="#2a3a4a" />
          </mesh>
          <pointLight position={[cx, 9, cz]} color="#ffaa00" intensity={4} distance={25} />
          {/* Marina pier */}
          <mesh position={[cx - 20, 0.3, cz - 10]}>
            <boxGeometry args={[3, 0.6, 25]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          {/* Yacht */}
          <mesh position={[cx - 25, 0.5, cz - 15]}>
            <boxGeometry args={[2, 1.5, 6]} />
            <meshStandardMaterial color="#ffffff" />
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
    <mesh position={[cx, 0.03, cz]} rotation={[0, angle, 0]} receiveShadow>
      <boxGeometry args={[width, 0.06, length]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <pointLight position={[0, 3.5, 0]} color="#ffcc66" intensity={2} distance={15} />
    </group>
  );
}

// Rural zone decorations
function RuralZones() {
  const trees: [number, number, number][] = [];
  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 2 * 5 + i * 0.7;
    const dist = 60 + Math.sin(i * 0.3) * 80;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    // Skip if inside a city
    const inCity = cities.some(c => {
      const dx = x - c.center[0];
      const dz = z - c.center[2];
      return Math.sqrt(dx * dx + dz * dz) < c.radius + 10;
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
            <meshStandardMaterial color="#5a3a1a" />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[1.5, 3, 6]} />
            <meshStandardMaterial color="#1a4a1a" />
          </mesh>
        </group>
      ))}
      {/* Farm buildings scattered in rural areas */}
      {[
        [80, 0, 60] as [number, number, number],
        [-80, 0, -60] as [number, number, number],
        [50, 0, -80] as [number, number, number],
        [-60, 0, 80] as [number, number, number],
      ].map((pos, i) => (
        <group key={`farm-${i}`} position={pos}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[6, 3, 8]} />
            <meshStandardMaterial color="#6a4a2a" />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[6.5, 0.5, 8.5]} />
            <meshStandardMaterial color="#8a3a1a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function CityEnvironment() {
  // Generate street lights along highways
  const lights: [number, number, number][] = [];
  for (let i = -WORLD_SIZE; i < WORLD_SIZE; i += 25) {
    lights.push([3, 0, i]);
    lights.push([i, 0, 3]);
  }

  return (
    <group>
      {/* Main ground - grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[WORLD_SIZE * 2.5, WORLD_SIZE * 2.5]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>

      {/* City grounds (paved) */}
      {cities.map(city => (
        <mesh key={city.id} rotation={[-Math.PI / 2, 0, 0]} position={[city.center[0], 0.01, city.center[2]]} receiveShadow>
          <circleGeometry args={[city.radius, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}

      {/* City buildings */}
      {cities.map(city => (
        <CityBuildings key={city.id} cx={city.center[0]} cz={city.center[2]} radius={city.radius} cityId={city.id} />
      ))}

      {/* City landmarks */}
      {cities.map(city => (
        <CityLandmarks key={`lm-${city.id}`} cityId={city.id} cx={city.center[0]} cz={city.center[2]} />
      ))}

      {/* Highways connecting cities */}
      {/* Madrona ↔ Barceloma */}
      <Road start={[40, 0]} end={[140, -120]} width={6} />
      {/* Madrona ↔ Valentia */}
      <Road start={[40, 40]} end={[100, 150]} width={6} />
      {/* Madrona ↔ Sevira */}
      <Road start={[-40, 40]} end={[-120, 130]} width={6} />
      {/* Madrona ↔ Costa del Sol */}
      <Road start={[-40, -40]} end={[-80, -160]} width={6} />
      {/* Barceloma ↔ Valentia (coast road) */}
      <Road start={[180, -80]} end={[160, 110]} width={5} />
      {/* Sevira ↔ Costa del Sol */}
      <Road start={[-140, 90]} end={[-130, -120]} width={5} />
      {/* Ring road segments */}
      <Road start={[140, -120]} end={[180, -80]} width={5} />
      <Road start={[140, 150]} end={[160, 110]} width={5} />
      
      {/* Inner city roads for Madrona */}
      <Road start={[-40, -40]} end={[40, -40]} width={5} />
      <Road start={[-40, 0]} end={[40, 0]} width={5} />
      <Road start={[0, -40]} end={[0, 40]} width={5} />

      {/* Mission markers for each city */}
      {cities.map(city => {
        const offset = city.id === 'madrona' ? [25, 25] : [city.center[0] + 10, city.center[2] + 10];
        return (
          <group key={`marker-${city.id}`}>
            <mesh position={[offset[0], 0.1, offset[1]]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.5, 32]} />
              <meshStandardMaterial color={city.color} emissive={city.color} emissiveIntensity={0.5} transparent opacity={0.4} />
            </mesh>
            <mesh position={[offset[0], 4, offset[1]]}>
              <cylinderGeometry args={[0.1, 0.1, 8, 8]} />
              <meshStandardMaterial color={city.color} emissive={city.color} emissiveIntensity={1} transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Street lights along main roads */}
      {lights.slice(0, 30).map((pos, i) => (
        <StreetLight key={i} position={pos} />
      ))}

      {/* Rural zones */}
      <RuralZones />

      {/* Water surrounding the world */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#0a2a4a" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
