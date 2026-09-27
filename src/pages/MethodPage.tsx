import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Radio, 
  Satellite, 
  Zap, 
  Wind, 
  Sparkles, 
  CloudRain, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink, 
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';

interface MethodPageProps {
  onNavigate: (view: 'landing' | 'console' | 'method') => void;
  onOpenReport: () => void;
}

export const MethodPage: React.FC<MethodPageProps> = ({ onNavigate, onOpenReport }) => {
  // Interactive Blending Weights Slider (0 to 360 min)
  const [blendLeadTime, setBlendLeadTime] = useState<number>(75);

  // Calculate dynamic weights based on VAJRA relaxation equation: w = exp(-(t/105)^1.6)
  const tau = 105;
  const radarWeight = Math.round(Math.exp(-Math.pow(blendLeadTime / tau, 1.6)) * 100);
  const nwpWeight = 100 - radarWeight;

  return (
    <div className="w-full min-h-screen bg-background text-slate-100 flex flex-col selection:bg-accent-orange/30">
      
      {/* Top Hero Banner */}
      <section className="border-b border-glass bg-[#080E1A] py-14 px-4">
        <div className="max-w-5xl mx-auto space-y-4 text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-orange/10 border border-accent-orange/30 text-accent-orange text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>METEOROLOGICAL METHODOLOGY & DIAGNOSTIC REASONING</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Scientific Foundation of VAJRA
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Convective storms operate on fast non-linear physics. Discover how VAJRA reconciles Lagrangian radar extrapolation with convection-permitting NWP, and the physical equations governing our five hazard diagnostics.
          </p>

        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        
        {/* 1. INTERACTIVE BLENDING WEIGHTS SLIDER (0 - 6 HOURS) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent-orange" />
              <h2 className="font-heading font-bold text-2xl text-white">
                Interactive Blending Weights (0–6 Hours)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Drag the slider below to observe how VAJRA automatically adjusts the mathematical weight between 
              <strong className="text-white"> Radar Optical-Flow Persistence</strong> and 
              <strong className="text-white"> NCUM Convection-Permitting NWP</strong> across lead times.
            </p>
          </div>

          <GlassPanel className="p-6 sm:p-8 space-y-6 border-accent-orange/30">
            
            {/* Slider Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Target Forecast Horizon:</span>
                <span className="text-white font-bold text-base">
                  +{blendLeadTime} min ({Math.floor(blendLeadTime / 60)}h {blendLeadTime % 60}m)
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={blendLeadTime}
                onChange={e => setBlendLeadTime(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>T+0m (Radar Dominant)</span>
                <span>T+105m (50/50 Crossover)</span>
                <span>T+180m (3h)</span>
                <span>T+360m (NWP Dominant)</span>
              </div>
            </div>

            {/* Split Visual Weight Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span className="text-accent-orange">Radar Extrapolation: {radarWeight}%</span>
                <span className="text-accent-cyan">Convective NWP: {nwpWeight}%</span>
              </div>

              <div className="w-full h-5 rounded-lg bg-black/60 overflow-hidden flex border border-glass shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-accent-orange transition-all duration-150 flex items-center justify-center font-mono text-[10px] text-white font-bold"
                  style={{ width: `${radarWeight}%` }}
                >
                  {radarWeight > 12 && `${radarWeight}%`}
                </div>
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan transition-all duration-150 flex items-center justify-center font-mono text-[10px] text-white font-bold"
                  style={{ width: `${nwpWeight}%` }}
                >
                  {nwpWeight > 12 && `${nwpWeight}%`}
                </div>
              </div>
            </div>

            {/* Physical Mechanism Explanation for this exact lead time */}
            <div className="p-4 rounded-xl bg-black/40 border border-glass text-xs font-mono space-y-1.5">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Atmospheric Physics at T+{blendLeadTime} min:
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {blendLeadTime < 60 && (
                  'Radar Lagrangian extrapolation dominates. Storm updraft cores maintain coherent advection vectors. Individual hail spikes, reflectivity downdrafts, and lightning jumps have high correlation with surface observations.'
                )}
                {blendLeadTime >= 60 && blendLeadTime < 150 && (
                  'Dynamic transition regime. Storm cells undergo natural life-cycle turnover (entrainment of dry mid-level air, cold-pool gust front spreading). Optical flow coordinates begin expanding into uncertainty ellipses while NCUM high-resolution convection fields are phased in.'
                )}
                {blendLeadTime >= 150 && (
                  'Convection-permitting NWP dominates. Radar persistence has lost decorrelation skill. VAJRA presents smoothed spatial probability envelopes to avoid false precision for district disaster managers.'
                )}
              </p>
            </div>

          </GlassPanel>
        </section>

        {/* 2. PLAIN-LANGUAGE HAZARD DIAGNOSTICS */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-white">
              Plain-Language Hazard Diagnostic Criteria
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              How VAJRA’s automated inference engine distinguishes between benign rain showers, destructive hail, microburst downbursts, and catastrophic cloudbursts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Hail Diagnostic */}
            <GlassPanel className="p-5 space-y-3 border-l-4 border-l-hazard-hail">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Severe Hail (≥2.5 cm)</h3>
                  <div className="text-[10px] font-mono text-cyan-300">VIL & POSH Diagnostic</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Large hail forms when intense convective updrafts suspend supercooled water droplets in the freezing layer (-10°C to -30°C). VAJRA continuously integrates radar reflectivity vertically to compute <strong>Vertically Integrated Liquid (VIL)</strong> and evaluates the <strong>Probability of Severe Hail (POSH)</strong> using melting level sounding profiles.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-glass font-mono text-[11px] text-slate-300">
                Operational Trigger: <span className="text-white font-bold">VIL &gt; 45 kg/m²</span> + <span className="text-white font-bold">POSH &ge; 70%</span> + <span className="text-white font-bold">Dual-pol Z_DR &lt; 0.5 dB aloft</span>
              </div>
            </GlassPanel>

            {/* Downburst Diagnostic */}
            <GlassPanel className="p-5 space-y-3 border-l-4 border-l-hazard-downburst">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-400/10 text-purple-300">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Downburst & Microburst</h3>
                  <div className="text-[10px] font-mono text-purple-300">Core Collapse & Velocity Divergence</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A downburst occurs when a heavy precipitation core aloft rapidly collapses, evaporatively cooling the air and crashing toward the ground at aviation-critical speeds (&gt;70 km/h). VAJRA tracks sudden downward drops in reflectivity cores coupled with radial velocity shear divergence ($\Delta V_r$).
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-glass font-mono text-[11px] text-slate-300">
                Operational Trigger: <span className="text-white font-bold">ΔV_r &gt; 65 km/h</span> across 4 km + <span className="text-white font-bold">Core drop &gt; 15 dBZ/5min</span>
              </div>
            </GlassPanel>

            {/* Cloudburst Diagnostic */}
            <GlassPanel className="p-5 space-y-3 border-l-4 border-l-hazard-cloudburst">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-400/10 text-blue-300">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Himalayan Cloudburst</h3>
                  <div className="text-[10px] font-mono text-blue-300">Catchment Rainfall Rate ≥ 100 mm/h</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                By official IMD definition, a cloudburst is rainfall exceeding 100 mm per hour over a localized geographical area of roughly 20–30 km². In steep terrain like Uttarakhand, orographic lifting locks convective cells against mountain ridges, causing localized catastrophic deluge and debris flows.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-glass font-mono text-[11px] text-slate-300">
                Operational Trigger: <span className="text-white font-bold">Rainfall rate &ge; 100 mm/h</span> + <span className="text-white font-bold">Cell translation speed &le; 18 km/h</span>
              </div>
            </GlassPanel>

            {/* Lightning Diagnostic */}
            <GlassPanel className="p-5 space-y-3 border-l-4 border-l-hazard-lightning">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-300">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Cloud-to-Ground Lightning</h3>
                  <div className="text-[10px] font-mono text-amber-300">Graupel Non-Inductive Charging</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Electrification occurs when rebounding collisions between graupel pellets and ice crystals transfer charge in the mixed-phase zone (-10°C to -20°C). Sudden jumps in lightning stroke frequency (&gt;250% surge over 5 min) indicate vigorous updraft intensification preceding severe weather on the ground.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-glass font-mono text-[11px] text-slate-300">
                Operational Trigger: <span className="text-white font-bold">Echo Top &gt; 12 km</span> + <span className="text-white font-bold">Rate jump &gt; 40 strokes/min</span>
              </div>
            </GlassPanel>

          </div>
        </section>

        {/* 3. SENSOR SPECIFICATIONS & PHYSICAL LIMITATIONS */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-white">
              Sensor Specifications & Operational Limitations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every remote-sensing instrument possesses intrinsic physical blind spots that forecasters must understand to avoid misinterpretation.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-glass bg-panel">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-glass bg-panel-card text-slate-300 font-mono">
                  <th className="p-3.5">Instrument / Sensor</th>
                  <th className="p-3.5">Key Capability</th>
                  <th className="p-3.5">Refresh / Spatial Res</th>
                  <th className="p-3.5">Known Operational Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass font-mono text-slate-300">
                <tr>
                  <td className="p-3.5 font-bold text-accent-cyan">DWR S/C/X Band Radars</td>
                  <td className="p-3.5">High-resolution internal storm core reflectivity & velocity</td>
                  <td className="p-3.5 text-emerald-400">5 min · ~1 km</td>
                  <td className="p-3.5 text-slate-400 font-sans">
                    Cone of silence directly above antenna; beam blockage in Himalayan valleys; Earth curvature beam overshooting past 200 km.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-hazard-downburst">INSAT-3D / 3DS Satellites</td>
                  <td className="p-3.5">Rapid cloud-top cooling detection (pre-radar inception)</td>
                  <td className="p-3.5 text-accent-cyan">4.5 min · ~4 km</td>
                  <td className="p-3.5 text-slate-400 font-sans">
                    Parallax displacement due to slant view angle; cirrus anvil canopies can obscure lower-level convective restructuring.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-hazard-lightning">Lightning Location Net</td>
                  <td className="p-3.5">Total stroke density and microsecond time-of-arrival</td>
                  <td className="p-3.5 text-emerald-400">&lt; 1 min · &lt; 500 m</td>
                  <td className="p-3.5 text-slate-400 font-sans">
                    Lower detection efficiency for weak intra-cloud (IC) pulses compared to cloud-to-ground (CG) return strokes in dense forest canopy.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-accent-blue">NCUM-Regional NWP</td>
                  <td className="p-3.5">Atmospheric thermodynamics & 2–6h spatial envelope</td>
                  <td className="p-3.5 text-slate-400">6-hour cycle · 1.5 km</td>
                  <td className="p-3.5 text-slate-400 font-sans">
                    Convective initiation timing and cell coordinate errors in first 0–90 min (spin-up phase); boundary layer parameterization biases.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. REFERENCES & ACCREDITATION */}
        <section className="p-6 rounded-2xl bg-panel border border-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              Scientific References & Operational Guidelines
            </h3>
            <span className="text-xs font-mono text-slate-400">SIH 2026 · PS 26084</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="p-3 rounded-lg bg-black/30 border border-glass space-y-1">
              <div className="font-bold text-white">IMD Standard Operating Procedures (SOPs)</div>
              <p>Standard Operating Procedure for Severe Weather Forecasting and Dissemination, India Meteorological Department, New Delhi.</p>
            </div>

            <div className="p-3 rounded-lg bg-black/30 border border-glass space-y-1">
              <div className="font-bold text-white">NCMRWF Convection-Permitting Models</div>
              <p>Operational High-Resolution Regional Unified Model (NCUM) Nowcasting Architecture, MoES, Government of India.</p>
            </div>

            <div className="p-3 rounded-lg bg-black/30 border border-glass space-y-1">
              <div className="font-bold text-white">PySTEPS Probabilistic Framework</div>
              <p>Pulkkinen et al. (2019): Pysteps: an open-source library for probabilistic precipitation nowcasting. Geosci. Model Dev., 12, 4185–4219.</p>
            </div>

            <div className="p-3 rounded-lg bg-black/30 border border-glass space-y-1">
              <div className="font-bold text-white">WMO Guidelines for Nowcasting</div>
              <p>World Meteorological Organization (WMO-No. 1198): Guidelines for Nowcasting Techniques for Severe Convective Weather.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onOpenReport}
              className="text-xs font-mono text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>View Full Technical Architecture Whitepaper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('console')}
              className="px-4 py-2 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-heading font-bold text-xs shadow-glow transition"
            >
              Return to Nowcast Console
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
