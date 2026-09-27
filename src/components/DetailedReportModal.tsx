import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert, Cpu, Activity, Download } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface DetailedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0A101D] border border-glass-bright rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass bg-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-orange/15 border border-accent-orange/30 text-accent-orange">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-white">VAJRA Technical Architecture & Feasibility Report</h2>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                  SIH 2026 · PS 26084
                </span>
              </div>
              <p className="text-xs text-slate-400">Team CodeX_2026 · Candidate ID: 159951 · IMD & NCMRWF Convective Nowcasting System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-slate-300">
          
          {/* Executive Summary */}
          <GlassPanel className="p-4 border-accent-orange/20 bg-accent-orange/5 space-y-2">
            <h3 className="font-heading font-bold text-white flex items-center gap-2 text-base">
              <Activity className="w-4 h-4 text-accent-orange" />
              1. Executive Summary & Operational Problem Statement
            </h3>
            <p>
              In India, convective weather hazards account for more than 2,500 annual fatalities primarily due to 
              <strong className="text-hazard-lightning"> cloud-to-ground lightning strikes</strong>, catastrophic agricultural damage from 
              <strong className="text-hazard-hail"> severe hail</strong>, aviation hazards from 
              <strong className="text-hazard-downburst"> microburst downbursts</strong>, and flash flooding from localized 
              <strong className="text-hazard-cloudburst"> Himalayan cloudbursts</strong>. Current operational workflows suffer from a critical forecast skill gap: pure radar extrapolation fails past 90–120 minutes due to storm cell initiation and decay, while traditional Numerical Weather Prediction (NWP) lacks convective-scale phase and coordinate precision in the first 0–2 hours.
            </p>
            <p>
              <strong>VAJRA (वज्र)</strong> resolves this via a multi-sensor Bayesian fusion pipeline that ingests IMD S/C/X-band Dual-Polarization Doppler Weather Radars, INSAT-3D/3DS multi-spectral thermal imagery, and the national ground Lightning Location Network into an advection-diffusion-NWP blended nowcasting engine spanning <strong>0 to 6 hours ahead</strong>.
            </p>
          </GlassPanel>

          {/* Tri-Sensor Ingestion Matrix */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white flex items-center gap-2 text-base">
              <Cpu className="w-4 h-4 text-accent-cyan" />
              2. Sensor Ingestion & Parallax-Corrected Spatial Alignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-panel border border-glass space-y-1.5">
                <div className="text-xs font-mono text-accent-orange font-bold">DOPPLER WEATHER RADARS (DWR)</div>
                <div className="text-xs text-slate-400">Coverage: 37+ operational stations (S/C/X Band)</div>
                <p className="text-xs">
                  5-minute volume scans delivering Reflectivity (Z), Differential Reflectivity (Z_DR), Specific Differential Phase (K_DP), and Radial Velocity (V_r). Sub-kilometer spatial resolution within 250 km radius.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-panel border border-glass space-y-1.5">
                <div className="text-xs font-mono text-hazard-downburst font-bold">INSAT-3D / 3DS SATELLITES</div>
                <div className="text-xs text-slate-400">Scan Frequency: 15-min / 4.5-min Rapid Scan</div>
                <p className="text-xs">
                  TIR-1 (10.8 µm), TIR-2 (12.0 µm), and Water Vapour (6.7 µm) channels. Provides cloud-top brightness temperature cooling rates (dT/dt ≤ -4 K / 15 min) to detect Convective Initiation (CI) before radar echoes reach 35 dBZ.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-panel border border-glass space-y-1.5">
                <div className="text-xs font-mono text-hazard-lightning font-bold">LIGHTNING LOCATION NETWORK</div>
                <div className="text-xs text-slate-400">Sensors: IITM / IMD Damini Network (VLF/LF)</div>
                <p className="text-xs">
                  Real-time microsecond-level time-of-arrival detection of intra-cloud (IC) and cloud-to-ground (CG) return strokes. Lightning jumps (≥ 250% surge in 5 min) serve as leading indicators for severe downbursts and hail cores.
                </p>
              </div>
            </div>
          </div>

          {/* Forecast Methodology */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Lagrangian Extrapolation Blended with NCUM Convection-Permitting NWP
            </h3>
            <p>
              VAJRA utilizes Farnebäck and Lucas-Kanade optical flow on radar echo fields to derive the 2D Lagrangian velocity vector (u, v). At lead times t ∈ [0, 6 h], the blended forecast field Φ(x,y,t) is governed by:
            </p>
            <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-center border border-glass text-accent-cyan">
              Φ(x,y,t) = w_radar(t) · Ψ_Lagrangian(x,y,t) + [1 - w_radar(t)] · Ψ_NCUM(x,y,t)
              <br />
              where w_radar(t) = exp( - (t / τ)^1.6 ) with relaxation timescale τ ≈ 105 minutes.
            </div>
            <p className="text-xs text-slate-400">
              Beyond 120 minutes, discrete radar reflectivity cores transition smoothly into probabilistic spatial risk plumes, avoiding false precision while maintaining situational awareness for disaster management authorities.
            </p>
          </div>

          {/* Diagnostic Decision Matrix */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white flex items-center gap-2 text-base">
              <ShieldAlert className="w-4 h-4 text-hazard-severe" />
              4. Hazard Diagnostic Criteria
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-glass">
                <thead>
                  <tr className="bg-panel border-b border-glass font-mono text-slate-400">
                    <th className="p-2.5">Hazard</th>
                    <th className="p-2.5">Primary Physical Metric</th>
                    <th className="p-2.5">Operational Threshold</th>
                    <th className="p-2.5">Lead-Time Horizon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass font-mono">
                  <tr>
                    <td className="p-2.5 text-hazard-hail font-bold">Severe Hail</td>
                    <td className="p-2.5 text-slate-300">VIL + POSH + Z_DR hole aloft</td>
                    <td className="p-2.5 text-slate-300">VIL &gt; 45 kg/m², Z ≥ 60 dBZ above 0°C</td>
                    <td className="p-2.5 text-emerald-400">0 – 60 min (High)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-hazard-downburst font-bold">Downburst / Microburst</td>
                    <td className="p-2.5 text-slate-300">Reflectivity core collapse + $\Delta V_r$ divergence</td>
                    <td className="p-2.5 text-slate-300">$\Delta V_r &gt; 65$ km/h at lowest elevation tilt</td>
                    <td className="p-2.5 text-emerald-400">0 – 45 min (High)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-hazard-cloudburst font-bold">Himalayan Cloudburst</td>
                    <td className="p-2.5 text-slate-300">Rainfall rate over small mountain catchment</td>
                    <td className="p-2.5 text-slate-300">$\ge 100$ mm/h over 20–30 km² terrain box</td>
                    <td className="p-2.5 text-amber-400">0 – 120 min (Medium)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-hazard-lightning font-bold">Lightning Density</td>
                    <td className="p-2.5 text-slate-300">Graupel-ice charging zone -10°C to -20°C</td>
                    <td className="p-2.5 text-slate-300">Echo top &gt; 12 km + rapid stroke jump</td>
                    <td className="p-2.5 text-emerald-400">0 – 90 min (High)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dissemination & CAP Integration */}
          <div className="p-4 rounded-xl bg-panel border border-glass space-y-2">
            <h4 className="font-heading font-bold text-white text-sm">5. Dissemination & Common Alerting Protocol (CAP v1.2)</h4>
            <p className="text-xs text-slate-300">
              VAJRA natively formats every detected storm cell and arrival window into standardized XML/JSON CAP v1.2 feeds. These directly interface with NDMA's Sachet national emergency alerting portal, Indian Railways signalling control rooms, and the Airports Authority of India (AAI) air traffic convective avoidance systems.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-glass bg-panel">
          <div className="text-xs text-slate-500 font-mono">
            VAJRA Convective Nowcast Architecture v2.4 · IMD-NCMRWF Interoperable
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify({
                  project: "VAJRA Convective Storm Nowcasting Console",
                  problemStatement: "PS 26084",
                  team: "CodeX_2026",
                  status: "SIH 2026 Prototype Validated",
                  specifications: "IMD / NCMRWF Convective Guidelines"
                }, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'VAJRA_Technical_Architecture_Report.json';
                a.click();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
            >
              <Download className="w-4 h-4 text-accent-orange" />
              Download Spec JSON
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-accent-orange hover:bg-orange-600 text-white font-heading font-semibold text-xs transition"
            >
              Close Briefing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
