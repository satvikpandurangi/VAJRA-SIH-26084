import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Radio, 
  Satellite, 
  Activity, 
  MapPin, 
  ChevronDown, 
  Clock, 
  BookOpen, 
  LayoutDashboard, 
  Home,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { RegionId, RegionInfo } from '../data/types';
import { stormDataService } from '../data/stormDataService';

interface HeaderProps {
  currentView: 'landing' | 'console' | 'method';
  onNavigate: (view: 'landing' | 'console' | 'method') => void;
  selectedRegion: RegionId;
  onSelectRegion: (regionId: RegionId) => void;
  onOpenReportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  selectedRegion,
  onSelectRegion,
  onOpenReportModal
}) => {
  const [regions] = useState<RegionInfo[]>(stormDataService.getRegions());
  const [status] = useState(stormDataService.getDataSourceStatus());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusPopover, setStatusPopover] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  // Live countdown to next 5-minute radar volume scan cycle
  const [secondsRemaining, setSecondsRemaining] = useState(192); // 3:12 initial

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) return 300; // Reset to 5 min
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentRegionInfo = regions.find(r => r.id === selectedRegion) || regions[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B14]/95 backdrop-blur-xl border-b border-glass select-none shrink-0">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange rounded-lg p-0.5 text-left"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-accent-orange to-amber-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform shrink-0">
              <Zap className="w-4 h-4 text-white fill-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-white">
                  VAJRA
                </span>
                <span className="text-xs font-heading font-medium text-accent-orange/90 tracking-normal">
                  (वज्र)
                </span>
                <span className="hidden xl:inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded bg-accent-blue/20 text-accent-cyan border border-accent-blue/30">
                  PS 26084
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-tight hidden lg:flex items-center gap-1.5">
                <span>IMD & NCMRWF CONVECTIVE NOWCAST</span>
              </div>
            </div>
          </button>

          {/* Mandatory Demo Data Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-mono font-medium shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>DEMO DATA — illustrative</span>
          </div>
        </div>

        {/* Center: Ingestion Status & Live Cycle Countdown */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          
          {/* Radar Cycle Countdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-lg bg-panel border border-glass text-xs font-mono shrink-0">
            <Clock className="w-3.5 h-3.5 text-accent-orange shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden xl:inline">Analysis 14:05 IST ·</span>
              <span className="text-slate-300 hidden sm:inline">next in</span>
              <span className="text-accent-orange font-bold font-mono">{formatCountdown(secondsRemaining)}</span>
            </div>
          </div>

          {/* Compact 4-Feeds indicator on xl */}
          <div className="hidden xl:flex 2xl:hidden items-center gap-1 text-[11px] font-mono text-emerald-400 bg-panel/80 px-2 py-1 rounded-lg border border-glass">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>4 Sensors Active</span>
          </div>

          {/* Data Sources Status Chips with Popovers (on 2xl displays) */}
          <div className="hidden 2xl:flex items-center gap-1.5 text-xs font-mono">
            
            {/* Radar Chip */}
            <div className="relative">
              <button 
                onMouseEnter={() => setStatusPopover('radar')}
                onMouseLeave={() => setStatusPopover(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-panel/80 hover:bg-panel border border-glass text-slate-300 transition"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Radar</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </button>
              {statusPopover === 'radar' && (
                <div className="absolute top-full left-0 mt-1 w-64 p-3 rounded-lg glass-dropdown text-[11px] space-y-1 z-50">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Doppler Radar Network</span>
                    <span className="text-emerald-400 text-[10px]">OPERATIONAL</span>
                  </div>
                  <div className="text-slate-300">Station: {status.radar.stationName}</div>
                  <div className="text-slate-400">Scan: 5-min Volume Polarimetric</div>
                  <div className="text-slate-400">Band: {status.radar.frequency}</div>
                  <div className="text-accent-orange pt-1 border-t border-glass">Latency: {status.radar.latencySec}s</div>
                </div>
              )}
            </div>

            {/* INSAT Chip */}
            <div className="relative">
              <button 
                onMouseEnter={() => setStatusPopover('insat')}
                onMouseLeave={() => setStatusPopover(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-panel/80 hover:bg-panel border border-glass text-slate-300 transition"
              >
                <Satellite className="w-3.5 h-3.5 text-emerald-400" />
                <span>INSAT-3DS</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </button>
              {statusPopover === 'insat' && (
                <div className="absolute top-full left-0 mt-1 w-64 p-3 rounded-lg glass-dropdown text-[11px] space-y-1 z-50">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>INSAT Geostationary</span>
                    <span className="text-emerald-400 text-[10px]">TIR RAPID SCAN</span>
                  </div>
                  <div className="text-slate-300">{status.insat.channel}</div>
                  <div className="text-slate-400">Resolution: {status.insat.resolution}</div>
                  <div className="text-accent-orange pt-1 border-t border-glass">Updated: {status.insat.lastUpdate}</div>
                </div>
              )}
            </div>

            {/* Lightning Chip */}
            <div className="relative">
              <button 
                onMouseEnter={() => setStatusPopover('lightning')}
                onMouseLeave={() => setStatusPopover(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-panel/80 hover:bg-panel border border-glass text-slate-300 transition"
              >
                <Zap className="w-3.5 h-3.5 text-hazard-lightning" />
                <span>Lightning</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </button>
              {statusPopover === 'lightning' && (
                <div className="absolute top-full left-0 mt-1 w-64 p-3 rounded-lg glass-dropdown text-[11px] space-y-1 z-50">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Lightning Location Net</span>
                    <span className="text-emerald-400 text-[10px]">ACTIVE</span>
                  </div>
                  <div className="text-slate-300">Sensors Active: {status.lightning.activeSensors}</div>
                  <div className="text-slate-400">Rate: {status.lightning.rateLast10Min} strokes / 10m</div>
                  <div className="text-accent-orange pt-1 border-t border-glass">Updated: {status.lightning.lastUpdate}</div>
                </div>
              )}
            </div>

            {/* NWP Chip */}
            <div className="relative">
              <button 
                onMouseEnter={() => setStatusPopover('nwp')}
                onMouseLeave={() => setStatusPopover(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-panel/80 hover:bg-panel border border-glass text-slate-300 transition"
              >
                <Activity className="w-3.5 h-3.5 text-accent-blue" />
                <span>NWP Model</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </button>
              {statusPopover === 'nwp' && (
                <div className="absolute top-full left-0 mt-1 w-64 p-3 rounded-lg glass-dropdown text-[11px] space-y-1 z-50">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>NCMRWF Convection-Permitting</span>
                    <span className="text-accent-cyan text-[10px]">1.5 km RES</span>
                  </div>
                  <div className="text-slate-300">{status.nwp.model}</div>
                  <div className="text-slate-400">Cycle: {status.nwp.cycle}</div>
                  <div className="text-accent-orange pt-1 border-t border-glass">Blending Horizon: 2 to 6 hours</div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right: Region Selector & Page Nav */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Region Selector Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-panel hover:bg-panel-hover border border-glass text-xs font-mono text-white transition focus:outline-none focus:ring-1 focus:ring-accent-orange shrink-0"
              aria-label="Select Forecast Region"
            >
              <MapPin className="w-3.5 h-3.5 text-accent-orange shrink-0" />
              <div className="text-left">
                <span className="font-semibold block truncate max-w-[90px] sm:max-w-[140px]">
                  {currentRegionInfo.name.split(' (')[0]}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 max-w-[calc(100vw-24px)] p-1.5 rounded-xl glass-dropdown z-50 animate-fadeIn shadow-2xl border border-glass">
                <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-glass">
                  Select Radar Coverage Domain
                </div>
                <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
                  {regions.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSelectRegion(r.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                        selectedRegion === r.id
                          ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white">{r.name}</div>
                        <div className="text-[10px] text-slate-400">{r.hindiName}</div>
                      </div>
                      {r.orographicWarning && (
                        <span className="px-1.5 py-0.5 text-[9px] rounded bg-hazard-cloudburst/20 text-hazard-cloudburst border border-hazard-cloudburst/30">
                          Cloudburst
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-1 bg-panel/90 p-1 rounded-lg border border-glass shrink-0">
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-heading font-medium transition ${
                currentView === 'landing'
                  ? 'bg-accent-orange text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => onNavigate('console')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-heading font-medium transition ${
                currentView === 'console'
                  ? 'bg-accent-orange text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
            <button
              onClick={() => onNavigate('method')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-heading font-medium transition ${
                currentView === 'method'
                  ? 'bg-accent-orange text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Method</span>
            </button>
          </nav>

        </div>

      </div>
    </header>
  );
};
