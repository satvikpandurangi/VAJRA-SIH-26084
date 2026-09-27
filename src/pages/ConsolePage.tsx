import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Layers, 
  ShieldAlert, 
  CloudRain, 
  Award, 
  FileCode, 
  MapPin, 
  Sliders, 
  AlertTriangle,
  Zap,
  Sparkles,
  Wind
} from 'lucide-react';
import { RegionId, StormCell, HazardType } from '../data/types';
import { stormDataService } from '../data/stormDataService';
import { ActiveStormsList } from '../components/ActiveStormsList';
import { ConsoleMap } from '../components/ConsoleMap';
import { ArrivalWindowsTab } from '../components/ArrivalWindowsTab';
import { HazardsTab } from '../components/HazardsTab';
import { CloudburstTab } from '../components/CloudburstTab';
import { SkillTab } from '../components/SkillTab';
import { CapAlertTab } from '../components/CapAlertTab';

interface ConsolePageProps {
  selectedRegion: RegionId;
  onSelectRegion: (id: RegionId) => void;
}

export const ConsolePage: React.FC<ConsolePageProps> = ({
  selectedRegion,
  onSelectRegion
}) => {
  const region = stormDataService.getRegion(selectedRegion);
  const cells = useMemo(() => stormDataService.getCells(selectedRegion), [selectedRegion]);
  const arrivalWindows = useMemo(() => stormDataService.getArrivalWindows(selectedRegion), [selectedRegion]);

  const [selectedCellId, setSelectedCellId] = useState<string>(cells[0]?.id || 'CELL-V01');
  const [leadTimeMin, setLeadTimeMin] = useState<number>(0);
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('severe_thunderstorm');
  
  // Right panel active tab
  const [activeRightTab, setActiveRightTab] = useState<'windows' | 'hazards' | 'cloudburst' | 'skill' | 'cap'>('windows');

  // Mobile layout tab switcher (left panel vs map vs right panel)
  const [mobileView, setMobileView] = useState<'map' | 'storms' | 'details'>('map');

  const selectedCell = useMemo(() => {
    return cells.find(c => c.id === selectedCellId) || cells[0];
  }, [cells, selectedCellId]);

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col bg-background text-slate-100 overflow-hidden select-none">
      
      {/* Secondary Sub-Bar / Station Context Bar */}
      <div className="w-full bg-[#080E1A] border-b border-glass px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {region.dwrStation}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">Domain: {region.synopticContext}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Guidance for IMD forecasters — not a public warning</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Workstation Grid (Responsive Mobile Tabs) */}
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: ACTIVE STORMS LIST (Hidden on small screens unless 'storms' active) */}
        <div className={`w-full lg:w-80 lg:shrink-0 h-full overflow-hidden ${
          mobileView === 'storms' ? 'flex' : 'hidden lg:flex'
        }`}>
          <ActiveStormsList
            cells={cells}
            selectedCellId={selectedCellId}
            onSelectCell={setSelectedCellId}
            onFlyToCell={() => {
              // Switch to map view on mobile if clicked
              setMobileView('map');
            }}
          />
        </div>

        {/* CENTER PANEL: INTERACTIVE MAP & SCRUBBER */}
        <div className={`flex-1 min-w-0 self-stretch min-h-0 relative flex flex-col overflow-hidden ${
          mobileView === 'map' ? 'flex' : 'hidden lg:flex'
        }`}>
          <ConsoleMap
            region={region}
            cells={cells}
            selectedCellId={selectedCellId}
            onSelectCell={setSelectedCellId}
            leadTimeMin={leadTimeMin}
            onLeadTimeChange={setLeadTimeMin}
            selectedHazard={selectedHazard}
          />
        </div>

        {/* RIGHT PANEL: ANALYSIS TABS (Hidden on small screens unless 'details' active) */}
        <div className={`w-full lg:w-96 lg:shrink-0 h-full flex flex-col bg-[#090F1C]/90 backdrop-blur-md border-l border-glass overflow-hidden ${
          mobileView === 'details' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Tab Navigation Header */}
          <div className="flex items-center justify-between border-b border-glass p-1.5 bg-black/40 text-xs font-mono shrink-0">
            <button
              onClick={() => setActiveRightTab('windows')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                activeRightTab === 'windows'
                  ? 'bg-accent-orange text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Windows</span>
            </button>

            <button
              onClick={() => setActiveRightTab('hazards')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                activeRightTab === 'hazards'
                  ? 'bg-accent-orange text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Hazards</span>
            </button>

            <button
              onClick={() => setActiveRightTab('cloudburst')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                activeRightTab === 'cloudburst'
                  ? 'bg-accent-orange text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Burst</span>
            </button>

            <button
              onClick={() => setActiveRightTab('skill')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                activeRightTab === 'skill'
                  ? 'bg-accent-orange text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Skill</span>
            </button>

            <button
              onClick={() => setActiveRightTab('cap')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                activeRightTab === 'cap'
                  ? 'bg-accent-orange text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>CAP</span>
            </button>
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 overflow-y-auto">
            {activeRightTab === 'windows' && (
              <ArrivalWindowsTab windows={arrivalWindows} />
            )}
            {activeRightTab === 'hazards' && (
              <HazardsTab selectedCell={selectedCell} />
            )}
            {activeRightTab === 'cloudburst' && (
              <CloudburstTab selectedCell={selectedCell} region={region} cells={cells} />
            )}
            {activeRightTab === 'skill' && (
              <SkillTab />
            )}
            {activeRightTab === 'cap' && (
              <CapAlertTab selectedCell={selectedCell} region={region} />
            )}
          </div>

        </div>

      </div>

      {/* Mobile Bottom View Switcher (Visible only on < lg screens) */}
      <div className="lg:hidden flex items-center justify-around bg-[#080E1A] border-t border-glass p-2 shrink-0 text-xs font-mono">
        <button
          onClick={() => setMobileView('storms')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileView === 'storms' ? 'bg-accent-orange text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Storms ({cells.length})</span>
        </button>

        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileView === 'map' ? 'bg-accent-orange text-white font-bold' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Radar Map</span>
        </button>

        <button
          onClick={() => setMobileView('details')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileView === 'details' ? 'bg-accent-orange text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Diagnostics</span>
        </button>
      </div>

    </div>
  );
};
