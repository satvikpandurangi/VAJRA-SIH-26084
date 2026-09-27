import React from 'react';
import { CloudRain, AlertTriangle, Mountain, ShieldAlert, Droplets, CheckCircle2 } from 'lucide-react';
import { StormCell, RegionInfo } from '../data/types';
import { GlassPanel } from './GlassPanel';

interface CloudburstTabProps {
  selectedCell: StormCell;
  region: RegionInfo;
  cells: StormCell[];
}

export const CloudburstTab: React.FC<CloudburstTabProps> = ({
  selectedCell,
  region,
  cells
}) => {
  // Check if any cell meets the official IMD Cloudburst definition: >= 100 mm/h over 20-30 km²
  const cloudburstCells = cells.filter(c => c.rainfallRateMmH >= 100);
  const nearThresholdCells = cells.filter(c => c.rainfallRateMmH >= 70 && c.rainfallRateMmH < 100);

  const isTriggered = selectedCell.rainfallRateMmH >= 100;
  const isNear = selectedCell.rainfallRateMmH >= 70 && !isTriggered;

  return (
    <div className="space-y-4 p-4 text-slate-200">
      
      {/* Official IMD Threshold Banner */}
      <div className={`p-4 rounded-xl border transition-all ${
        isTriggered 
          ? 'bg-rose-950/40 border-rose-500 shadow-glow-red text-rose-100 animate-pulse-subtle' 
          : 'bg-panel border-glass text-slate-300'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isTriggered ? 'bg-rose-500/20 text-rose-400' : 'bg-accent-blue/20 text-accent-cyan'}`}>
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-white">IMD Cloudburst Diagnostic</span>
                {isTriggered && (
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[10px] animate-pulse">
                    THRESHOLD BREACHED
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Official Criterion: ≥ 100 mm/h over 20–30 km²
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cell Rain-Rate Dial */}
        <div className="mt-4 pt-3 border-t border-glass/60 grid grid-cols-2 gap-3 text-center font-mono">
          <div className="p-2.5 rounded-lg bg-black/40 border border-glass">
            <div className="text-[10px] text-slate-400">ESTIMATED RAIN RATE</div>
            <div className={`text-2xl font-black ${
              isTriggered ? 'text-rose-400' : (isNear ? 'text-amber-400' : 'text-accent-cyan')
            }`}>
              {selectedCell.rainfallRateMmH} <span className="text-xs font-normal">mm/h</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-black/40 border border-glass">
            <div className="text-[10px] text-slate-400">AFFECTED CORE AREA</div>
            <div className="text-2xl font-black text-white">
              {selectedCell.areaSqKm} <span className="text-xs font-normal">km²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terrain & Orographic Factors */}
      <GlassPanel className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>Terrain & Orographic Locking</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-glass">
            {region.orographicWarning ? 'Himalayan Ridge: High' : 'Plains / Coastal'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {region.orographicWarning 
            ? 'Steep valley topography in the Garhwal / Kumaon Himalaya creates steep funneling. When a quasi-stationary convective cell (>55 dBZ) anchors against a ridge, moisture flux converts entirely into intense localized cloudburst rainfall.'
            : 'Pre-monsoon maritime convective moisture pumping produces intense localized rainbursts. Urban catchments face severe waterlogging if cell translation speed drops below 20 km/h.'
          }
        </p>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-300">
          <div className="p-2 rounded bg-black/30 border border-glass/40">
            <div className="text-slate-500">Echo Top:</div>
            <div className="font-bold text-white">{selectedCell.echoTopKm} km (Deep Inflow)</div>
          </div>
          <div className="p-2 rounded bg-black/30 border border-glass/40">
            <div className="text-slate-500">Cloud-Top Temp:</div>
            <div className="font-bold text-accent-cyan">{selectedCell.cloudTopTempC}°C (Very Cold)</div>
          </div>
        </div>
      </GlassPanel>

      {/* Region Status: Triggered Cells */}
      <div className="space-y-2">
        <div className="text-xs font-heading font-semibold text-slate-300 px-1">
          Catchment Cells Under Cloudburst Watch:
        </div>

        {cells.map(c => {
          const cTriggered = c.rainfallRateMmH >= 100;
          const cNear = c.rainfallRateMmH >= 70 && !cTriggered;

          return (
            <div 
              key={c.id}
              className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                cTriggered 
                  ? 'bg-rose-950/30 border-rose-500/60 text-rose-200' 
                  : (cNear ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-panel border-glass text-slate-400')
              }`}
            >
              <div>
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-[10px]">{c.id} · {c.movementVector.directionLabel}</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm">
                  {c.rainfallRateMmH} mm/h
                </div>
                <div className="text-[10px]">
                  {cTriggered ? 'CRITICAL (>100)' : (cNear ? 'ELEVATED (>70)' : 'MODERATE')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
