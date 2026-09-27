import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  Terminal
} from 'lucide-react';
import { StormCell, RegionInfo } from '../data/types';
import { stormDataService } from '../data/stormDataService';

interface CapAlertTabProps {
  selectedCell: StormCell;
  region: RegionInfo;
}

export const CapAlertTab: React.FC<CapAlertTabProps> = ({ selectedCell, region }) => {
  const [format, setFormat] = useState<'xml' | 'json'>('xml');
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'transmitting' | 'approved'>('idle');

  const { alert, xml, json } = stormDataService.generateCAPAlert(selectedCell, region);

  const handleCopy = () => {
    const textToCopy = format === 'xml' ? xml : json;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDispatch = () => {
    setDispatchStatus('transmitting');
    setTimeout(() => {
      setDispatchStatus('approved');
    }, 1200);
  };

  return (
    <div className="space-y-4 p-4 text-slate-200">
      
      {/* Mandatory IMD Alert Guidance Badge */}
      <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Guidance for IMD forecasters — not a public warning</span>
        </div>
        <p className="text-[11px] text-rose-300/80 leading-relaxed font-sans">
          This Common Alerting Protocol (CAP v1.2) draft is generated autonomously for duty meteorologists. Requires forecaster sign-off before dissemination to NDMA / public feeds.
        </p>
      </div>

      {/* Alert Metadata Card */}
      <div className="p-3.5 rounded-xl bg-panel border border-glass space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-glass pb-2">
          <div className="text-white font-bold">{alert.identifier}</div>
          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
            {alert.info.severity.toUpperCase()}
          </span>
        </div>

        <div className="space-y-1 font-sans">
          <div className="text-xs text-slate-400 font-mono">HEADLINE:</div>
          <div className="text-sm font-heading font-bold text-white leading-snug">
            {alert.info.headline}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded bg-black/40 border border-glass">
            <div className="text-slate-500 text-[10px]">Urgency</div>
            <div className="font-bold text-white">{alert.info.urgency}</div>
          </div>
          <div className="p-2 rounded bg-black/40 border border-glass">
            <div className="text-slate-500 text-[10px]">Certainty</div>
            <div className="font-bold text-white">{alert.info.certainty}</div>
          </div>
          <div className="p-2 rounded bg-black/40 border border-glass">
            <div className="text-slate-500 text-[10px]">Scope</div>
            <div className="font-bold text-white">{alert.scope}</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 font-sans p-2 rounded bg-black/30 border border-glass">
          <strong>Instruction:</strong> {alert.info.instruction}
        </div>
      </div>

      {/* Code Viewer: Format Switcher & Action Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-glass">
            <button
              onClick={() => setFormat('xml')}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                format === 'xml' ? 'bg-accent-orange text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CAP v1.2 (XML)
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                format === 'json' ? 'bg-accent-orange text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CAP (JSON)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-panel hover:bg-panel-hover border border-glass text-xs font-mono text-slate-300 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Copy Payload</span>
              </>
            )}
          </button>
        </div>

        {/* Payload Preview */}
        <pre className="p-3 rounded-xl bg-black/80 border border-glass font-mono text-[10px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed scrollbar-thin">
          <code>{format === 'xml' ? xml : json}</code>
        </pre>
      </div>

      {/* Action Workflow: Send to IMD for Approval */}
      <div className="p-3.5 rounded-xl bg-panel border border-glass space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-accent-orange" />
            <span>Operational Dissemination Hook</span>
          </span>
          <span className="text-slate-500 text-[10px]">Target: NWFC New Delhi / Sachet</span>
        </div>

        {dispatchStatus === 'idle' && (
          <button
            onClick={handleSimulateDispatch}
            className="w-full py-2.5 px-4 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-heading font-bold text-xs shadow-glow transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to IMD Forecaster Desk for Approval</span>
          </button>
        )}

        {dispatchStatus === 'transmitting' && (
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs text-center border border-glass flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
            <span>Transmitting to IMD Central Messaging Gateway...</span>
          </div>
        )}

        {dispatchStatus === 'approved' && (
          <div className="w-full p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs font-mono space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transmitted to IMD Duty Forecaster Console</span>
            </div>
            <p className="text-[10px] text-emerald-300/80 font-sans">
              Alert token <code className="text-white font-mono">{alert.identifier.slice(-12)}</code> queued for forecaster one-click broadcast to NDMA Sachet and Indian Railways.
            </p>
            <button
              onClick={() => setDispatchStatus('idle')}
              className="text-[10px] text-accent-cyan underline hover:text-white pt-1"
            >
              Reset simulated workflow
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
