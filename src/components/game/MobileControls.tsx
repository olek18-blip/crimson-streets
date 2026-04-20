import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../../game/store';
import { useMobileControlsStore } from '../../game/mobileControls';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function MobileControls() {
  const screen = useGameStore((state) => state.screen);
  const switchWeapon = useGameStore((state) => state.switchWeapon);
  const setPlayerInVehicle = useGameStore((state) => state.setPlayerInVehicle);
  const setAxis = useMobileControlsStore((state) => state.setAxis);
  const setSprint = useMobileControlsStore((state) => state.setSprint);
  const setShooting = useMobileControlsStore((state) => state.setShooting);
  const reset = useMobileControlsStore((state) => state.reset);
  const axisX = useMobileControlsStore((state) => state.axisX);
  const axisY = useMobileControlsStore((state) => state.axisY);

  const padRef = useRef<HTMLDivElement | null>(null);
  const activeTouchId = useRef<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const knobStyle = useMemo(
    () => ({
      transform: `translate(calc(-50% + ${axisX * 26}px), calc(-50% + ${axisY * 26}px))`,
    }),
    [axisX, axisY],
  );

  if (!isTouchDevice || screen === 'menu') {
    return null;
  }

  const updateFromTouch = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width * 0.34;
    const nx = clamp(dx / maxRadius, -1, 1);
    const ny = clamp(dy / maxRadius, -1, 1);
    setAxis(nx, ny);
  };

  const handlePadTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    activeTouchId.current = touch.identifier;
    updateFromTouch(touch.clientX, touch.clientY);
  };

  const handlePadTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouchId.current);
    if (!touch) return;
    updateFromTouch(touch.clientX, touch.clientY);
  };

  const handlePadTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouchId.current);
    if (!touch) return;
    activeTouchId.current = null;
    setAxis(0, 0);
    setSprint(false);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none sm:hidden">
      <div className="absolute left-4 bottom-6 pointer-events-auto">
        <div
          ref={padRef}
          className="relative h-28 w-28 rounded-full border border-white/15 bg-black/25 backdrop-blur-md touch-none"
          onTouchStart={handlePadTouchStart}
          onTouchMove={handlePadTouchMove}
          onTouchEnd={handlePadTouchEnd}
          onTouchCancel={handlePadTouchEnd}
        >
          <div className="absolute inset-[16%] rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-white/15 border border-white/20" style={knobStyle} />
        </div>
        <div className="mt-2 text-center text-[10px] tracking-[0.18em] text-slate-400">MOVER</div>
      </div>

      <div className="absolute right-4 bottom-6 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            className="h-14 w-14 rounded-full border border-cyan-300/20 bg-cyan-400/15 text-cyan-100 text-[11px] tracking-[0.14em]"
            onTouchStart={() => setSprint(true)}
            onTouchEnd={() => setSprint(false)}
            onTouchCancel={() => setSprint(false)}
          >
            RUN
          </button>
          <button
            className="h-16 w-16 rounded-full border border-red-300/25 bg-red-500/20 text-red-100 text-[11px] tracking-[0.14em]"
            onTouchStart={() => setShooting(true)}
            onTouchEnd={() => setShooting(false)}
            onTouchCancel={() => setShooting(false)}
          >
            FIRE
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="h-12 w-12 rounded-full border border-amber-300/20 bg-amber-400/15 text-amber-100 text-[10px] tracking-[0.14em]"
            onClick={() => switchWeapon()}
          >
            ARMA
          </button>
          <button
            className="h-12 w-12 rounded-full border border-white/20 bg-white/10 text-white text-[10px] tracking-[0.14em]"
            onClick={() => setPlayerInVehicle(null)}
          >
            SALIR
          </button>
        </div>
      </div>
    </div>
  );
}
