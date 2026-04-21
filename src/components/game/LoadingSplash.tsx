type LoadingSplashProps = {
  progressText?: string;
};

export default function LoadingSplash({ progressText = 'Cargando distrito y sistemas...' }: LoadingSplashProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-[#060a12]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,86,34,0.16),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(0,212,255,0.1),transparent_20%),linear-gradient(180deg,#070b12_0%,#09111a_48%,#04070c_100%)]" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      <div className="absolute left-[10%] top-[16%] h-24 w-[2px] bg-cyan-300/20 blur-[1px]" />
      <div className="absolute right-[14%] bottom-[18%] h-28 w-[2px] bg-orange-400/20 blur-[1px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="text-[11px] tracking-[0.34em] text-cyan-200/65 mb-3">MANDRIL VERTICAL SLICE</div>
        <div className="font-display text-4xl sm:text-6xl leading-[0.92] tracking-[0.12em] text-orange-400 drop-shadow-[0_0_18px_rgba(255,102,51,0.3)]">
          EL
          <br />
          PELIGROSO
        </div>
        <div className="font-display mt-2 text-3xl sm:text-5xl tracking-[0.16em] text-amber-300 drop-shadow-[0_0_12px_rgba(245,197,24,0.25)]">
          ESPANA
        </div>

        <div className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 backdrop-blur-md">
          <div className="text-[10px] tracking-[0.24em] text-slate-400 mb-3">INICIANDO ESCENA</div>
          <div className="h-2 rounded-full overflow-hidden bg-white/10">
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-400" />
          </div>
          <div className="mt-3 text-sm text-slate-300">{progressText}</div>
        </div>
      </div>
    </div>
  );
}
