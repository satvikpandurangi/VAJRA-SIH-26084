import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Zap, 
  Radio, 
  Satellite, 
  Sparkles, 
  Wind, 
  CloudRain, 
  MapPin, 
  X, 
  Info,
  Maximize2,
  Volume2
} from 'lucide-react';
import { RegionInfo, StormCell, HazardType, LightningStrike } from '../data/types';
import { computeAdvectedCells, getDbzColor } from '../data/proceduralRadar';
import { stormDataService } from '../data/stormDataService';

interface ConsoleMapProps {
  region: RegionInfo;
  cells: StormCell[];
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
  leadTimeMin: number;
  onLeadTimeChange: (leadTime: number) => void;
  selectedHazard: HazardType;
}

export const ConsoleMap: React.FC<ConsoleMapProps> = ({
  region,
  cells,
  selectedCellId,
  onSelectCell,
  leadTimeMin,
  onLeadTimeChange,
  selectedHazard
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Layer toggle states
  const [layerVisibility, setLayerVisibility] = useState({
    radar: true,
    satellite: true,
    lightning: true,
    tracks: true,
    rangeRing: true,
    hazardProb: true,
    satelliteCiMarker: true
  });

  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  // Probe pin state (placed by clicking anywhere on the map)
  const [probeResult, setProbeResult] = useState<ReturnType<typeof stormDataService.probeCoordinates> | null>(null);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 240 / playbackSpeed;
    const timer = setInterval(() => {
      if (leadTimeMin >= 360) {
        setIsPlaying(false);
      } else {
        onLeadTimeChange(Math.min(360, leadTimeMin + 5));
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, leadTimeMin, onLeadTimeChange]);

  // Compute advected cell states for the current leadTimeMin
  const advectedCells = useMemo(() => {
    return computeAdvectedCells(cells, leadTimeMin);
  }, [cells, leadTimeMin]);

  const lightningStrikes = useMemo(() => {
    return stormDataService.getLightningStrikes(region.id);
  }, [region.id]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use Esri World Dark Gray Canvas (Clean, fast, free, no API key required, no watermarks)
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-dark-base': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, © OpenStreetMap contributors'
          },
          'esri-dark-reference': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: ''
          }
        },
        layers: [
          {
            id: 'esri-dark-base-layer',
            type: 'raster',
            source: 'esri-dark-base',
            minzoom: 0,
            maxzoom: 16
          },
          {
            id: 'esri-dark-reference-layer',
            type: 'raster',
            source: 'esri-dark-reference',
            minzoom: 0,
            maxzoom: 16
          }
        ]
      },
      center: region.center,
      zoom: region.zoom,
      minZoom: 5,
      maxZoom: 14,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('click', (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const probe = stormDataService.probeCoordinates(region.id, lng, lat, leadTimeMin);
      setProbeResult(probe);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [region.id]);

  // Handle fly-to when region center or selected cell changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.easeTo({
      center: region.center,
      zoom: region.zoom,
      duration: 1200
    });
    // Clear probe on region switch
    setProbeResult(null);
  }, [region]);

  // Custom Canvas Overlay rendering radar echoes, ellipses, and coverage rings
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    const map = mapInstanceRef.current;
    if (!canvas || !map) return;

    const renderCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // 1. Radar Coverage Ring & Outside Satellite-Only Hatching
      if (layerVisibility.rangeRing) {
        const centerPoint = map.project(region.center);
        
        // Approximate pixel radius for coverage
        const edgeLngLat: [number, number] = [
          region.center[0] + (region.radarRadiusKm / 105),
          region.center[1]
        ];
        const edgePoint = map.project(edgeLngLat);
        const radiusPx = Math.abs(edgePoint.x - centerPoint.x);

        ctx.save();
        // Outside coverage darker shading & subtle hatching
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.arc(centerPoint.x, centerPoint.y, radiusPx, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgba(7, 11, 20, 0.55)';
        ctx.fill();

        // Boundary Ring Line
        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, radiusPx, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();

        // Coverage Label
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.85)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${region.radarRadiusKm} km DWR Range Ring (${region.dwrStation.split(' (')[0]})`, centerPoint.x - 90, centerPoint.y - radiusPx - 6);
        ctx.restore();
      }

      // 2. Satellite IR Thermal Overlay (if enabled)
      if (layerVisibility.satellite) {
        ctx.save();
        advectedCells.forEach(c => {
          const pt = map.project([c.lng, c.lat]);
          const edgePt = map.project([c.lng + (c.uncertaintyRadiusKm * 2.2 / 105), c.lat]);
          const satRadiusPx = Math.max(25, Math.abs(edgePt.x - pt.x));

          const grad = ctx.createRadialGradient(pt.x, pt.y, satRadiusPx * 0.1, pt.x, pt.y, satRadiusPx);
          grad.addColorStop(0, 'rgba(126, 34, 206, 0.35)');
          grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.18)');
          grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, satRadiusPx, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 3. Radar Reflectivity Gaussian Cores
      if (layerVisibility.radar) {
        ctx.save();
        advectedCells.forEach(c => {
          const pt = map.project([c.lng, c.lat]);
          
          // Core pixel radius scales with map zoom
          const edgePt = map.project([c.lng + (16 / 105), c.lat]);
          const corePx = Math.max(18, Math.abs(edgePt.x - pt.x));

          // Multi-layer concentric reflectivity gradient
          const alphaFade = leadTimeMin > 120 ? Math.max(0.3, 1 - (leadTimeMin - 120) / 240) : 0.85;

          const rings = [
            { factor: 1.5, dbz: c.dbz * 0.4 },
            { factor: 1.1, dbz: c.dbz * 0.65 },
            { factor: 0.7, dbz: c.dbz * 0.85 },
            { factor: 0.35, dbz: c.dbz }
          ];

          rings.forEach(r => {
            const rad = corePx * r.factor;
            const color = getDbzColor(r.dbz, alphaFade);
            const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
            ctx.fill();
          });
        });
        ctx.restore();
      }

      // 4. Storm Tracks & Uncertainty Ellipses
      if (layerVisibility.tracks) {
        ctx.save();
        cells.forEach(baseCell => {
          const f30 = computeAdvectedCells([baseCell], 30)[0];
          const f60 = computeAdvectedCells([baseCell], 60)[0];
          const f120 = computeAdvectedCells([baseCell], 120)[0];

          const p0 = map.project([baseCell.coordinates[0], baseCell.coordinates[1]]);
          const p30 = map.project([f30.lng, f30.lat]);
          const p60 = map.project([f60.lng, f60.lat]);
          const p120 = map.project([f120.lng, f120.lat]);

          // Vector path
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p30.x, p30.y);
          ctx.lineTo(p60.x, p60.y);
          ctx.lineTo(p120.x, p120.y);
          ctx.strokeStyle = 'rgba(242, 140, 40, 0.75)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // +30 min ellipse
          const edge30 = map.project([f30.lng + (f30.uncertaintyRadiusKm / 105), f30.lat]);
          const r30 = Math.abs(edge30.x - p30.x);
          ctx.beginPath();
          ctx.ellipse(p30.x, p30.y, r30 * 1.3, r30 * 0.8, (baseCell.movementVector.bearingDeg * Math.PI) / 180, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
          ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
          ctx.setLineDash([2, 2]);
          ctx.fill();
          ctx.stroke();

          // +60 min ellipse
          const edge60 = map.project([f60.lng + (f60.uncertaintyRadiusKm / 105), f60.lat]);
          const r60 = Math.abs(edge60.x - p60.x);
          ctx.beginPath();
          ctx.ellipse(p60.x, p60.y, r60 * 1.5, r60 * 0.9, (baseCell.movementVector.bearingDeg * Math.PI) / 180, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(242, 140, 40, 0.55)';
          ctx.fillStyle = 'rgba(242, 140, 40, 0.06)';
          ctx.fill();
          ctx.stroke();

          // Ellipse labels
          ctx.setLineDash([]);
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('+30m', p30.x + 8, p30.y - 4);
          ctx.fillText('+60m', p60.x + 8, p60.y - 4);
        });
        ctx.restore();
      }

      // 5. Lightning Strikes Overlay
      if (layerVisibility.lightning) {
        ctx.save();
        lightningStrikes.forEach(s => {
          const pt = map.project(s.coordinates);
          const strikeAlpha = Math.max(0.2, 1 - (s.ageMin / 15));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 212, 0, ${strikeAlpha})`;
          ctx.shadowColor = '#FFD400';
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });
        ctx.restore();
      }

      // 6. Cell Center Dots & Active Selection Ring
      ctx.save();
      advectedCells.forEach(c => {
        const pt = map.project([c.lng, c.lat]);
        const isSelected = c.id === selectedCellId;

        // Satellite Convective Initiation (CI) Beacon Marker
        const baseCell = cells.find(b => b.id === c.id);
        if (baseCell?.isNewSatelliteDetection && layerVisibility.satelliteCiMarker) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217, 70, 239, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#F0ABFC';
          ctx.fillText('SAT CI INCEPTION', pt.x + 12, pt.y - 12);
        }

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = '#F28C28';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Cell Center core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#F28C28' : '#FFFFFF';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fill();

        // ID Label
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#F28C28' : '#FFFFFF';
        ctx.fillText(c.id, pt.x + 8, pt.y + 4);
      });
      ctx.restore();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (canvas && mapContainerRef.current) {
        canvas.width = mapContainerRef.current.clientWidth;
        canvas.height = mapContainerRef.current.clientHeight;
        renderCanvas();
      }
    });

    if (mapContainerRef.current) {
      canvas.width = mapContainerRef.current.clientWidth;
      canvas.height = mapContainerRef.current.clientHeight;
      resizeObserver.observe(mapContainerRef.current);
    }

    renderCanvas();

    map.on('render', renderCanvas);
    map.on('move', renderCanvas);
    map.on('zoom', renderCanvas);

    return () => {
      resizeObserver.disconnect();
      map.off('render', renderCanvas);
      map.off('move', renderCanvas);
      map.off('zoom', renderCanvas);
    };
  }, [
    region, 
    cells, 
    advectedCells, 
    leadTimeMin, 
    layerVisibility
  ]);

  return (
    <div className="relative flex-1 w-full h-full flex flex-col bg-[#070B14] overflow-hidden select-none">
      
      {/* MapLibre WebGL Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Synchronized High-Performance Canvas Overlay */}
      <canvas 
        ref={canvasOverlayRef} 
        className="absolute inset-0 z-10 pointer-events-none" 
      />

      {/* Outside Radar Coverage Hatching Label Bar (Top-Center) */}
      {layerVisibility.rangeRing && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-mono text-slate-400 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span>Inner Core: Doppler Radar Dual-Pol (1 km)</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400/90">Hatched Border: satellite-only · ~4 km · lower confidence</span>
          </div>
        </div>
      )}

      {/* Floating Toolbar (Top-Left): Layer Controls */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <div className="relative">
          <button
            onClick={() => setLayersMenuOpen(!layersMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-panel/95 hover:bg-panel border border-glass text-xs font-mono text-white shadow-glass backdrop-blur-md transition"
          >
            <Layers className="w-4 h-4 text-accent-orange" />
            <span>Map Layers</span>
          </button>

          {/* Layer toggles dropdown */}
          {layersMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 p-3 rounded-xl glass-dropdown space-y-2 text-xs font-mono shadow-2xl animate-fadeIn">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-glass pb-1">
                Toggle Visual Layers
              </div>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Radar Reflectivity</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.radar}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, radar: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <Satellite className="w-3.5 h-3.5 text-hazard-downburst" />
                  <span>Satellite IR (INSAT)</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.satellite}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, satellite: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-hazard-lightning" />
                  <span>Lightning Strikes</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.lightning}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, lightning: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-accent-orange inline-block" />
                  <span>Tracks & Uncertainty</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.tracks}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, tracks: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-accent-cyan inline-block" />
                  <span>Radar Coverage Ring</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.rangeRing}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, rangeRing: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse" />
                  <span>Satellite CI Beacon</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.satelliteCiMarker}
                  onChange={e => setLayerVisibility(prev => ({ ...prev, satelliteCiMarker: e.target.checked }))}
                  className="rounded bg-slate-800 border-glass text-accent-orange focus:ring-0"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Floating dBZ Color Scale Legend (Bottom-Left) */}
      <div className="absolute bottom-24 left-3 z-20 p-2.5 rounded-xl bg-panel/90 backdrop-blur-md border border-glass text-[10px] font-mono shadow-glass space-y-1.5 max-w-[260px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-bold">Radar Reflectivity</span>
          <span className="text-slate-400">dBZ (IMD Palette)</span>
        </div>
        
        {/* Color bar */}
        <div className="w-full h-2.5 rounded-sm dbz-gradient shadow-inner" />

        <div className="flex items-center justify-between text-slate-400 font-mono text-[9px]">
          <span>15</span>
          <span>25</span>
          <span>35</span>
          <span>45</span>
          <span>55</span>
          <span>65+</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-glass/40 text-[9px] text-slate-400">
          <span className="text-sky-300">Light</span>
          <span className="text-emerald-300">Mod</span>
          <span className="text-amber-300">Heavy</span>
          <span className="text-rose-400 font-bold">Severe / Hail</span>
        </div>
      </div>

      {/* Probe Pin Arrival Window Modal (Displayed when user clicks map) */}
      {probeResult && (
        <div className="absolute top-16 right-4 z-30 w-80 p-4 rounded-xl bg-[#0C1424]/95 backdrop-blur-xl border border-accent-orange/40 shadow-2xl text-slate-200 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-glass pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-orange" />
              <span className="font-heading font-bold text-xs text-white">POINT PROBE ANALYSIS</span>
            </div>
            <button
              onClick={() => setProbeResult(null)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close probe"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Coordinates: {probeResult.coordinates[1].toFixed(3)}°N, {probeResult.coordinates[0].toFixed(3)}°E
          </div>

          <div className="p-2.5 rounded-lg bg-black/50 border border-glass space-y-1">
            <div className="text-[10px] text-slate-400 font-mono">ESTIMATED ARRIVAL WINDOW:</div>
            <div className="text-lg font-heading font-bold text-accent-orange">
              {probeResult.windowStartMin} – {probeResult.windowEndMin} min
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Confidence Probability: <strong className="text-white">{probeResult.probability}%</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
            <div className="p-2 rounded bg-panel border border-glass">
              <div className="text-slate-500">Closest Storm:</div>
              <div className="font-bold text-white truncate">{probeResult.closestCellId}</div>
            </div>
            <div className="p-2 rounded bg-panel border border-glass">
              <div className="text-slate-500">Distance:</div>
              <div className="font-bold text-white">{probeResult.distanceKm} km</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            Predicted Peak Reflectivity: <strong className="text-accent-cyan">{probeResult.predictedDbz} dBZ</strong>
          </div>

        </div>
      )}

      {/* BOTTOM TIMELINE SCRUBBER & PLAYBACK CONTROLLER (0 - 360 MIN) */}
      <div className="absolute bottom-3 left-3 right-3 z-20 p-3 sm:p-4 rounded-xl bg-[#090F1C]/95 backdrop-blur-xl border border-glass shadow-glass">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-orange hover:bg-orange-600 text-white shadow-glow transition"
              aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                onLeadTimeChange(0);
              }}
              className="p-2 rounded-lg bg-panel hover:bg-panel-hover border border-glass text-slate-300 transition"
              title="Reset to T+0 min"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback speed toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-glass text-xs font-mono">
              {([1, 2, 4] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    playbackSpeed === speed ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Current Lead-Time Display */}
            <div className="font-mono text-xs pl-1">
              <span className="text-slate-400">Lead Time: </span>
              <span className="font-bold text-white text-sm">
                +{leadTimeMin} min
              </span>
              <span className="text-slate-400 text-[11px]">
                {' '}(+{Math.floor(leadTimeMin / 60)}h {leadTimeMin % 60}m)
              </span>
            </div>
          </div>

          {/* Right: Slider & Regime Badge */}
          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={leadTimeMin}
                onChange={e => onLeadTimeChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            {/* Scientific Regime Indicator */}
            <div className="shrink-0 text-right">
              {leadTimeMin < 90 && (
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  Radar Lagrangian (1 km)
                </span>
              )}
              {leadTimeMin >= 90 && leadTimeMin < 180 && (
                <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  Radar + NWP Blend
                </span>
              )}
              {leadTimeMin >= 180 && (
                <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/30">
                  Area NWP Probability
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
