import { WORLD_SIZE } from './worldData';

export const BUILDER_LAYOUT_STORAGE_KEY = 'crimson_builder_layout_v2';
export const BUILDER_GRID_SIZE = 2;
export const DEFAULT_BUILDING_HEIGHT = 12;

export type BuilderTool = 'road' | 'building' | 'tree' | 'streetlight' | 'dumpster' | 'erase';
export type BuilderView = '2d' | '3d';

export type BuilderRoad = {
  id: string;
  x: number;
  z: number;
  rotationY: number;
};

export type BuilderBuilding = {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

export type BuilderPropType = 'tree' | 'streetlight' | 'dumpster';

export type BuilderProp = {
  id: string;
  type: BuilderPropType;
  x: number;
  z: number;
  rotationY: number;
};

export type BuilderLayout = {
  version: 1;
  name: string;
  updatedAt: string;
  roads: BuilderRoad[];
  buildings: BuilderBuilding[];
  props: BuilderProp[];
};

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
}

function createSeedRoads() {
  const roads: BuilderRoad[] = [];

  for (let x = -18; x <= 18; x += 6) {
    roads.push({
      id: createId('road'),
      x,
      z: 0,
      rotationY: Math.PI / 2,
    });
  }

  for (let z = -18; z <= 18; z += 6) {
    roads.push({
      id: createId('road'),
      x: 0,
      z,
      rotationY: 0,
    });
  }

  return roads;
}

function createSeedBuildings() {
  return [
    { id: createId('building'), x: -14, z: -12, width: 12, depth: 10, height: 14 },
    { id: createId('building'), x: 16, z: -10, width: 14, depth: 10, height: 12 },
    { id: createId('building'), x: -12, z: 14, width: 10, depth: 12, height: 10 },
    { id: createId('building'), x: 16, z: 16, width: 16, depth: 12, height: 16 },
  ] satisfies BuilderBuilding[];
}

function createSeedProps() {
  return [
    { id: createId('prop'), type: 'tree', x: -22, z: 22, rotationY: 0 },
    { id: createId('prop'), type: 'tree', x: 24, z: 20, rotationY: 0 },
    { id: createId('prop'), type: 'streetlight', x: -6, z: -6, rotationY: 0 },
    { id: createId('prop'), type: 'streetlight', x: 6, z: 6, rotationY: Math.PI / 2 },
    { id: createId('prop'), type: 'dumpster', x: 22, z: -18, rotationY: 0 },
  ] satisfies BuilderProp[];
}

export function createDefaultBuilderLayout(): BuilderLayout {
  return {
    version: 1,
    name: 'Mandril Blockout',
    updatedAt: new Date().toISOString(),
    roads: createSeedRoads(),
    buildings: createSeedBuildings(),
    props: createSeedProps(),
  };
}

export function snapToBuilderGrid(value: number) {
  return Math.round(value / BUILDER_GRID_SIZE) * BUILDER_GRID_SIZE;
}

export function clampToWorld(value: number) {
  return Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, value));
}

export function normalizeBuilderLayout(input: unknown): BuilderLayout {
  const fallback = createDefaultBuilderLayout();

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const raw = input as Partial<BuilderLayout>;

  const roads = Array.isArray(raw.roads)
    ? raw.roads
        .filter((road): road is BuilderRoad => !!road && typeof road === 'object')
        .map((road) => ({
          id: typeof road.id === 'string' ? road.id : createId('road'),
          x: clampToWorld(snapToBuilderGrid(Number(road.x) || 0)),
          z: clampToWorld(snapToBuilderGrid(Number(road.z) || 0)),
          rotationY: typeof road.rotationY === 'number' ? road.rotationY : 0,
        }))
    : fallback.roads;

  const buildings = Array.isArray(raw.buildings)
    ? raw.buildings
        .filter((building): building is BuilderBuilding => !!building && typeof building === 'object')
        .map((building) => ({
          id: typeof building.id === 'string' ? building.id : createId('building'),
          x: clampToWorld(snapToBuilderGrid(Number(building.x) || 0)),
          z: clampToWorld(snapToBuilderGrid(Number(building.z) || 0)),
          width: Math.max(BUILDER_GRID_SIZE, snapToBuilderGrid(Number(building.width) || BUILDER_GRID_SIZE)),
          depth: Math.max(BUILDER_GRID_SIZE, snapToBuilderGrid(Number(building.depth) || BUILDER_GRID_SIZE)),
          height: Math.max(6, Math.round(Number(building.height) || DEFAULT_BUILDING_HEIGHT)),
        }))
    : fallback.buildings;

  const props = Array.isArray(raw.props)
    ? raw.props
        .filter((prop): prop is BuilderProp => !!prop && typeof prop === 'object')
        .map((prop) => ({
          id: typeof prop.id === 'string' ? prop.id : createId('prop'),
          type: prop.type === 'tree' || prop.type === 'streetlight' || prop.type === 'dumpster' ? prop.type : 'tree',
          x: clampToWorld(snapToBuilderGrid(Number(prop.x) || 0)),
          z: clampToWorld(snapToBuilderGrid(Number(prop.z) || 0)),
          rotationY: typeof prop.rotationY === 'number' ? prop.rotationY : 0,
        }))
    : fallback.props;

  return {
    version: 1,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : fallback.name,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : fallback.updatedAt,
    roads,
    buildings,
    props,
  };
}

export function loadBuilderLayout() {
  if (typeof window === 'undefined') {
    return createDefaultBuilderLayout();
  }

  try {
    const raw = window.localStorage.getItem(BUILDER_LAYOUT_STORAGE_KEY);
    if (!raw) {
      return createDefaultBuilderLayout();
    }

    return normalizeBuilderLayout(JSON.parse(raw));
  } catch {
    return createDefaultBuilderLayout();
  }
}

export function saveBuilderLayout(layout: BuilderLayout) {
  if (typeof window === 'undefined') {
    return;
  }

  const nextLayout = {
    ...layout,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(BUILDER_LAYOUT_STORAGE_KEY, JSON.stringify(nextLayout));
}

export function resetBuilderLayout() {
  const nextLayout = createDefaultBuilderLayout();
  saveBuilderLayout(nextLayout);
  return nextLayout;
}

export function serializeBuilderLayout(layout: BuilderLayout) {
  return JSON.stringify(
    {
      ...layout,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}

export function parseBuilderLayout(raw: string) {
  return normalizeBuilderLayout(JSON.parse(raw));
}

