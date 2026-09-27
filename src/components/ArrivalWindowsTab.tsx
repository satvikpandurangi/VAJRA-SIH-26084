import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, MapPin, Zap, Wind, Sparkles, CloudRain, ShieldAlert } from 'lucide-react';
import { ArrivalWindow, HazardType } from '../data/types';

interface ArrivalWindowsTabProps {
  windows: ArrivalWindow[];
  onSelectTown?: (town: ArrivalWindow) => void;
}

export const ArrivalWindowsTab: React.FC<ArrivalWindowsTabProps> = ({ windows, onSelectTown }) => {
  // Live seconds ticker for countdown calculation
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getHazardIcon = (h: HazardType) => {
    switch (h) {
      case 'lightning': return <Zap className="w-3.5 h-3.5 text-hazard-lightning" />;
      case 'hail': return <Sparkles className="w-3.5 h-3.5 text-cyan-300" />;
      case 'downburst': return <Wind className="w-3.5 h-3.5 text-hazard-downburst" />;
      case 'cloudburst': return <CloudRain className="w-3.5 h-3.5 text-hazard-cloudburst" />;
      default: return <ShieldAlert className="w-3.5 h-3.5 text-hazard-severe" />;
    }
  };

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'RED':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-[10px]">RED ALERT</span>;
      case 'ORANGE':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[10px]">ORANGE</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-mono font-medium text-[10px]">YELLOW</span>;
    }
  };

  const formatCountdown = (startMin: number) => {
    if (startMin <= 0) return 'IMPACT NOW';
    const totalSec = Math.max(0, startMin * 60 - seconds);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `starts in ${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const maxAxisMinutes = 120; // 0 to 2 hours timeline axis

  return (
    <div className="space-y-4 p-4 text-slate-200">
      
      {/* Tab Explainer Alert */}
      <div className="p-3 rounded-lg bg-accent-orange/10 border border-accent-orange/20 text-xs text-slate-300 space-y-1">
        <div className="font-bold text-accent-orange flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Honest Arrival Windows (Not Point Countdowns)</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Atmospheric convection moves with turbulent dispersion. VAJRA displays temporal uncertainty intervals (T_start to T_end) with live onset clocks and likelihood percentages.
        </p>
      </div>

      {/* Timeline Axis Header */}
      <div className="pt-2 px-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-glass pb-1">
          <span>T+0m (Now)</span>
          <span>+30m</span>
          <span>+60m (1h)</span>
          <span>+90m</span>
          <span>+120m (2h)</span>
        </div>
      </div>

      {/* Towns Arrival Windows List */}
      <div className="space-y-3">
        {windows.map((w, idx) => {
          const windowWidthMin = w.windowEndMin - w.windowStartMin;
          const leftPercent = Math.min(95, (w.windowStartMin / maxAxisMinutes) * 100);
          const widthPercent = Math.max(5, Math.min(100 - leftPercent, (windowWidthMin / maxAxisMinutes) * 100));

          return (
            <div
              key={idx}
              onClick={() => onSelectTown && onSelectTown(w)}
              className="p-3 rounded-xl bg-panel border border-glass hover:border-glass-bright transition cursor-pointer space-y-2.5"
            >
              {/* Top row: Town name, distance, alert chip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent-orange shrink-0" />
                  <span className="font-heading font-bold text-sm text-white">{w.town}</span>
                  <span className="text-[10px] font-mono text-slate-400">({w.distanceKm} km away)</span>
                </div>
                {getAlertBadge(w.alertLevel)}
              </div>

              {/* Range bar on 0-120 min axis */}
              <div className="space-y-1">
                <div className="relative w-full h-5 rounded-md bg-black/60 border border-glass overflow-hidden">
                  
                  {/* Background grid ticks */}
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
                    <div className="w-px h-full bg-slate-400" />
                    <div className="w-px h-full bg-slate-400" />
                    <div className="w-px h-full bg-slate-400" />
                    <div className="w-px h-full bg-slate-400" />
                  </div>

                  {/* Horizontal Range Bar */}
                  <div
                    className="absolute top-0.5 bottom-0.5 rounded transition-all duration-300 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: w.alertLevel === 'RED' ? '#E11D48' : (w.alertLevel === 'ORANGE' ? '#F59E0B' : '#0284C7')
                    }}
                  >
                    <span className="truncate px-1">
                      {w.windowStartMin}–{w.windowEndMin}m
                    </span>
                  </div>
                </div>

                {/* Subtext info under the bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1 text-accent-cyan">
                    <Clock className="w-3 h-3" />
                    <span className="font-semibold">{formatCountdown(w.windowStartMin)}</span>
                    <span className="text-slate-500">· width {windowWidthMin}m</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-white">
                    <span>{w.probability}% prob</span>
                    <span className="text-slate-500">|</span>
                    <div className="flex items-center gap-1" title={w.primaryHazard}>
                      {getHazardIcon(w.primaryHazard)}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
