import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Builder3DPreview from '../components/builder/Builder3DPreview';
import {
  BUILDER_GRID_SIZE,
  type BuilderLayout,
  type BuilderTool,
  type BuilderView,
  clampToWorld,
  loadBuilderLayout,
  parseBuilderLayout,
  resetBuilderLayout,
  saveBuilderLayout,
  serializeBuilderLayout,
  snapToBuilderGrid,
} from '../game/builderLayout';
import { cities, WORLD_SIZE } from '../game/worldData';

type GridPoint = {
  x: number;
  z: number;
};

const TOOL_LABELS: Record<BuilderTool, string> = {
  road: 'Carretera',
  building: 'Edificio',
  tree: 'Arbol',
  streetlight: 'Farola',
  dumpster: 'Contenedor',
  erase: 'Borrar',
};

const TOOL_HINTS: Record<BuilderTool, string> = {
  road: 'Haz click o arrastra para pintar tramos. Usa rotar para horizontal o vertical.',
  building: 'Arrastra un rectangulo para bloquear volumenes de edificio.',
  tree: 'Click para plantar arboles en la zona.',
  streetlight: 'Click para colocar farolas y marcar recorridos.',
  dumpster: 'Click para props rapidos y puntos de cobertura.',
  erase: 'Click para eliminar lo que haya bajo el cursor.',
};

function worldToPercent(value: number) {
  return ((value + WORLD_SIZE) / (WORLD_SIZE * 2)) * 100;
}

function getPointFromEvent(event: ReactMouseEvent<HTMLDivElement>): GridPoint {
  const rect = event.currentTarget.getBoundingClientRect();
  const localX = (event.clientX - rect.left) / rect.width;
  const localY = (event.clientY - rect.top) / rect.height;

  return {
    x: snapToBuilderGrid(clampToWorld(localX * WORLD_SIZE * 2 - WORLD_SIZE)),
    z: snapToBuilderGrid(clampToWorld(localY * WORLD_SIZE * 2 - WORLD_SIZE)),
  };
}

function pointKey(point: GridPoint) {
  return `${point.x}:${point.z}`;
}

function addRoads(layout: BuilderLayout, points: GridPoint[], rotationY: number) {
  const nextRoads = new Map(layout.roads.map((road) => [`${road.x}:${road.z}`, road]));

  for (const point of points) {
    nextRoads.set(pointKey(point), {
      id: nextRoads.get(pointKey(point))?.id ?? `road-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`,
      x: point.x,
      z: point.z,
      rotationY,
    });
  }

  return {
    ...layout,
    roads: Array.from(nextRoads.values()),
  };
}

function addBuilding(layout: BuilderLayout, start: GridPoint, end: GridPoint) {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minZ = Math.min(start.z, end.z);
  const maxZ = Math.max(start.z, end.z);
  const width = Math.max(BUILDER_GRID_SIZE, maxX - minX + BUILDER_GRID_SIZE);
  const depth = Math.max(BUILDER_GRID_SIZE, maxZ - minZ + BUILDER_GRID_SIZE);
  const height = Math.max(8, Math.min(28, 8 + Math.round(Math.max(width, depth) / 2)));

  return {
    ...layout,
    buildings: [
      ...layout.buildings,
      {
        id: `building-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`,
        x: (minX + maxX) / 2,
        z: (minZ + maxZ) / 2,
        width,
        depth,
        height,
      },
    ],
  };
}

function addProp(layout: BuilderLayout, point: GridPoint, tool: Extract<BuilderTool, 'tree' | 'streetlight' | 'dumpster'>, rotationY: number) {
  return {
    ...layout,
    props: [
      ...layout.props,
      {
        id: `prop-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`,
        type: tool,
        x: point.x,
        z: point.z,
        rotationY,
      },
    ],
  };
}

function eraseAt(layout: BuilderLayout, point: GridPoint) {
  const nextRoads = layout.roads.filter((road) => Math.abs(road.x - point.x) > 1 || Math.abs(road.z - point.z) > 1);
  const nextProps = layout.props.filter((prop) => Math.abs(prop.x - point.x) > 1 || Math.abs(prop.z - point.z) > 1);
  const nextBuildings = layout.buildings.filter((building) => {
    const insideX = Math.abs(point.x - building.x) <= building.width / 2;
    const insideZ = Math.abs(point.z - building.z) <= building.depth / 2;
    return !(insideX && insideZ);
  });

  return {
    ...layout,
    roads: nextRoads,
    props: nextProps,
    buildings: nextBuildings,
  };
}

export default function BuilderPage() {
  const [layout, setLayout] = useState<BuilderLayout>(() => loadBuilderLayout());
  const [view, setView] = useState<BuilderView>('2d');
  const [tool, setTool] = useState<BuilderTool>('road');
  const [rotationY, setRotationY] = useState(0);
  const [status, setStatus] = useState('Autosave activado');
  const [roadDraft, setRoadDraft] = useState<GridPoint[]>([]);
  const [buildingDraft, setBuildingDraft] = useState<{ start: GridPoint; end: GridPoint } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    saveBuilderLayout(layout);
    setStatus(`Guardado local: ${new Date().toLocaleTimeString()}`);
  }, [layout]);

  const counts = useMemo(
    () => ({
      roads: layout.roads.length,
      buildings: layout.buildings.length,
      props: layout.props.length,
    }),
    [layout],
  );

  const handlePointerDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const point = getPointFromEvent(event);

    if (tool === 'road') {
      setRoadDraft([point]);
      return;
    }

    if (tool === 'building') {
      setBuildingDraft({ start: point, end: point });
      return;
    }

    if (tool === 'erase') {
      setLayout((current) => eraseAt(current, point));
      return;
    }

    setLayout((current) => addProp(current, point, tool, rotationY));
  };

  const handlePointerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const point = getPointFromEvent(event);

    if (roadDraft.length > 0) {
      setRoadDraft((current) => {
        if (current.some((item) => item.x === point.x && item.z === point.z)) {
          return current;
        }
        return [...current, point];
      });
      return;
    }

    if (buildingDraft) {
      setBuildingDraft((current) => (current ? { ...current, end: point } : current));
    }
  };

  const handlePointerUp = () => {
    if (roadDraft.length > 0) {
      setLayout((current) => addRoads(current, roadDraft, rotationY));
      setRoadDraft([]);
    }

    if (buildingDraft) {
      setLayout((current) => addBuilding(current, buildingDraft.start, buildingDraft.end));
      setBuildingDraft(null);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([serializeBuilderLayout(layout)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mandril-layout.json';
    anchor.click();
    window.URL.revokeObjectURL(url);
    setStatus('JSON descargado');
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      setLayout(parseBuilderLayout(text));
      setStatus(`Importado: ${file.name}`);
    } catch {
      setStatus('No se pudo importar ese JSON');
    }

    event.target.value = '';
  };

  const draftBuildingStyle = useMemo(() => {
    if (!buildingDraft) {
      return null;
    }

    const minX = Math.min(buildingDraft.start.x, buildingDraft.end.x);
    const maxX = Math.max(buildingDraft.start.x, buildingDraft.end.x);
    const minZ = Math.min(buildingDraft.start.z, buildingDraft.end.z);
    const maxZ = Math.max(buildingDraft.start.z, buildingDraft.end.z);
    const width = maxX - minX + BUILDER_GRID_SIZE;
    const depth = maxZ - minZ + BUILDER_GRID_SIZE;

    return {
      left: `${worldToPercent(minX - BUILDER_GRID_SIZE / 2)}%`,
      top: `${worldToPercent(minZ - BUILDER_GRID_SIZE / 2)}%`,
      width: `${(width / (WORLD_SIZE * 2)) * 100}%`,
      height: `${(depth / (WORLD_SIZE * 2)) * 100}%`,
    };
  }, [buildingDraft]);

  return (
    <div className="min-h-screen bg-[#061018] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_22%),linear-gradient(180deg,#07111b_0%,#04070d_100%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[11px] tracking-[0.32em] text-cyan-200/70">MANDRIL BUILDER</div>
              <h1 className="font-display text-3xl tracking-[0.12em] text-white sm:text-4xl">EDITOR DE BLOQUEO</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                Trabaja rapido en 2D, revisa el resultado en un preview 3D ligero y comparte el layout por JSON. La idea es bloquear ciudad, no pelearse con el motor.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link className="rounded-full border border-white/15 px-4 py-2 text-[11px] tracking-[0.18em] text-slate-200 hover:bg-white/5" to="/">
                VOLVER AL JUEGO
              </Link>
              <button className="rounded-full border border-cyan-300/20 px-4 py-2 text-[11px] tracking-[0.18em] text-cyan-100 hover:bg-cyan-300/10" onClick={() => setView(view === '2d' ? '3d' : '2d')}>
                {view === '2d' ? 'VER 3D' : 'VOLVER A 2D'}
              </button>
              <button className="rounded-full border border-white/15 px-4 py-2 text-[11px] tracking-[0.18em] text-slate-200 hover:bg-white/5" onClick={() => setRotationY((current) => (current + Math.PI / 2) % (Math.PI * 2))}>
                ROTAR
              </button>
              <button className="rounded-full border border-emerald-300/20 px-4 py-2 text-[11px] tracking-[0.18em] text-emerald-100 hover:bg-emerald-300/10" onClick={handleDownload}>
                EXPORTAR JSON
              </button>
              <button className="rounded-full border border-amber-300/20 px-4 py-2 text-[11px] tracking-[0.18em] text-amber-100 hover:bg-amber-300/10" onClick={() => fileInputRef.current?.click()}>
                IMPORTAR JSON
              </button>
              <button className="rounded-full border border-red-300/20 px-4 py-2 text-[11px] tracking-[0.18em] text-red-100 hover:bg-red-300/10" onClick={() => setLayout(resetBuilderLayout())}>
                RESETEAR
              </button>
              <input ref={fileInputRef} className="hidden" type="file" accept=".json,application/json" onChange={handleImport} />
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-4 p-4 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:p-6">
          <aside className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <div className="text-[11px] tracking-[0.24em] text-slate-400">HERRAMIENTAS</div>
            <div className="mt-3 grid gap-2">
              {(['road', 'building', 'tree', 'streetlight', 'dumpster', 'erase'] as BuilderTool[]).map((item) => (
                <button
                  key={item}
                  className={`rounded-2xl border px-3 py-3 text-left transition-colors ${tool === item ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}
                  onClick={() => setTool(item)}
                >
                  <div className="font-display text-sm tracking-[0.12em]">{TOOL_LABELS[item]}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] tracking-[0.22em] text-slate-400">AYUDA RAPIDA</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{TOOL_HINTS[tool]}</p>
            </div>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] tracking-[0.24em] text-slate-400">{view === '2d' ? 'PLANO 2D' : 'PREVIEW 3D'}</div>
                <div className="mt-1 text-sm text-slate-300">{status}</div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] tracking-[0.18em] text-slate-300">
                <span className="rounded-full border border-white/10 px-3 py-2">CARRETERAS {counts.roads}</span>
                <span className="rounded-full border border-white/10 px-3 py-2">EDIFICIOS {counts.buildings}</span>
                <span className="rounded-full border border-white/10 px-3 py-2">PROPS {counts.props}</span>
              </div>
            </div>

            {view === '2d' ? (
              <div
                className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-[#071019] select-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
              >
                {cities.map((city) => (
                  <div
                    key={city.id}
                    className="absolute rounded-full border"
                    style={{
                      left: `${worldToPercent(city.center[0] - city.radius)}%`,
                      top: `${worldToPercent(city.center[2] - city.radius)}%`,
                      width: `${((city.radius * 2) / (WORLD_SIZE * 2)) * 100}%`,
                      height: `${((city.radius * 2) / (WORLD_SIZE * 2)) * 100}%`,
                      borderColor: `${city.color}55`,
                      background: `${city.color}12`,
                    }}
                  />
                ))}

                {layout.roads.map((road) => (
                  <div
                    key={road.id}
                    className="absolute rounded-full bg-amber-300/85"
                    style={{
                      left: `${worldToPercent(road.x)}%`,
                      top: `${worldToPercent(road.z)}%`,
                      width: road.rotationY === 0 ? '1%' : '4.2%',
                      height: road.rotationY === 0 ? '4.2%' : '1%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}

                {layout.buildings.map((building) => (
                  <div
                    key={building.id}
                    className="absolute border border-slate-300/60 bg-slate-200/18"
                    style={{
                      left: `${worldToPercent(building.x - building.width / 2)}%`,
                      top: `${worldToPercent(building.z - building.depth / 2)}%`,
                      width: `${(building.width / (WORLD_SIZE * 2)) * 100}%`,
                      height: `${(building.depth / (WORLD_SIZE * 2)) * 100}%`,
                    }}
                  />
                ))}

                {layout.props.map((prop) => (
                  <div
                    key={prop.id}
                    className="absolute rounded-full"
                    style={{
                      left: `${worldToPercent(prop.x)}%`,
                      top: `${worldToPercent(prop.z)}%`,
                      width: prop.type === 'streetlight' ? '1.2%' : '1.6%',
                      height: prop.type === 'streetlight' ? '1.2%' : '1.6%',
                      transform: 'translate(-50%, -50%)',
                      background: prop.type === 'tree' ? '#4ade80' : prop.type === 'streetlight' ? '#67e8f9' : '#86efac',
                    }}
                  />
                ))}

                {roadDraft.map((point) => (
                  <div
                    key={`draft-road-${point.x}-${point.z}`}
                    className="absolute rounded-full bg-cyan-300/90"
                    style={{
                      left: `${worldToPercent(point.x)}%`,
                      top: `${worldToPercent(point.z)}%`,
                      width: rotationY === 0 ? '1%' : '4.2%',
                      height: rotationY === 0 ? '4.2%' : '1%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}

                {draftBuildingStyle && <div className="absolute border border-cyan-200/80 bg-cyan-300/12" style={draftBuildingStyle} />}
              </div>
            ) : (
              <div className="h-[72vh] overflow-hidden rounded-3xl border border-white/10">
                <Builder3DPreview layout={layout} />
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <div className="text-[11px] tracking-[0.24em] text-slate-400">COLABORACION</div>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
              <p>1. Bloquea el barrio en 2D hasta que la lectura sea clara.</p>
              <p>2. Cambia a 3D solo para revisar volumen y densidad.</p>
              <p>3. Exporta JSON y lo usamos como base comun del mapa.</p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] tracking-[0.22em] text-slate-400">ESTRUCTURA</div>
              <div className="mt-2 text-sm text-slate-300">
                <div>Nombre: {layout.name}</div>
                <div>Roads: {layout.roads.length}</div>
                <div>Buildings: {layout.buildings.length}</div>
                <div>Props: {layout.props.length}</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] tracking-[0.22em] text-slate-400">SIGUIENTE PASO BUENO</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Cuando este bloqueo ya se entienda bien, lo siguiente es meter zonas de mision, accesos, spawns y rutas en este mismo layout.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
