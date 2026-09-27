import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Award, Info, TrendingUp, BarChart2 } from 'lucide-react';
import { stormDataService } from '../data/stormDataService';

export const SkillTab: React.FC = () => {
  const [metric, setMetric] = useState<'csi' | 'fss'>('csi');
  const skillData = stormDataService.getSkillCurveData();

  return (
    <div className="space-y-4 p-4 text-slate-200">
      
      {/* Mandatory Disclaimer Badge */}
      <div className="p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-xs text-slate-300 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-bold text-accent-cyan flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Operational Forecast Skill Verification</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-amber-300 border border-amber-400/30">
            illustrative until pilot
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Comparing VAJRA's multi-sensor blended model against the operational PySTEPS baseline (radar-only Lagrangian persistence) evaluated over high-impact Indian convective events.
        </p>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex items-center justify-between border-b border-glass pb-2">
        <div className="text-xs font-heading font-semibold text-white">Select Metric:</div>
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-glass">
          <button
            onClick={() => setMetric('csi')}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              metric === 'csi'
                ? 'bg-accent-orange text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CSI (Critical Success Index)
          </button>
          <button
            onClick={() => setMetric('fss')}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              metric === 'fss'
                ? 'bg-accent-orange text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FSS (Fractions Skill Score)
          </button>
        </div>
      </div>

      {/* Skill Curve Chart */}
      <div className="p-3 rounded-xl bg-panel border border-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">
            {metric === 'csi' ? 'CSI Score (Threshold ≥ 35 dBZ)' : 'FSS Score (Spatial Scale 10 km)'}
          </span>
          <span className="text-[10px] text-slate-400">Lead Time: 0 to 360 min</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={skillData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="leadTimeMin"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                unit="m"
              />
              <YAxis
                domain={[0, 1]}
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E1626',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                labelFormatter={(value) => `Lead Time: ${value} min`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              
              {metric === 'csi' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="csiVajra"
                    name="VAJRA (Blended)"
                    stroke="#F28C28"
                    strokeWidth={2.5}
                    dot={{ fill: '#F28C28', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="csiPysteps"
                    name="PySTEPS (Baseline Radar Only)"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#94A3B8', r: 2 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="fssVajra"
                    name="VAJRA (Blended FSS)"
                    stroke="#00D2FF"
                    strokeWidth={2.5}
                    dot={{ fill: '#00D2FF', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fssPysteps"
                    name="PySTEPS Baseline FSS"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#94A3B8', r: 2 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Numerical Benchmark Comparison */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-3 rounded-lg bg-panel border border-glass space-y-1">
          <div className="text-[10px] text-slate-400">T+60m CSI ADVANTAGE</div>
          <div className="text-lg font-bold text-accent-orange">+23.5%</div>
          <p className="text-[10px] text-slate-500 font-sans">
            Maintains core identification while pure advection experiences decorrelation.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-panel border border-glass space-y-1">
          <div className="text-[10px] text-slate-400">T+180m SKILL RETENTION</div>
          <div className="text-lg font-bold text-accent-cyan">0.39 vs 0.16</div>
          <p className="text-[10px] text-slate-500 font-sans">
            NCUM 1.5 km regional NWP smoothly assumes spatial probability envelope.
          </p>
        </div>
      </div>

    </div>
  );
};
