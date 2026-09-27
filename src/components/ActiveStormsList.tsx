import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Wind, 
  CloudRain, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Navigation,
  Eye,
  AlertCircle
} from 'lucide-react';
import { StormCell, HazardType } from '../data/types';
import { GlassPanel } from './GlassPanel';

interface ActiveStormsListProps {
  cells: StormCell[];
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
  onFlyToCell: (cell: StormCell) => void;
}

export const ActiveStormsList: React.FC<ActiveStormsListProps> = ({
  cells,
  selectedCellId,
  onSelectCell,
  onFlyToCell
}) => {
  const getHazardIcon = (hazard: HazardType) => {
    switch (hazard) {
      case 'lightning':
        return <span key={hazard} title="Lightning"><Zap className="w-3.5 h-3.5 text-hazard-lightning" /></span>;
      case 'hail':
        return <span key={hazard} title="Severe Hail"><Sparkles className="w-3.5 h-3.5 text-cyan-300" /></span>;
      case 'downburst':
        return <span key={hazard} title="Downburst"><Wind className="w-3.5 h-3.5 text-hazard-downburst" /></span>;
      case 'cloudburst':
        return <span key={hazard} title="Cloudburst"><CloudRain className="w-3.5 h-3.5 text-hazard-cloudburst" /></span>;
      default:
        return <span key={hazard} title="Severe Thunderstorm"><ShieldAlert className="w-3.5 h-3.5 text-hazard-severe" /></span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'severe':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            SEVERE
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MODERATE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
            DEVELOPING
          </span>
        );
    }
  };

  // Sparkline SVG generator for 30-min dBZ history
  const renderSparkline = (history: number[]) => {
    const min = 20;
    const max = 70;
    const width = 64;
    const height = 20;
    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    const lastVal = history[history.length - 1];
    const isHigh = lastVal >= 55;

    return (
      <svg className="w-16 h-5 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isHigh ? '#F28C28' : '#38BDF8'}
          strokeWidth="1.5"
          points={points}
        />
        {/* Current point dot */}
        {history.length > 0 && (
          <circle
            cx={width}
            cy={height - ((lastVal - min) / (max - min)) * height}
            r="2.5"
            fill={isHigh ? '#EF4444' : '#38BDF8'}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#090F1C]/90 backdrop-blur-md border-r border-glass text-slate-200">
      
      {/* Header */}
      <div className="p-3.5 border-b border-glass flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
          <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
            Active Storm Cells ({cells.length})
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Ranked by VIL & dBZ</span>
      </div>

      {/* Storm Cells List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {cells.map(cell => {
          const isSelected = cell.id === selectedCellId;
          return (
            <div
              key={cell.id}
              onClick={() => {
                onSelectCell(cell.id);
                onFlyToCell(cell);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none space-y-2.5 ${
                isSelected
                  ? 'bg-panel-card border-accent-orange shadow-glow text-white'
                  : 'bg-panel/70 hover:bg-panel border-glass text-slate-300'
              }`}
            >
              {/* Card Top: ID, Severity, Satellite CI Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-accent-cyan">
                    {cell.id}
                  </span>
                  {cell.isNewSatelliteDetection && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-hazard-downburst/25 text-fuchsia-300 border border-hazard-downburst/40 animate-pulse">
                      NEW (SAT CI)
                    </span>
                  )}
                </div>
                {getSeverityBadge(cell.severity)}
              </div>

              {/* Storm Name */}
              <div className="font-heading font-semibold text-xs leading-tight">
                {cell.name}
              </div>

              {/* Reflectivity, Trend & Sparkline */}
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-lg border border-glass/60 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">MAX:</span>
                  <span className={`font-bold ${cell.currentDbz >= 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {cell.currentDbz.toFixed(1)} dBZ
                  </span>
                  
                  {/* Trend Indicator */}
                  {cell.trend === 'intensifying' && (
                    <span className="flex items-center text-rose-400 text-[10px]" title="Intensifying">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {cell.trend === 'weakening' && (
                    <span className="flex items-center text-sky-400 text-[10px]" title="Weakening">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {cell.trend === 'steady' && (
                    <span className="flex items-center text-slate-400 text-[10px]" title="Steady">
                      <Minus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* 30-min Sparkline */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-slate-500">-30m</span>
                  {renderSparkline(cell.history30MinDbz)}
                </div>
              </div>

              {/* Motion Vector & Hazard Icons */}
              <div className="flex items-center justify-between text-xs pt-1">
                
                {/* Movement Vector */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                  <Navigation 
                    className="w-3 h-3 text-accent-orange" 
                    style={{ transform: `rotate(${cell.movementVector.bearingDeg}deg)` }} 
                  />
                  <span>{cell.movementVector.directionLabel}</span>
                </div>

                {/* Hazard Icons Array */}
                <div className="flex items-center gap-1.5">
                  {cell.topHazards.map(h => getHazardIcon(h))}
                </div>

              </div>

              {/* VIL & Echo Top Diagnostics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-0.5 border-t border-glass/40">
                <div>VIL: <strong className="text-slate-200">{cell.vilKgM2} kg/m²</strong></div>
                <div>Top: <strong className="text-slate-200">{cell.echoTopKm} km</strong></div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 border-t border-glass bg-black/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Click card to fly map view</span>
        <Eye className="w-3.5 h-3.5 text-accent-cyan" />
      </div>

    </div>
  );
};
