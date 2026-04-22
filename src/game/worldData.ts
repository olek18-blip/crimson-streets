import type { CityZone, Mission, NPC, Vehicle } from './types';

export const WORLD_SIZE = 300;

export const cities: CityZone[] = [
  { id: 'madrona', name: 'MADRONA', subtitle: 'Capital - Poder, policia y corrupcion', center: [0, 0, 0], radius: 42, color: '#c4a035' },
  { id: 'sevira', name: 'SEVIRA', subtitle: 'Industrial - Fabricas, energia y rutas grises', center: [-135, 0, 120], radius: 42, color: '#6f7e94' },
  { id: 'barceloma', name: 'BARCELOMA', subtitle: 'Residencial - Costa alta y vida civil', center: [135, 0, 118], radius: 40, color: '#d86aa6' },
  { id: 'valentia', name: 'VALENTIA', subtitle: 'Puerto - Gruas, contenedores y contrabando', center: [150, 0, -118], radius: 48, color: '#9f5cc6' },
  { id: 'costadelsol', name: 'COSTA DEL SOL', subtitle: 'Circuito - Carreteras, riesgo y dinero rapido', center: [-140, 0, -125], radius: 46, color: '#d58a49' },
];

export const WORLD_CONNECTIONS: [[number, number], [number, number]][] = [
  [[0, 0], [-135, 120]],
  [[0, 0], [135, 118]],
  [[0, 0], [150, -118]],
  [[0, 0], [-140, -125]],
  [[135, 118], [150, -118]],
  [[-135, 120], [-140, -125]],
];

// rest unchanged

export const initialVehicles = [] as Vehicle[];
export const initialNPCs = [] as NPC[];
export const initialMissions = [] as Mission[];
