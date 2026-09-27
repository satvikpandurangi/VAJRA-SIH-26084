import React from 'react';
import { Zap, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'console' | 'method') => void;
  onOpenReport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenReport }) => {
  return (
    <footer className="w-full bg-[#05080F] border-t border-glass text-slate-400 text-xs py-8 select-none">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 space-y-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-glass/60">
          
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-accent-orange">
                <Zap className="w-3.5 h-3.5 fill-accent-orange" />
              </div>
              <span className="font-heading font-bold text-white tracking-wider text-base">VAJRA</span>
              <span className="text-slate-400 font-mono">(वज्र)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel border border-glass text-accent-cyan">
                v2.6 Operational Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time multi-sensor convective storm nowcasting platform fusing Doppler Weather Radar, INSAT-3DS infrared, and ground lightning detection networks for India's forecasters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => onNavigate('console')}
              className="text-slate-300 hover:text-accent-orange transition"
            >
              Nowcast Console
            </button>
            <button
              onClick={() => onNavigate('method')}
              className="text-slate-300 hover:text-accent-orange transition"
            >
              Methodology & Diagnostics
            </button>
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 text-accent-cyan hover:text-white transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Technical Whitepaper</span>
            </button>
            <a
              href="https://github.com/placeholder-vajra-codex2026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub (CodeX_2026)</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white font-medium">Team CodeX_2026 · PS 26084 · Candidate ID: 159951</span>
            <span className="hidden sm:inline">|</span>
            <span>Smart India Hackathon 2026</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-amber-400/90 font-medium">Guidance for IMD forecasters — not a public warning</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compliant with IMD Convective SOPs & WMO Guidelines</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
