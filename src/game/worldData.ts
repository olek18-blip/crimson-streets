import type { CityZone, Mission, NPC, Vehicle } from './types';

export const WORLD_SIZE = 300;

export const cities: CityZone[] = [
  { id: 'madrona', name: 'MADRONA', subtitle: 'Capital - Poder, policia y corrupcion', center: [0, 0, 0], radius: 42, color: '#c4a035' },
  { id: 'sevira', name: 'SEVIRA', subtitle: 'Industrial - Fabricas, energia y rutas grises', center: [-135, 0, 120], radius: 42, color: '#6f7e94' },
  { id: 'barceloma', name: 'BARCELOMA', subtitle: 'Residencial - Costa alta y vida civil', center: [135, 0, 118], radius: 40, color: '#d86aa6' },
  { id: 'valentia', name: 'VALENTIA', subtitle: 'Puerto - Gruas, contenedores y contrabando', center: [150, 0, -118], radius: 48, color: '#9f5cc6' },
  { id: 'costadelsol', name: 'COSTA DEL SOL', subtitle: 'Circuito - Carreteras, riesgo y dinero rapido', center: [-140, 0, -125], radius: 46, color: '#d58a49' },
];

export const initialVehicles: Vehicle[] = [
  { id: 'mad-car1', type: 'car', position: [10, 0.4, 18], rotation: 0.1, color: '#cc2222', speed: 0, city: 'madrona' },
  { id: 'mad-car2', type: 'car', position: [-14, 0.4, -10], rotation: Math.PI / 2, color: '#2244aa', speed: 0, city: 'madrona' },
  { id: 'mad-moto1', type: 'motorcycle', position: [16, 0.3, -6], rotation: Math.PI, color: '#222222', speed: 0, city: 'madrona' },
  { id: 'mad-car3', type: 'car', position: [-12, 0.4, 26], rotation: -Math.PI / 4, color: '#eeee33', speed: 0, city: 'madrona' },

  { id: 'sev-car1', type: 'car', position: [-126, 0.4, 132], rotation: 0.8, color: '#7c8798', speed: 0, city: 'sevira' },
  { id: 'sev-car2', type: 'car', position: [-144, 0.4, 110], rotation: 1.7, color: '#55606f', speed: 0, city: 'sevira' },
  { id: 'sev-moto1', type: 'motorcycle', position: [-118, 0.3, 98], rotation: -0.2, color: '#d28f2f', speed: 0, city: 'sevira' },

  { id: 'bar-car1', type: 'car', position: [128, 0.4, 126], rotation: 0.5, color: '#ff7db0', speed: 0, city: 'barceloma' },
  { id: 'bar-car2', type: 'car', position: [152, 0.4, 102], rotation: 1.2, color: '#ffffff', speed: 0, city: 'barceloma' },
  { id: 'bar-moto1', type: 'motorcycle', position: [118, 0.3, 90], rotation: 0.3, color: '#6a4f86', speed: 0, city: 'barceloma' },

  { id: 'val-car1', type: 'car', position: [142, 0.4, -105], rotation: 2, color: '#8844cc', speed: 0, city: 'valentia' },
  { id: 'val-car2', type: 'car', position: [168, 0.4, -132], rotation: 0.7, color: '#3564cc', speed: 0, city: 'valentia' },
  { id: 'val-moto1', type: 'motorcycle', position: [132, 0.3, -146], rotation: -0.4, color: '#ff9900', speed: 0, city: 'valentia' },

  { id: 'cos-car1', type: 'car', position: [-155, 0.4, -118], rotation: 0.2, color: '#c1783d', speed: 0, city: 'costadelsol' },
  { id: 'cos-car2', type: 'car', position: [-128, 0.4, -142], rotation: 1.5, color: '#cc9900', speed: 0, city: 'costadelsol' },
  { id: 'cos-moto1', type: 'motorcycle', position: [-112, 0.3, -98], rotation: 2.4, color: '#333333', speed: 0, city: 'costadelsol' },
];

export const initialNPCs: NPC[] = [
  { id: 'mad-civ1', type: 'civilian', position: [12, 0.5, -30], rotation: 0.4, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-civ2', type: 'civilian', position: [-18, 0.5, 8], rotation: 1.5, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-civ3', type: 'civilian', position: [18, 0.5, 12], rotation: 2.2, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-pol1', type: 'police', position: [-2, 0.5, -18], rotation: 0.1, health: 150, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-pol2', type: 'police', position: [8, 0.5, -18], rotation: 2.8, health: 150, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-gang1', type: 'gang', position: [24, 0.5, 24], rotation: 2, health: 120, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-gang2', type: 'gang', position: [28, 0.5, 25], rotation: 1, health: 120, isHostile: false, isAlive: true, city: 'madrona' },

  { id: 'sev-civ1', type: 'civilian', position: [-132, 0.5, 108], rotation: 0.4, health: 100, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-civ2', type: 'civilian', position: [-118, 0.5, 140], rotation: 1.7, health: 100, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-gang1', type: 'gang', position: [-152, 0.5, 126], rotation: 1, health: 130, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-gang2', type: 'gang', position: [-158, 0.5, 140], rotation: 2, health: 130, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-pol1', type: 'police', position: [-110, 0.5, 122], rotation: 0, health: 150, isHostile: false, isAlive: true, city: 'sevira' },

  { id: 'bar-civ1', type: 'civilian', position: [126, 0.5, 102], rotation: 0, health: 100, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-civ2', type: 'civilian', position: [150, 0.5, 136], rotation: 2, health: 100, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-pol1', type: 'police', position: [116, 0.5, 126], rotation: 0.8, health: 150, isHostile: false, isAlive: true, city: 'barceloma' },

  { id: 'val-civ1', type: 'civilian', position: [134, 0.5, -138], rotation: 1, health: 100, isHostile: false, isAlive: true, city: 'valentia' },
  { id: 'val-gang1', type: 'gang', position: [164, 0.5, -124], rotation: 0, health: 140, isHostile: false, isAlive: true, city: 'valentia' },
  { id: 'val-gang2', type: 'gang', position: [174, 0.5, -110], rotation: 1.5, health: 140, isHostile: false, isAlive: true, city: 'valentia' },
  { id: 'val-pol1', type: 'police', position: [126, 0.5, -102], rotation: 2, health: 150, isHostile: false, isAlive: true, city: 'valentia' },

  { id: 'cos-civ1', type: 'civilian', position: [-150, 0.5, -108], rotation: 1, health: 100, isHostile: false, isAlive: true, city: 'costadelsol' },
  { id: 'cos-civ2', type: 'civilian', position: [-122, 0.5, -146], rotation: 0, health: 100, isHostile: false, isAlive: true, city: 'costadelsol' },
  { id: 'cos-gang1', type: 'gang', position: [-168, 0.5, -130], rotation: 2.4, health: 130, isHostile: false, isAlive: true, city: 'costadelsol' },
  { id: 'cos-pol1', type: 'police', position: [-112, 0.5, -118], rotation: 2, health: 160, isHostile: false, isAlive: true, city: 'costadelsol' },
];

export const initialMissions: Mission[] = [
  {
    id: 'mission1',
    title: 'Dirty Patrol',
    description: 'Roldan te manda a una patrulla sucia en Mandril. Cobra en el mercado, mide la presion de la banda local y corta el handoff antes de que desaparezca la evidencia.',
    objectives: [
      { id: 'obj1', text: 'Ve al punto de acceso policial', completed: false, targetPosition: [3, 0, -18], objectiveType: 'reach', radius: 5, hint: 'Empieza la patrulla en el acceso policial y recibe la orden sucia.' },
      { id: 'obj2', text: 'Equipa el arma reglamentaria', completed: false, objectiveType: 'switch-weapon', hint: 'Pulsa Q y preparate antes de entrar en la zona de cobro.' },
      { id: 'obj3', text: 'Recoge el pago en el mercado', completed: false, targetPosition: [-18, 0, 8], objectiveType: 'reach', radius: 4, effects: [{ type: 'add-money', amount: 800 }], hint: 'Llega al mercado y haz notar que la patrulla va en serio.' },
      { id: 'obj4', text: 'Entra en el vehiculo para perseguir al corredor', completed: false, targetPosition: [10, 0, 18], objectiveType: 'enter-vehicle', effects: [{ type: 'set-min-wanted-level', level: 1 }], hint: 'Cuando la banda se mueva, toma el coche rojo y corta la huida.' },
      { id: 'obj5', text: 'Llega al punto de handoff en el back lot', completed: false, targetPosition: [26, 0, 24], objectiveType: 'reach', radius: 4, effects: [{ type: 'set-min-wanted-level', level: 2 }, { type: 'set-npc-hostility', city: 'madrona', npcType: 'gang', hostile: true }], hint: 'Sigue el beacon hasta la zona de intercambio.' },
      { id: 'obj6', text: 'Elimina a la cobertura de la banda', completed: false, objectiveType: 'eliminate-gangs', effects: [{ type: 'set-min-wanted-level', level: 3 }], hint: 'Rompe la proteccion del handoff y asegura la escena.' },
      { id: 'obj7', text: 'Asegura la evidencia', completed: false, targetPosition: [28, 0, 25], objectiveType: 'reach', radius: 4, effects: [{ type: 'set-wanted-level', level: 1 }], hint: 'Muevete hasta la evidencia para cerrar la operacion.' },
    ],
    status: 'available',
    reward: 6500,
    city: 'madrona',
  },
  {
    id: 'mission2',
    title: 'Red Gris',
    description: 'Corta una ruta de suministro entre fabricas y torres electricas en Sevira.',
    objectives: [
      { id: 'obj2-1', text: 'Ve al patio industrial', completed: false, targetPosition: [-152, 0, 126], objectiveType: 'reach' },
      { id: 'obj2-2', text: 'Eliminar a los operadores armados', completed: false, objectiveType: 'eliminate-gangs' },
    ],
    status: 'available',
    reward: 8000,
    city: 'sevira',
  },
  {
    id: 'mission3',
    title: 'Puerto Negro',
    description: 'Intercepta un envio blindado en los muelles y rompe la cadena de contrabando.',
    objectives: [
      { id: 'obj3-1', text: 'Ir al puerto de Valentia', completed: false, targetPosition: [164, 0, -124], objectiveType: 'reach' },
      { id: 'obj3-2', text: 'Eliminar a los contrabandistas', completed: false, objectiveType: 'eliminate-gangs' },
    ],
    status: 'available',
    reward: 10000,
    city: 'valentia',
  },
  {
    id: 'mission4',
    title: 'Costa Alta',
    description: 'Presiona a una celula en la zona residencial y recupera un paquete comprometedor.',
    objectives: [
      { id: 'obj4-1', text: 'Ve al distrito residencial', completed: false, targetPosition: [126, 0, 102], objectiveType: 'reach' },
      { id: 'obj4-2', text: 'Asegura el paquete', completed: false, targetPosition: [150, 0, 136], objectiveType: 'reach' },
    ],
    status: 'available',
    reward: 12000,
    city: 'barceloma',
  },
  {
    id: 'mission5',
    title: 'Circuito Rojo',
    description: 'Rompe una entrega rapida en la zona de carreras y cierra la fuga antes del amanecer.',
    objectives: [
      { id: 'obj5-1', text: 'Entra en la ruta del circuito', completed: false, targetPosition: [-155, 0, -118], objectiveType: 'reach' },
      { id: 'obj5-2', text: 'Deten el intercambio', completed: false, targetPosition: [-168, 0, -130], objectiveType: 'reach' },
    ],
    status: 'available',
    reward: 20000,
    city: 'costadelsol',
  },
];
