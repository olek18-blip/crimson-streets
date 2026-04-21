import type { CityZone, Mission, NPC, Vehicle } from './types';

// City layout - spread across a large world
// World is ~600x600 units
export const WORLD_SIZE = 300; // half-extent

export const cities: CityZone[] = [
  { id: 'madrona', name: 'MADRONA', subtitle: 'Capital - Centro Financiero', center: [0, 0, 0], radius: 45, color: '#c4a035' },
  { id: 'barceloma', name: 'BARCELOMA', subtitle: 'Costa - Crimen y Vida Nocturna', center: [180, 0, -120], radius: 40, color: '#e05555' },
  { id: 'valentia', name: 'VALENTIA', subtitle: 'Puerto - Contrabando y Carreras', center: [140, 0, 150], radius: 35, color: '#3588cc' },
  { id: 'sevira', name: 'SEVIRA', subtitle: 'Historica - Territorio de Bandas', center: [-160, 0, 130], radius: 38, color: '#cc7733' },
  { id: 'costadelsol', name: 'COSTA DEL SOL', subtitle: 'Lujo - Atracos y Casinos', center: [-120, 0, -160], radius: 35, color: '#44bb88' },
];

// Vehicles spread across cities
export const initialVehicles: Vehicle[] = [
  // Madrona / Mandril prototype zone
  { id: 'mad-car1', type: 'car', position: [8, 0.4, 5], rotation: 0, color: '#cc2222', speed: 0, city: 'madrona' },
  { id: 'mad-car2', type: 'car', position: [-10, 0.4, -8], rotation: Math.PI / 2, color: '#2244aa', speed: 0, city: 'madrona' },
  { id: 'mad-moto1', type: 'motorcycle', position: [15, 0.3, -3], rotation: Math.PI, color: '#222222', speed: 0, city: 'madrona' },
  { id: 'mad-car3', type: 'car', position: [-5, 0.4, 20], rotation: -Math.PI / 4, color: '#eeee33', speed: 0, city: 'madrona' },
  // Barceloma
  { id: 'bar-car1', type: 'car', position: [185, 0.4, -115], rotation: 0.5, color: '#ff4466', speed: 0, city: 'barceloma' },
  { id: 'bar-car2', type: 'car', position: [175, 0.4, -130], rotation: 1.2, color: '#ffffff', speed: 0, city: 'barceloma' },
  { id: 'bar-moto1', type: 'motorcycle', position: [190, 0.3, -110], rotation: 0, color: '#dd0000', speed: 0, city: 'barceloma' },
  // Valentia
  { id: 'val-car1', type: 'car', position: [135, 0.4, 155], rotation: 2, color: '#3366cc', speed: 0, city: 'valentia' },
  { id: 'val-moto1', type: 'motorcycle', position: [145, 0.3, 145], rotation: 0, color: '#ff9900', speed: 0, city: 'valentia' },
  // Sevira
  { id: 'sev-car1', type: 'car', position: [-155, 0.4, 125], rotation: 1, color: '#886633', speed: 0, city: 'sevira' },
  { id: 'sev-moto1', type: 'motorcycle', position: [-165, 0.3, 135], rotation: 3, color: '#333333', speed: 0, city: 'sevira' },
  // Costa del Sol
  { id: 'cos-car1', type: 'car', position: [-115, 0.4, -155], rotation: 0, color: '#eeeeee', speed: 0, city: 'costadelsol' },
  { id: 'cos-car2', type: 'car', position: [-125, 0.4, -165], rotation: 1.5, color: '#cc9900', speed: 0, city: 'costadelsol' },
];

// NPCs across cities
export const initialNPCs: NPC[] = [
  // Madrona / Mandril prototype zone
  { id: 'mad-civ1', type: 'civilian', position: [12, 0.5, -30], rotation: 0.4, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-civ2', type: 'civilian', position: [-18, 0.5, 8], rotation: 1.5, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-civ3', type: 'civilian', position: [16, 0.5, -10], rotation: 2.7, health: 100, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-pol1', type: 'police', position: [-2, 0.5, -18], rotation: 0.1, health: 150, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-pol2', type: 'police', position: [8, 0.5, -18], rotation: 2.8, health: 150, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-gang1', type: 'gang', position: [24, 0.5, 24], rotation: 2, health: 120, isHostile: false, isAlive: true, city: 'madrona' },
  { id: 'mad-gang2', type: 'gang', position: [28, 0.5, 25], rotation: 1, health: 120, isHostile: false, isAlive: true, city: 'madrona' },
  // Barceloma - nightlife area, more gangs
  { id: 'bar-civ1', type: 'civilian', position: [178, 0.5, -118], rotation: 0, health: 100, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-civ2', type: 'civilian', position: [183, 0.5, -125], rotation: 2, health: 100, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-gang1', type: 'gang', position: [195, 0.5, -105], rotation: 1, health: 130, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-gang2', type: 'gang', position: [197, 0.5, -107], rotation: 2, health: 130, isHostile: false, isAlive: true, city: 'barceloma' },
  { id: 'bar-pol1', type: 'police', position: [170, 0.5, -130], rotation: 0, health: 150, isHostile: false, isAlive: true, city: 'barceloma' },
  // Valentia - smuggling port
  { id: 'val-civ1', type: 'civilian', position: [138, 0.5, 148], rotation: 1, health: 100, isHostile: false, isAlive: true, city: 'valentia' },
  { id: 'val-gang1', type: 'gang', position: [150, 0.5, 160], rotation: 0, health: 140, isHostile: false, isAlive: true, city: 'valentia' },
  { id: 'val-pol1', type: 'police', position: [130, 0.5, 140], rotation: 2, health: 150, isHostile: false, isAlive: true, city: 'valentia' },
  // Sevira - gang territories
  { id: 'sev-civ1', type: 'civilian', position: [-158, 0.5, 128], rotation: 0, health: 100, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-gang1', type: 'gang', position: [-150, 0.5, 140], rotation: 1, health: 130, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-gang2', type: 'gang', position: [-148, 0.5, 142], rotation: 2, health: 130, isHostile: false, isAlive: true, city: 'sevira' },
  { id: 'sev-gang3', type: 'gang', position: [-152, 0.5, 138], rotation: 0, health: 130, isHostile: false, isAlive: true, city: 'sevira' },
  // Costa del Sol - luxury
  { id: 'cos-civ1', type: 'civilian', position: [-118, 0.5, -158], rotation: 1, health: 100, isHostile: false, isAlive: true, city: 'costadelsol' },
  { id: 'cos-civ2', type: 'civilian', position: [-122, 0.5, -162], rotation: 0, health: 100, isHostile: false, isAlive: true, city: 'costadelsol' },
  { id: 'cos-pol1', type: 'police', position: [-130, 0.5, -150], rotation: 2, health: 160, isHostile: false, isAlive: true, city: 'costadelsol' },
];

// Missions across cities
export const initialMissions: Mission[] = [
  {
    id: 'mission1',
    title: 'Dirty Patrol',
    description: 'Roldan te manda a una patrulla sucia en Mandril. Cobra en la zona del mercado, mide la presion de la banda local y corta el handoff antes de que desaparezca la evidencia.',
    objectives: [
      {
        id: 'obj1',
        text: 'Ve al punto de acceso policial',
        completed: false,
        targetPosition: [3, 0, -18],
        objectiveType: 'reach',
        radius: 5,
        hint: 'Empieza la patrulla en el acceso policial y recibe la orden sucia.',
      },
      {
        id: 'obj2',
        text: 'Equipa el arma reglamentaria',
        completed: false,
        objectiveType: 'switch-weapon',
        hint: 'Pulsa Q y preparate antes de entrar en la zona de cobro.',
      },
      {
        id: 'obj3',
        text: 'Recoge el pago en el mercado',
        completed: false,
        targetPosition: [-18, 0, 8],
        objectiveType: 'reach',
        radius: 4,
        effects: [{ type: 'add-money', amount: 800 }],
        hint: 'Llega al mercado y haz notar que la patrulla va en serio.',
      },
      {
        id: 'obj4',
        text: 'Entra en el vehiculo para perseguir al corredor',
        completed: false,
        targetPosition: [8, 0, 5],
        objectiveType: 'enter-vehicle',
        effects: [{ type: 'set-min-wanted-level', level: 1 }],
        hint: 'Cuando la banda se mueva, toma el coche rojo y corta la huida.',
      },
      {
        id: 'obj5',
        text: 'Llega al punto de handoff en el back lot',
        completed: false,
        targetPosition: [26, 0, 24],
        objectiveType: 'reach',
        radius: 4,
        effects: [
          { type: 'set-min-wanted-level', level: 2 },
          { type: 'set-npc-hostility', city: 'madrona', npcType: 'gang', hostile: true },
        ],
        hint: 'Sigue el beacon hasta la zona de intercambio.',
      },
      {
        id: 'obj6',
        text: 'Elimina a la cobertura de la banda',
        completed: false,
        objectiveType: 'eliminate-gangs',
        effects: [{ type: 'set-min-wanted-level', level: 3 }],
        hint: 'Rompe la proteccion del handoff y asegura la escena.',
      },
      {
        id: 'obj7',
        text: 'Asegura la evidencia',
        completed: false,
        targetPosition: [28, 0, 25],
        objectiveType: 'reach',
        radius: 4,
        effects: [{ type: 'set-wanted-level', level: 1 }],
        hint: 'Muevete hasta la evidencia para cerrar la operacion.',
      },
    ],
    status: 'available',
    reward: 6500,
    city: 'madrona',
  },
  {
    id: 'mission2',
    title: 'Noche en Barceloma',
    description: 'Infiltra la zona de discotecas y elimina a los traficantes.',
    objectives: [
      { id: 'obj2-1', text: 'Llegar a la zona de discotecas', completed: false, targetPosition: [195, 0, -105], objectiveType: 'reach' },
      { id: 'obj2-2', text: 'Eliminar a los traficantes', completed: false, objectiveType: 'eliminate-gangs' },
    ],
    status: 'available',
    reward: 8000,
    city: 'barceloma',
  },
  {
    id: 'mission3',
    title: 'Contrabando en el Puerto',
    description: 'Intercepta un envio ilegal en los almacenes de Valentia.',
    objectives: [
      { id: 'obj3-1', text: 'Ir al puerto de Valentia', completed: false, targetPosition: [150, 0, 160], objectiveType: 'reach' },
      { id: 'obj3-2', text: 'Eliminar a los contrabandistas', completed: false, objectiveType: 'eliminate-gangs' },
    ],
    status: 'available',
    reward: 10000,
    city: 'valentia',
  },
  {
    id: 'mission4',
    title: 'Guerra de Bandas',
    description: 'Las bandas de Sevira estan fuera de control. Limpia las calles.',
    objectives: [
      { id: 'obj4-1', text: 'Ir al territorio de las bandas', completed: false, targetPosition: [-150, 0, 140], objectiveType: 'reach' },
      { id: 'obj4-2', text: 'Eliminar a los lideres', completed: false, objectiveType: 'eliminate-gangs' },
    ],
    status: 'available',
    reward: 12000,
    city: 'sevira',
  },
  {
    id: 'mission5',
    title: 'El Gran Atraco',
    description: 'Un casino en Costa del Sol guarda secretos del presidente. Consigue los documentos.',
    objectives: [
      { id: 'obj5-1', text: 'Infiltrar el casino', completed: false, targetPosition: [-115, 0, -165], objectiveType: 'reach' },
      { id: 'obj5-2', text: 'Encontrar los documentos', completed: false, targetPosition: [-125, 0, -155], objectiveType: 'reach' },
    ],
    status: 'available',
    reward: 20000,
    city: 'costadelsol',
  },
];
