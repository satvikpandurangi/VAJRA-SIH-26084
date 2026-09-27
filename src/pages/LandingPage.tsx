import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Layers, 
  ShieldAlert, 
  Activity, 
  Radio, 
  Satellite, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  CloudRain, 
  Wind, 
  Sparkles, 
  Compass, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { GlassPanel } from '../components/GlassPanel';
import { SKILL_CURVE_DATA } from '../data/scenarios';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'console' | 'method') => void;
  onOpenReport: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenReport }) => {
  // Hero simulation state for drifting storm cells
  const [driftOffset, setDriftOffset] = useState(0);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      setDriftOffset(prev => (prev + 1) % 400);
    }, 80);

    return () => {
      clearInterval(driftInterval);
    };
  }, []);

  // Comparison data for "The Gap" chart
  const gapChartData = [
    { time: '0m', radar: 92, nwp: 35, vajra: 92 },
    { time: '30m', radar: 82, nwp: 45, vajra: 85 },
    { time: '60m', radar: 65, nwp: 52, vajra: 74 },
    { time: '90m', radar: 46, nwp: 58, vajra: 67 },
    { time: '120m', radar: 28, nwp: 64, vajra: 63 },
    { time: '180m', radar: 14, nwp: 62, vajra: 56 },
    { time: '240m', radar: 6, nwp: 58, vajra: 49 },
    { time: '300m', radar: 2, nwp: 54, vajra: 44 },
    { time: '360m', radar: 1, nwp: 51, vajra: 40 }
  ];

  return (
    <div className="w-full min-h-screen bg-background text-slate-100 flex flex-col selection:bg-accent-orange/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-glass px-4 py-16">
        
        {/* Dynamic Canvas / Animated Storm Map Background */}
        <div className="absolute inset-0 z-0 bg-[#070B14] overflow-hidden pointer-events-none">
          
          {/* Subtle coastline SVG silhouette representing India East Coast & Bay of Bengal */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-20" 
            viewBox="0 0 1000 700" 
            preserveAspectRatio="none"
          >
            {/* Coastline shape */}
            <path 
              d="M 150,0 Q 280,120 340,240 T 420,380 T 510,500 T 580,700 L 0,700 L 0,0 Z" 
              fill="#0A1424" 
              stroke="#1F3864" 
              strokeWidth="1.5"
            />
            {/* Bay of Bengal subtle bathymetry lines */}
            <path d="M 380,260 Q 480,360 620,540" fill="none" stroke="rgba(0, 112, 192, 0.15)" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M 440,280 Q 560,400 720,580" fill="none" stroke="rgba(0, 112, 192, 0.12)" strokeWidth="1" strokeDasharray="6 6" />
          </svg>

          {/* Drifting Convective Storm Cells moving East-South-East (ESE) */}
          <div 
            className="absolute transition-transform duration-75 ease-linear"
            style={{
              transform: `translate(${driftOffset * 0.9}px, ${driftOffset * 0.45}px)`,
              top: '12%',
              left: '18%'
            }}
          >
            {/* Storm Cell 1: Severe Hooghly/Bardhaman Core */}
            <div className="relative w-72 h-72 rounded-full opacity-80 filter blur-xl bg-gradient-to-br from-emerald-500/20 via-amber-500/40 to-rose-600/60 animate-pulse-subtle" />
            <div className="absolute top-1/3 left-1/3 w-28 h-28 rounded-full bg-rose-500/80 filter blur-md" />
            <div className="absolute top-2/5 left-2/5 w-12 h-12 rounded-full bg-fuchsia-400 filter blur-xs" />
          </div>

          <div 
            className="absolute transition-transform duration-75 ease-linear"
            style={{
              transform: `translate(${driftOffset * 0.75}px, ${driftOffset * 0.38}px)`,
              top: '35%',
              left: '8%'
            }}
          >
            {/* Storm Cell 2: Coastal Convective Cluster */}
            <div className="relative w-56 h-56 rounded-full opacity-70 filter blur-xl bg-gradient-to-tr from-sky-500/20 via-amber-500/35 to-rose-600/50" />
            <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-amber-400/70 filter blur-sm" />
          </div>

          {/* High-tech Radar Range Rings Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-accent-blue/15 pointer-events-none">
            <div className="absolute inset-16 rounded-full border border-accent-blue/10 border-dashed" />
            <div className="absolute inset-32 rounded-full border border-accent-blue/10" />
            <div className="absolute inset-48 rounded-full border border-accent-blue/10 border-dashed" />
            {/* Radar sweep indicator */}
            <div className="absolute inset-0 rounded-full border border-accent-cyan/20 animate-radar-sweep [mask-image:conic-gradient(from_0deg,transparent_0_300deg,black_360deg)]" />
          </div>

          {/* Grid pattern mask */}
          <div className="absolute inset-0 bg-[radial-gradient(#1F3864_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          {/* Subtle gradient vignette to blend edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Top Pill / Identification */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel border border-glass shadow-glass">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-slate-300">
              SMART INDIA HACKATHON 2026 · PS 26084 · TEAM CODEX_2026
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
              See the storm <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-accent-orange via-amber-400 to-accent-cyan bg-clip-text text-transparent">
                before it arrives.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
              VAJRA fuses Doppler radar, INSAT satellite infrared and lightning networks to forecast 
              each convective hazard — with <strong className="text-white">honest confidence</strong> and <strong className="text-white">arrival windows</strong> 0–6 hours ahead.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('console')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-heading font-bold text-base shadow-glow hover:shadow-[0_0_30px_rgba(242,140,40,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Open Nowcast Console</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('method');
              }}
              className="flex items-center gap-2 px-7 py-4 rounded-xl bg-panel hover:bg-panel-hover border border-glass text-slate-200 font-heading font-medium text-base transition backdrop-blur-md"
            >
              <Compass className="w-5 h-5 text-accent-cyan" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Real-time Telemetry Micro-strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400 border-t border-glass/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>DWR Refresh: <strong>5 min</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span>INSAT Rapid Scan: <strong>4.5 min</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hazard-lightning" />
              <span>Lightning Precision: <strong>&lt; 500 m</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-orange" />
              <span>Horizon: <strong>0 – 6 Hours</strong></span>
            </div>
          </div>

        </div>

      </section>

      {/* 2. THE GAP: RADAR EXTRAPOLATION VS NWP */}
      <section id="the-gap-section" className="py-20 px-4 max-w-6xl mx-auto w-full space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-cyan text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>THE 0–6 HOUR NOWCAST GAP</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Pure radar extrapolation collapses after 2 hours. <br />
            <span className="text-accent-orange">VAJRA blends both to 6 hours.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Lagrangian radar persistence has exceptional skill in the immediate 0–60 minutes, but rapidly degrades as storm cells initiate, merge, and collapse. Traditional NWP cannot resolve exact sub-kilometer storm cell coordinates at T+15m. VAJRA mathematically transitions weights between both regimes.
          </p>
        </div>

        {/* Animated Recharts Skill Comparison */}
        <GlassPanel className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-glass pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Forecast Skill vs Lead Time (0–6 Hours)</h3>
              <p className="text-xs text-slate-400 font-mono">Critical Success Index (CSI) across Indian convective episodes</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-accent-orange font-semibold">
                <span className="w-3 h-3 rounded-full bg-accent-orange" />
                VAJRA Blended Nowcast
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                Radar Extrapolation (PySTEPS)
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                NCUM Convection-Permitting NWP
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gapChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="vajraGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F28C28" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F28C28" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="radarGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB7185" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FB7185" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="nwpGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0E1626', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vajra" stroke="#F28C28" strokeWidth={3} fillOpacity={1} fill="url(#vajraGlow)" name="VAJRA Blended Model" />
                <Area type="monotone" dataKey="radar" stroke="#FB7185" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#radarGlow)" name="Pure Radar Extrapolation" />
                <Area type="monotone" dataKey="nwp" stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#nwpGlow)" name="Raw Convective NWP" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-panel border border-glass space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                0 – 90 Minutes (Radar Dominant)
              </span>
              <p className="text-slate-400">
                Lagrangian persistence weighted at 85–95%. Individual storm cores, shear divergence, and hail spikes tracked at 1 km precision.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-panel border border-glass space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                90 – 180 Minutes (Dynamic Blend)
              </span>
              <p className="text-slate-400">
                Crossover regime. Radar uncertainty ellipses expand while NCUM convective precipitation fields ramp up to replace dissipated echoes.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-panel border border-glass space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                180 – 360 Minutes (NWP Dominant)
              </span>
              <p className="text-slate-400">
                Area-probabilistic shading. Preserves actionable regional warning capability for district disaster managers without pseudo-precision.
              </p>
            </div>
          </div>
        </GlassPanel>

      </section>

      {/* 3. THREE-TO-FIVE SENSOR FUSION GRID */}
      <section id="how-it-works-section" className="py-20 px-4 bg-[#0A101E]/60 border-y border-glass">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>TRI-SENSOR INGESTION MATRIX</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              Three data streams animate into one fusion grid. <br />
              <span className="text-accent-cyan">Split into five distinct convective hazard outputs.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No single sensor sees everything. Doppler radar sees inside clouds but has beam cone-of-silence. Satellite sees top cooling early. Lightning sensors detect rapid ionization jumps.
            </p>
          </div>

          {/* Interactive Fusion Flow Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            
            {/* Left: 3 Input Data Sources (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-xl bg-panel border border-accent-blue/30 hover:border-accent-blue transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-bold text-white">
                    <Radio className="w-4 h-4 text-accent-cyan" />
                    <span>1. Doppler Weather Radars (DWR)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/20 text-accent-cyan">5-min Scan</span>
                </div>
                <p className="text-xs text-slate-300">
                  Dual-pol S/C/X band arrays delivering reflectivity (Z), radial velocity (V_r), and specific differential phase (K_DP).
                </p>
                <div className="text-[11px] font-mono text-emerald-400">Detects: Hail core, downdraft shear, rainfall intensity</div>
              </div>

              <div className="p-4 rounded-xl bg-panel border border-hazard-downburst/30 hover:border-hazard-downburst transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-bold text-white">
                    <Satellite className="w-4 h-4 text-hazard-downburst" />
                    <span>2. INSAT-3D / 3DS Satellites</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-hazard-downburst/20 text-hazard-downburst">Rapid Scan</span>
                </div>
                <p className="text-xs text-slate-300">
                  Multi-spectral thermal IR (10.8 µm & 12.0 µm) and water vapour absorption channels capturing cloud-top cooling rates ($dT/dt$).
                </p>
                <div className="text-[11px] font-mono text-accent-cyan">Detects: Convective Initiation (CI) 20–35 min pre-radar</div>
              </div>

              <div className="p-4 rounded-xl bg-panel border border-hazard-lightning/30 hover:border-hazard-lightning transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-bold text-white">
                    <Zap className="w-4 h-4 text-hazard-lightning" />
                    <span>3. Lightning Location Network</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-hazard-lightning/20 text-hazard-lightning">&lt; 1-min Feeds</span>
                </div>
                <p className="text-xs text-slate-300">
                  VLF/LF pulse arrival sensors tracking intra-cloud (IC) and cloud-to-ground (CG) lightning stroke rates and total density.
                </p>
                <div className="text-[11px] font-mono text-amber-300">Detects: Non-inductive graupel charging & lightning jumps</div>
              </div>
            </div>

            {/* Center: The VAJRA Fusion Engine (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-panel via-[#131F36] to-panel border-2 border-accent-orange/40 shadow-glow text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-orange/20 border border-accent-orange flex items-center justify-center text-accent-orange animate-pulse">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-xl text-white">VAJRA FUSION GRID</h4>
                <div className="text-[11px] font-mono text-accent-orange">1 km² · 5-Minute Spatiotemporal Mesh</div>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Multi-sensor Bayesian alignment, parallax correction, optical-flow tracking, and thermodynamic rule induction.
              </p>
              <div className="px-3 py-1 rounded bg-black/50 border border-glass text-[10px] font-mono text-emerald-400">
                Lagrangian Advection + NCUM Blend
              </div>
            </div>

            {/* Right: 5 Specialized Hazard Outputs (4 cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              
              <div className="p-3 rounded-lg bg-panel border-l-4 border-hazard-lightning border-glass flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-hazard-lightning shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Cloud-to-Ground Lightning</div>
                    <div className="text-[10px] text-slate-400">Stroke density & 15-min strike window</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-hazard-lightning/15 text-hazard-lightning">0–60m High</span>
              </div>

              <div className="p-3 rounded-lg bg-panel border-l-4 border-hazard-hail border-glass flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-hazard-hail shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Severe Hail (≥2.5 cm)</div>
                    <div className="text-[10px] text-slate-400">VIL + POSH probability & diameter</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300">0–45m High</span>
              </div>

              <div className="p-3 rounded-lg bg-panel border-l-4 border-hazard-downburst border-glass flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-hazard-downburst shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Microburst & Downburst</div>
                    <div className="text-[10px] text-slate-400">Reflectivity collapse & velocity shear &gt;70 km/h</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-400/15 text-purple-300">0–45m High</span>
              </div>

              <div className="p-3 rounded-lg bg-panel border-l-4 border-hazard-cloudburst border-glass flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CloudRain className="w-4 h-4 text-hazard-cloudburst shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Himalayan Cloudburst</div>
                    <div className="text-[10px] text-slate-400">Precipitation rate ≥ 100 mm/h over terrain catchments</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-400/15 text-blue-300">0–120m Med</span>
              </div>

              <div className="p-3 rounded-lg bg-panel border-l-4 border-hazard-severe border-glass flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-hazard-severe shrink-0" />
                  <div>
                    <div className="font-bold text-white text-xs">Severe Squall & Thunderstorm</div>
                    <div className="text-[10px] text-slate-400">Organized mesoscale multicell & supercell tracks</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300">0–180m Med</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. HONEST LEAD TIMES: HAZARD X LEAD-TIME MATRIX */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>METEOROLOGICAL INTEGRITY</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Honest Lead Times. <br />
            <span className="text-slate-400">No inflated predictability claims.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Atmospheric convective instability has strict physical limits. VAJRA transparently labels forecast confidence by lead time and hazard physics, so operational forecasters make defensible decisions.
          </p>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-glass bg-panel">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-glass bg-panel-card text-slate-300 font-mono">
                <th className="p-4 font-bold text-sm">Convective Hazard</th>
                <th className="p-4">
                  <div className="text-emerald-400 font-bold text-sm">0 – 1 Hour</div>
                  <div className="text-[10px] text-slate-400">DWR Lagrangian Persistence</div>
                </th>
                <th className="p-4">
                  <div className="text-amber-400 font-bold text-sm">1 – 2 Hours</div>
                  <div className="text-[10px] text-slate-400">Optical Flow + Satellite Advection</div>
                </th>
                <th className="p-4">
                  <div className="text-sky-400 font-bold text-sm">2 – 6 Hours</div>
                  <div className="text-[10px] text-slate-400">NCUM-Convective NWP Ensemble</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass font-mono">
              
              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-hazard-lightning" />
                    <span>Lightning (Cloud-to-Ground)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">Cell charge kinematics & rate jump</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ● HIGH CONFIDENCE (85–95%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Exact town arrival ± 8 min</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ▲ MEDIUM CONFIDENCE (60–75%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Corridor trajectory ± 20 km</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                    ■ GUIDANCE ONLY (35–50%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Sub-division convective risk</div>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-hazard-hail" />
                    <span>Hail (≥2.5 cm Severe Diameter)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">VIL, POSH & dual-pol Z_DR hole</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ● HIGH CONFIDENCE (80–90%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Hail swath swath-width ~15 km</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ▲ MEDIUM CONFIDENCE (50–65%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Freezing level CAPE condition</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-medium border border-slate-700">
                    ✕ LOW / NOT RECOMMENDED
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Individual hail cores unpredictable &gt;2h</div>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Wind className="w-4 h-4 text-hazard-downburst" />
                    <span>Downburst / Microburst (&gt;70 km/h)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">Radial velocity shear $\Delta V_r$ & core collapse</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ● HIGH CONFIDENCE (80–88%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">0–35 min warning window</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-medium border border-slate-700">
                    ✕ LOW CONFIDENCE (25–35%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Core lifetime ~ 20–40 min</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                    ■ GUIDANCE ONLY (DCAPE &gt; 900)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Environmental downdraft potential</div>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-hazard-cloudburst" />
                    <span>Himalayan Cloudburst (≥100 mm/h)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">Terrain-locked orographic convergence</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ● HIGH CONFIDENCE (88–96%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Catchment-specific flash flood alarm</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ▲ MEDIUM CONFIDENCE (70–82%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">Orographic moisture flux lock</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                    ■ GUIDANCE ONLY (50–65%)
                  </span>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">High-resolution synoptic convergence</div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </section>

      {/* 5. ARCHITECTURE FLOW WITH LABELED ARROWS */}
      <section className="py-20 px-4 bg-[#0A101E]/40 border-t border-glass">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>END-TO-END SYSTEM PIPELINE</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              From Raw Ingestion to CAP Emergency Alerts
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Fully automated 5-minute ingest cycle with automated quality control, coordinate projection, diagnostic tree evaluation, and CAP v1.2 dissemination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            
            {/* Step 1 */}
            <GlassPanel className="p-4 space-y-2 relative group hover:border-accent-orange/40 transition">
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 text-accent-cyan flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h4 className="font-heading font-bold text-sm text-white">Raw Ingestion</h4>
              <p className="text-xs text-slate-400 leading-normal">
                Dual-pol DWR polar sweeps, INSAT-3DS rapid scan TIR, and LLN arrival timestamps.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-glass">
                Latency: &lt; 45s
              </div>
            </GlassPanel>

            {/* Step 2 */}
            <GlassPanel className="p-4 space-y-2 relative group hover:border-accent-orange/40 transition">
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 text-accent-cyan flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h4 className="font-heading font-bold text-sm text-white">QC & Parallax</h4>
              <p className="text-xs text-slate-400 leading-normal">
                Ground clutter suppression, beam blockage filling, and geometric satellite parallax shift.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-glass">
                WGS84 Grid Alignment
              </div>
            </GlassPanel>

            {/* Step 3 */}
            <GlassPanel className="p-4 space-y-2 relative group hover:border-accent-orange/40 transition">
              <div className="w-8 h-8 rounded-lg bg-accent-orange/20 text-accent-orange flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h4 className="font-heading font-bold text-sm text-white">Lagrangian Optical Flow</h4>
              <p className="text-xs text-slate-400 leading-normal">
                Farnebäck advection vectors calculate instantaneous storm velocity and dispersion ellipses.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-glass">
                Vector Precision: ± 2 km/h
              </div>
            </GlassPanel>

            {/* Step 4 */}
            <GlassPanel className="p-4 space-y-2 relative group hover:border-accent-orange/40 transition">
              <div className="w-8 h-8 rounded-lg bg-accent-orange/20 text-accent-orange flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h4 className="font-heading font-bold text-sm text-white">NWP Blending & Rules</h4>
              <p className="text-xs text-slate-400 leading-normal">
                Exponential weight decay merges advection into 1.5 km NCUM convection ensemble fields.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-glass">
                Relaxation τ = 105 min
              </div>
            </GlassPanel>

            {/* Step 5 */}
            <GlassPanel className="p-4 space-y-2 relative group hover:border-emerald-500/40 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                05
              </div>
              <h4 className="font-heading font-bold text-sm text-white">CAP Dissemination</h4>
              <p className="text-xs text-slate-400 leading-normal">
                Generates OASIS CAP v1.2 XML/JSON for NDMA Sachet, Railways, and AAI ATC integration.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-glass">
                Direct IMD Approval Hook
              </div>
            </GlassPanel>

          </div>

          {/* Quick Console Launch Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-panel via-[#15233E] to-panel border border-accent-orange/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-xl text-white">Ready to examine the real-time simulation?</h3>
              <p className="text-xs text-slate-300">
                Explore active storm cells across Kolkata, Uttarakhand, Delhi, Mumbai, and Bengaluru nowcast domains.
              </p>
            </div>
            <button
              onClick={() => onNavigate('console')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-heading font-bold text-sm shadow-glow transition shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Nowcast Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
