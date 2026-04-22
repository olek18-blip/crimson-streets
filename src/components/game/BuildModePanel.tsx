import type { MouseEvent as ReactMouseEvent } from 'react';
import { useMemo } from 'react';
import { useGameStore } from '../../game/store';
import { cities, WORLD_SIZE } from '../../game/worldData';
import type { PlaceableType } from '../../game/types';

const GRID = 2;
const MAP_SIZE = 520;

const LABELS: Record<PlaceableType, string> = {
  road: 'CARRETERA',
  building: 'EDIFICIO',
  tree: 'ARBOL',
  streetlight: 'FAROLA',
  dumpster: 'CONTENEDOR',
  block: 'BLOQUE',
};

function snapToGrid(value: number) {
  return Math.round(value / GRID) * GRID;
}

function worldToMap(value: number) {
  return ((value + WORLD_SIZE) / (WORLD_SIZE * 2)) * MAP_SIZE;
}

function mapToWorld(value: number) {
  return (value / MAP_SIZE) * (WORLD_SIZE * 2) - WORLD_SIZE;
}

export default function BuildModePanel() {
  const editor = useGameStore((state) => state.editor);
  const closeEditor = useGameStore((state) => state.closeEditor);
  const rotateEditor = useGameStore((state) => state.rotateEditor);
  const setEditorView = useGameStore((state) => state.setEditorView);
  const setEditorSelected = useGameStore((state) => state.setEditorSelected);
  const placeEditorProp = useGameStore((state) => state.placeEditorProp);
  const removeEditorPropNear = useGameStore((state) => state.removeEditorPropNear);

  const placedDots = useMemo(
    () =>
      editor.placed.map((prop) => ({
        ...prop,
        left: worldToMap(prop.position[0]),
        top: worldToMap(prop.position[2]),
      })),
    [editor.placed],
  );

  if (!editor.enabled) {
    return null;
  }

  const handleMapPlacement = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const worldX = snapToGrid(mapToWorld(x));
    const worldZ = snapToGrid(mapToWorld(y));

    if (event.type === 'contextmenu') {
      removeEditorPropNear([worldX, 0.5, worldZ], 3);
      return;
    }

    placeEditorProp({
      type: editor.selected,
      position: [worldX, 0.5, worldZ],
      rotationY: editor.rotationY,
    });
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start gap-3 pointer-events-auto">
        <div className="game-panel rounded-2xl px-4 py-3 min-w-[290px]">
          <div className="flex items-center gap-3 justify-between">
            <div>
              <div className="text-[10px] tracking-[0.22em] text-cyan-200 font-display">MODO CONSTRUCCION</div>
              <div className="text-sm text-slate-300 mt-1">Planifica en 2D y revisa en 3D sin salir del mapa.</div>
            </div>
            <button className="rounded-full border border-white/15 px-3 py-1 text-[10px] tracking-[0.18em] text-slate-200" onClick={closeEditor}>
              SALIR
            </button>
          </div>
        </div>

        <div className="game-panel rounded-2xl px-4 py-3 flex flex-wrap gap-2">
          <button
            className={`rounded-full px-3 py-2 text-[10px] tracking-[0.18em] ${editor.view === '2d' ? 'bg-cyan-300/20 text-cyan-100' : 'bg-white/5 text-slate-300'}`}
            onClick={() => setEditorView('2d')}
          >
            VISTA 2D
          </button>
          <button
            className={`rounded-full px-3 py-2 text-[10px] tracking-[0.18em] ${editor.view === '3d' ? 'bg-cyan-300/20 text-cyan-100' : 'bg-white/5 text-slate-300'}`}
            onClick={() => setEditorView('3d')}
          >
            VISTA 3D
          </button>
          <button className="rounded-full px-3 py-2 text-[10px] tracking-[0.18em] bg-white/5 text-slate-300" onClick={rotateEditor}>
            ROTAR
          </button>
        </div>
      </div>

      <div className="absolute left-3 top-28 pointer-events-auto">
        <div className="game-panel rounded-2xl p-3 flex flex-col gap-2 w-[200px]">
          {(['road', 'building', 'tree', 'streetlight', 'dumpster', 'block'] as PlaceableType[]).map((type) => (
            <button
              key={type}
              className={`rounded-xl px-3 py-2 text-left text-[11px] tracking-[0.16em] ${editor.selected === type ? 'bg-amber-300/18 text-amber-100 border border-amber-300/25' : 'bg-white/5 text-slate-300 border border-transparent'}`}
              onClick={() => setEditorSelected(type)}
            >
              {LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {editor.view === '2d' && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-auto px-4">
          <div className="game-panel rounded-3xl p-4 w-full max-w-[760px]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-[10px] tracking-[0.22em] text-cyan-200 font-display">PLANO 2D</div>
                <div className="text-xs text-slate-400 mt-1">Click para colocar. Click derecho para borrar. Usa rotar para orientar carreteras y piezas.</div>
              </div>
              <div className="text-[10px] tracking-[0.18em] text-slate-400">PIEZAS: {editor.placed.length}</div>
            </div>

            <div
              className="relative mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#071019] select-none"
              style={{
                width: `min(${MAP_SIZE}px, 72vw)`,
                height: `min(${MAP_SIZE}px, 72vw)`,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: `${Math.max(12, MAP_SIZE / 30)}px ${Math.max(12, MAP_SIZE / 30)}px`,
              }}
              onClick={handleMapPlacement}
              onContextMenu={(event) => {
                event.preventDefault();
                handleMapPlacement(event);
              }}
            >
              {cities.map((city) => {
                const radius = (city.radius / (WORLD_SIZE * 2)) * MAP_SIZE;
                return (
                  <div
                    key={city.id}
                    className="absolute rounded-full border"
                    style={{
                      left: `${((worldToMap(city.center[0]) - radius) / MAP_SIZE) * 100}%`,
                      top: `${((worldToMap(city.center[2]) - radius) / MAP_SIZE) * 100}%`,
                      width: `${((radius * 2) / MAP_SIZE) * 100}%`,
                      height: `${((radius * 2) / MAP_SIZE) * 100}%`,
                      borderColor: `${city.color}66`,
                      background: `${city.color}12`,
                    }}
                  />
                );
              })}

              {placedDots.map((prop) => (
                <div
                  key={prop.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm"
                  style={{
                    left: `${(prop.left / MAP_SIZE) * 100}%`,
                    top: `${(prop.top / MAP_SIZE) * 100}%`,
                    width: prop.type === 'road' ? '16px' : '10px',
                    height: '10px',
                    transform: `translate(-50%, -50%) rotate(${prop.rotationY}rad)`,
                    background:
                      prop.type === 'road'
                        ? '#fbbf24'
                        : prop.type === 'building'
                          ? '#cbd5e1'
                          : prop.type === 'tree'
                            ? '#4ade80'
                            : prop.type === 'streetlight'
                              ? '#67e8f9'
                              : prop.type === 'dumpster'
                                ? '#86efac'
                                : '#94a3b8',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
