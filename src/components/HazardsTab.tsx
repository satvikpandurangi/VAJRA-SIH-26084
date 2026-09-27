import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Wind, 
  CloudRain, 
  ShieldAlert, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { HazardProbabilityProfile, StormCell } from '../data/types';
import { stormDataService } from '../data/stormDataService';

interface HazardsTabProps {
  selectedCell: StormCell;
}

export const HazardsTab: React.FC<HazardsTabProps> = ({ selectedCell }) => {
  const hazardProfiles = stormDataService.getHazardProbabilities(selectedCell);

  const getConfidenceBadge = (confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'GUIDANCE') => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/30">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold border border-amber-500/30">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[9px] border border-slate-700">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[9px] border border-sky-500/30">
            GUIDANCE
          </span>
        );
    }
  };

  const getHazardIcon = (hazard: string) => {
    switch (hazard) {
      case 'lightning': return <Zap className="w-4 h-4 text-hazard-lightning" />;
      case 'hail': return <Sparkles className="w-4 h-4 text-cyan-300" />;
      case 'downburst': return <Wind className="w-4 h-4 text-hazard-downburst" />;
      case 'cloudburst': return <CloudRain className="w-4 h-4 text-hazard-cloudburst" />;
      default: return <ShieldAlert className="w-4 h-4 text-hazard-severe" />;
    }
  };

  return (
    <div className="space-y-4 p-4 text-slate-200">
      
      {/* Header Info */}
      <div className="p-3 rounded-lg bg-panel border border-glass flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-slate-400">ANALYZING CELL:</div>
          <div className="font-heading font-bold text-sm text-white">{selectedCell.name}</div>
        </div>
        <div className="text-right font-mono text-xs">
          <div className="text-accent-cyan font-bold">{selectedCell.id}</div>
          <div className="text-[10px] text-slate-400">{selectedCell.currentDbz} dBZ max</div>
        </div>
      </div>

      {/* Honest Confidence Legend */}
      <div className="flex items-center justify-between text-[10px] font-mono px-1 text-slate-400">
        <span>Confidence Grades:</span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">● High (0–1h)</span>
          <span className="text-amber-400">▲ Med (1–2h)</span>
          <span className="text-sky-400">■ Guidance (2–6h)</span>
        </div>
      </div>

      {/* Hazard Cards */}
      <div className="space-y-3">
        {hazardProfiles.map((p, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-panel border border-glass space-y-3">
            
            {/* Top row: Hazard Name & Current Probability */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-black/40 border border-glass">
                  {getHazardIcon(p.hazard)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-white">{p.label}</h4>
                  <div className="text-[10px] font-mono text-slate-400">Multi-horizon convective probability</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-sm font-bold text-white">{p.t0}%</div>
                <div className="text-[9px] text-emerald-400">Current (T+0)</div>
              </div>
            </div>

            {/* Probability Progress Bar at T+0 */}
            <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${p.t0}%`,
                  backgroundColor: p.color
                }}
              />
            </div>

            {/* Time Horizon Forecast Grid with Honest Badges */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-glass/40 text-center font-mono">
              
              {/* +30m */}
              <div className="p-1.5 rounded bg-black/30 border border-glass/30 space-y-1">
                <div className="text-[9px] text-slate-400">+30 min</div>
                <div className="text-xs font-bold text-white">{p.t30}%</div>
                <div>{getConfidenceBadge(p.confidenceT0)}</div>
              </div>

              {/* +60m */}
              <div className="p-1.5 rounded bg-black/30 border border-glass/30 space-y-1">
                <div className="text-[9px] text-slate-400">+60 min</div>
                <div className="text-xs font-bold text-white">{p.t60}%</div>
                <div>{getConfidenceBadge(p.confidenceT60)}</div>
              </div>

              {/* +120m */}
              <div className="p-1.5 rounded bg-black/30 border border-glass/30 space-y-1">
                <div className="text-[9px] text-slate-400">+120 min</div>
                <div className="text-xs font-bold text-white">{p.t120}%</div>
                <div>{getConfidenceBadge(p.confidenceT120)}</div>
              </div>

              {/* +240m */}
              <div className="p-1.5 rounded bg-black/30 border border-glass/30 space-y-1">
                <div className="text-[9px] text-slate-400">+240 min</div>
                <div className="text-xs font-bold text-slate-300">{p.t240}%</div>
                <div>{getConfidenceBadge('GUIDANCE')}</div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
