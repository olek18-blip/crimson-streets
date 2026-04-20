import { useMemo, useState } from 'react';

type CityMission = {
  name: string;
  type: 'main' | 'heist' | 'gang' | 'final';
  reward: string;
  description: string;
};

type CityInfo = {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  color: string;
  glow: string;
  missions: CityMission[];
};

const cities: CityInfo[] = [
  {
    id: 'gallichia',
    name: 'Gallichia',
    subtitle: 'Costa fría · rutas discretas',
    x: 260,
    y: 300,
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.22)',
    missions: [
      { name: 'Ruta Fantasma', type: 'main', reward: '$6,500', description: 'Intercepta una entrega silenciosa en la costa norte.' },
      { name: 'Punto Ciego', type: 'gang', reward: '$4,200', description: 'Marca una guarida que opera fuera del radar institucional.' },
    ],
  },
  {
    id: 'mandril',
    name: 'Mandril',
    subtitle: 'Capital corrupta · corazón del MVP',
    x: 760,
    y: 360,
    color: '#f5c518',
    glow: 'rgba(245,197,24,0.28)',
    missions: [
      { name: 'Dirty Patrol', type: 'main', reward: '$6,500', description: 'Cobro, presión de banda y corte del handoff en la capital.' },
      { name: 'Night Chase', type: 'heist', reward: '$8,200', description: 'Persigue a un corredor con material comprometedor.' },
    ],
  },
  {
    id: 'valentia',
    name: 'Valentia',
    subtitle: 'Puerto industrial · contrabando',
    x: 1230,
    y: 220,
    color: '#ff7a33',
    glow: 'rgba(255,122,51,0.2)',
    missions: [
      { name: 'Puerto Negro', type: 'main', reward: '$10,000', description: 'Rompe una entrega blindada en el muelle.' },
      { name: 'Grúa 17', type: 'gang', reward: '$5,800', description: 'Limpia un punto de control tomado por la red del puerto.' },
    ],
  },
  {
    id: 'barcelon',
    name: 'Barcelon',
    subtitle: 'Neón costero · nightlife hostil',
    x: 1320,
    y: 435,
    color: '#b04fff',
    glow: 'rgba(176,79,255,0.24)',
    missions: [
      { name: 'Noche Roja', type: 'gang', reward: '$7,300', description: 'Cierra una ruta de club a club bajo presión armada.' },
      { name: 'Club Meridian', type: 'heist', reward: '$9,100', description: 'Recupera material de chantaje en un distrito VIP.' },
    ],
  },
  {
    id: 'costa',
    name: 'Costa del Sol',
    subtitle: 'Lujo, villas y dinero oscuro',
    x: 900,
    y: 570,
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.22)',
    missions: [
      { name: 'Villa de Cristal', type: 'heist', reward: '$12,000', description: 'Infiltra una finca conectada con círculos políticos.' },
      { name: 'Último Favor', type: 'final', reward: '$20,000', description: 'Abre la puerta a la conspiración de más alto nivel.' },
    ],
  },
];

const badgeStyles: Record<CityMission['type'], string> = {
  main: 'border-red-500/60 text-red-300 bg-red-500/10',
  heist: 'border-emerald-400/60 text-emerald-300 bg-emerald-400/10',
  gang: 'border-fuchsia-400/60 text-fuchsia-300 bg-fuchsia-400/10',
  final: 'border-amber-300/70 text-amber-200 bg-amber-300/10',
};

const badgeLabels: Record<CityMission['type'], string> = {
  main: 'MAIN',
  heist: 'HEIST',
  gang: 'GANG',
  final: 'FINAL',
};

export default function WorldMap() {
  const [activeCityId, setActiveCityId] = useState('mandril');
  const activeCity = useMemo(() => cities.find((city) => city.id === activeCityId) ?? cities[1], [activeCityId]);

  return (
    <div className="min-h-screen bg-[#060a12] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,197,24,0.08),transparent_22%),linear-gradient(180deg,#08101b_0%,#060a12_100%)]" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.22) 2px,rgba(0,0,0,0.22) 4px)' }} />

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.2fr_420px] min-h-screen">
        <div className="relative p-4 sm:p-6 xl:p-8">
          <div className="mb-5 sm:mb-6">
            <div className="text-[11px] tracking-[0.36em] text-slate-400 uppercase mb-2">The Urban Noir · Spain</div>
            <h1 className="font-display text-3xl sm:text-5xl tracking-[0.12em] leading-none text-orange-400">MAPA INTERACTIVO</h1>
            <p className="mt-3 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
              Vista estratégica del mundo: núcleos urbanos, tono regional y primeras cadenas de misión. Diseñado para encajar con el noir del proyecto y para explorar el slice de Mandril desde móvil o escritorio.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 xl:hidden">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setActiveCityId(city.id)}
                className="rounded-full border px-3 py-2 text-xs tracking-[0.16em] uppercase"
                style={{
                  borderColor: activeCity.id === city.id ? city.color : 'rgba(255,255,255,0.14)',
                  background: activeCity.id === city.id ? `${city.color}22` : 'rgba(255,255,255,0.03)',
                  color: activeCity.id === city.id ? city.color : '#cbd5e1',
                }}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-[#07111a] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.45)] aspect-[16/10] min-h-[280px] sm:min-h-[420px] xl:min-h-[68vh]">
            <svg viewBox="0 0 1600 800" className="w-full h-full">
              <defs>
                <linearGradient id="skyNoir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#091129" />
                  <stop offset="55%" stopColor="#0b1734" />
                  <stop offset="100%" stopColor="#060a12" />
                </linearGradient>
                <filter id="cityGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="18" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect width="1600" height="800" fill="url(#skyNoir)" />
              <path d="M0,510 Q400,450 800,490 Q1100,470 1400,450 Q1500,438 1600,425 L1600,800 L0,800 Z" fill="#04111f" opacity="0.92" />
              <polygon points="90,490 140,360 190,280 290,220 400,195 540,170 700,145 850,135 980,145 1110,158 1260,175 1400,195 1515,225 1600,282 1600,400 1520,468 1415,492 1300,505 1160,516 960,526 760,536 570,544 390,554 250,561 140,546 90,525" fill="#0b1729" stroke="#1a2840" strokeWidth="2" />
              <ellipse cx="300" cy="325" rx="210" ry="140" fill="#0d2640" opacity="0.35" />
              <ellipse cx="760" cy="360" rx="185" ry="128" fill="#181f39" opacity="0.4" />
              <ellipse cx="1230" cy="220" rx="200" ry="135" fill="#2b160d" opacity="0.32" />
              <ellipse cx="1320" cy="430" rx="180" ry="130" fill="#251234" opacity="0.34" />
              <ellipse cx="900" cy="575" rx="250" ry="145" fill="#112416" opacity="0.3" />

              <path d="M110,405 Q320,382 520,372 Q735,360 980,370 Q1200,378 1490,362" stroke="#2d3e52" strokeWidth="8" fill="none" />
              <path d="M320,340 Q480,356 650,365 Q710,368 760,362" stroke="#31404f" strokeWidth="6" fill="none" />
              <path d="M825,344 Q950,280 1110,240 Q1188,220 1230,220" stroke="#4c3421" strokeWidth="6" fill="none" />
              <path d="M830,395 Q980,405 1130,420 Q1240,430 1325,432" stroke="#402455" strokeWidth="6" fill="none" />
              <path d="M780,415 Q820,500 885,566" stroke="#36513a" strokeWidth="6" fill="none" />

              {cities.map((city) => (
                <g key={city.id} onClick={() => setActiveCityId(city.id)} style={{ cursor: 'pointer' }}>
                  <circle cx={city.x} cy={city.y} r={activeCityId === city.id ? 58 : 48} fill={city.glow} filter="url(#cityGlow)" opacity={activeCityId === city.id ? 1 : 0.65} />
                  <circle cx={city.x} cy={city.y} r={activeCityId === city.id ? 24 : 20} fill={city.color} stroke="#fff" strokeWidth="2" />
                  <circle cx={city.x} cy={city.y} r={activeCityId === city.id ? 40 : 34} fill="none" stroke={city.color} strokeWidth="2" strokeOpacity={activeCityId === city.id ? 0.95 : 0.5} />
                  <text x={city.x} y={city.y - 42} textAnchor="middle" fill={city.color} fontSize="16" letterSpacing="3">{city.name.toUpperCase()}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <aside className="relative z-10 border-t xl:border-t-0 xl:border-l border-white/10 bg-black/35 backdrop-blur-md p-4 sm:p-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="text-[10px] tracking-[0.28em] text-slate-400 uppercase mb-2">Ciudad activa</div>
            <div className="font-display text-3xl tracking-[0.12em]" style={{ color: activeCity.color }}>{activeCity.name.toUpperCase()}</div>
            <div className="mt-2 text-slate-300 text-sm">{activeCity.subtitle}</div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="text-[10px] tracking-[0.28em] text-slate-400 uppercase mb-3">Cadenas de misión</div>
            <div className="space-y-3">
              {activeCity.missions.map((mission) => (
                <div key={mission.name} className="rounded-xl border border-white/8 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg tracking-[0.06em] text-white">{mission.name}</div>
                      <div className="mt-1 text-sm text-slate-300 leading-snug">{mission.description}</div>
                    </div>
                    <div className={`shrink-0 rounded-full border px-2 py-1 text-[10px] tracking-[0.16em] ${badgeStyles[mission.type]}`}>{badgeLabels[mission.type]}</div>
                  </div>
                  <div className="mt-3 text-sm text-emerald-300">{mission.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
