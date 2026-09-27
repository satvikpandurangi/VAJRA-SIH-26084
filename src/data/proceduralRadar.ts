import { RegionInfo, StormCell } from './types';

export interface AdvectedCellState {
  id: string;
  lng: number;
  lat: number;
  dbz: number;
  uncertaintyRadiusKm: number;
  blendMode: 'radar_dominant' | 'blended' | 'nwp_dominant';
  rainRateMmH: number;
}

/**
 * Calculates cell position and state at forecast lead time t (0 to 360 min)
 * using Lagrangian persistence + dispersion expansion + NWP blending.
 */
export function computeAdvectedCells(
  baseCells: StormCell[],
  leadTimeMin: number
): AdvectedCellState[] {
  return baseCells.map(cell => {
    const hours = leadTimeMin / 60;
    const distanceKm = cell.movementVector.speedKmh * hours;
    const bearingRad = (cell.movementVector.bearingDeg * Math.PI) / 180;

    // Geographic conversion: approx 1 deg latitude ~ 111 km, 1 deg longitude ~ 111 * cos(lat) km
    const latRad = (cell.coordinates[1] * Math.PI) / 180;
    const dLat = (distanceKm * Math.cos(bearingRad)) / 110.574;
    const dLng = (distanceKm * Math.sin(bearingRad)) / (111.320 * Math.cos(latRad));

    const curLng = cell.coordinates[0] + dLng;
    const curLat = cell.coordinates[1] + dLat;

    // Uncertainty ellipse radius expands over time (Lagrangian spatial error growth ~ 0.25 km/min)
    const baseRadiusKm = 4.0;
    const uncertaintyRadiusKm = baseRadiusKm + (leadTimeMin * 0.22);

    // Reflectivity attenuation / broadening with lead time
    let dbz = cell.currentDbz;
    if (cell.trend === 'intensifying' && leadTimeMin < 45) {
      dbz = Math.min(68, dbz + (leadTimeMin / 45) * 4);
    } else if (cell.trend === 'weakening') {
      dbz = Math.max(25, dbz - (leadTimeMin / 60) * 8);
    } else if (leadTimeMin > 90) {
      // Natural convective decay after ~2h
      dbz = Math.max(30, dbz - ((leadTimeMin - 90) / 180) * 12);
    }

    let blendMode: 'radar_dominant' | 'blended' | 'nwp_dominant' = 'radar_dominant';
    if (leadTimeMin >= 120 && leadTimeMin < 240) {
      blendMode = 'blended';
    } else if (leadTimeMin >= 240) {
      blendMode = 'nwp_dominant';
    }

    const rainRate = Math.max(5, (cell.rainfallRateMmH * Math.pow(10, (dbz - cell.currentDbz) / 25)));

    return {
      id: cell.id,
      lng: curLng,
      lat: curLat,
      dbz,
      uncertaintyRadiusKm,
      blendMode,
      rainRateMmH: Math.round(rainRate)
    };
  });
}

/**
 * Returns RGBA color tuple for a given radar reflectivity in dBZ.
 * Follows standard IMD / WMO dual-pol reflectivity palette.
 */
export function getDbzColor(dbz: number, alpha: number = 0.85): string {
  if (dbz < 15) return `rgba(0, 0, 0, 0)`;
  if (dbz < 25) return `rgba(0, 210, 255, ${alpha * 0.7})`; // Light Cyan
  if (dbz < 35) return `rgba(0, 140, 255, ${alpha * 0.8})`; // Blue
  if (dbz < 42) return `rgba(16, 185, 129, ${alpha * 0.85})`; // Moderate Green
  if (dbz < 50) return `rgba(250, 204, 21, ${alpha * 0.9})`; // Yellow
  if (dbz < 58) return `rgba(242, 140, 40, ${alpha * 0.95})`; // Orange (VAJRA Accent)
  if (dbz < 65) return `rgba(225, 29, 72, ${alpha * 0.98})`; // Crimson / Red
  return `rgba(217, 70, 239, ${alpha})`; // Magenta / White Hail core
}

/**
 * Generates an SVG or Canvas overlay representing the radar field,
 * storm tracks, and uncertainty ellipses for the current lead time.
 */
export function generateRadarOverlayCanvas(
  canvas: HTMLCanvasElement,
  region: RegionInfo,
  cells: StormCell[],
  leadTimeMin: number,
  layers: {
    radar: boolean;
    satellite: boolean;
    tracks: boolean;
    rangeRing: boolean;
  }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  // Helper coordinate mapper
  const lngSpan = 2.4;
  const latSpan = 1.8;
  const minLng = region.center[0] - lngSpan / 2;
  const maxLng = region.center[0] + lngSpan / 2;
  const minLat = region.center[1] - latSpan / 2;
  const maxLat = region.center[1] + latSpan / 2;

  const toPx = (lng: number, lat: number): [number, number] => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;
    return [x, y];
  };

  const kmToPx = (km: number): number => {
    const approxTotalKmX = lngSpan * 105;
    return (km / approxTotalKmX) * width;
  };

  const advected = computeAdvectedCells(cells, leadTimeMin);

  // 1. DWR Coverage Ring & Outside Hatching
  if (layers.rangeRing) {
    const [cx, cy] = toPx(region.center[0], region.center[1]);
    const radiusPx = kmToPx(region.radarRadiusKm);

    ctx.save();
    // Outside coverage zone tint/hatch
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(7, 11, 20, 0.45)';
    ctx.fill();

    // Radar boundary ring
    ctx.beginPath();
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();

    // Range ring label
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0, 210, 255, 0.7)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(`${region.radarRadiusKm} km DWR Coverage Boundary`, cx - 80, cy - radiusPx + 16);
    ctx.restore();
  }

  // 2. Satellite IR Thermal Overlay (if enabled)
  if (layers.satellite) {
    ctx.save();
    advected.forEach(c => {
      const [x, y] = toPx(c.lng, c.lat);
      const satRadius = kmToPx(c.uncertaintyRadiusKm * 2.2);

      const radGrad = ctx.createRadialGradient(x, y, satRadius * 0.1, x, y, satRadius);
      radGrad.addColorStop(0, 'rgba(120, 20, 180, 0.35)');
      radGrad.addColorStop(0.5, 'rgba(40, 70, 180, 0.2)');
      radGrad.addColorStop(1, 'rgba(10, 30, 80, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, satRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // 3. Radar Reflectivity Cores (Gaussian synthesis)
  if (layers.radar) {
    ctx.save();
    advected.forEach(c => {
      const [x, y] = toPx(c.lng, c.lat);
      const corePx = kmToPx(14);

      // Multi-ring convective core
      const rings = [
        { radiusFrac: 1.4, dbz: c.dbz * 0.4 },
        { radiusFrac: 1.0, dbz: c.dbz * 0.65 },
        { radiusFrac: 0.65, dbz: c.dbz * 0.85 },
        { radiusFrac: 0.35, dbz: c.dbz }
      ];

      rings.forEach(r => {
        const rad = corePx * r.radiusFrac;
        const color = getDbzColor(r.dbz, 0.8);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.restore();
  }

  // 4. Storm Tracks & Uncertainty Ellipses
  if (layers.tracks) {
    ctx.save();
    cells.forEach(baseCell => {
      const future30 = computeAdvectedCells([baseCell], 30)[0];
      const future60 = computeAdvectedCells([baseCell], 60)[0];
      const future120 = computeAdvectedCells([baseCell], 120)[0];

      const [p0x, p0y] = toPx(baseCell.coordinates[0], baseCell.coordinates[1]);
      const [p30x, p30y] = toPx(future30.lng, future30.lat);
      const [p60x, p60y] = toPx(future60.lng, future60.lat);
      const [p120x, p120y] = toPx(future120.lng, future120.lat);

      // Track vector line
      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.lineTo(p30x, p30y);
      ctx.lineTo(p60x, p60y);
      ctx.lineTo(p120x, p120y);
      ctx.strokeStyle = 'rgba(242, 140, 40, 0.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // +30 min ellipse
      const r30 = kmToPx(future30.uncertaintyRadiusKm);
      ctx.beginPath();
      ctx.ellipse(p30x, p30y, r30 * 1.3, r30 * 0.8, (baseCell.movementVector.bearingDeg * Math.PI) / 180, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
      ctx.setLineDash([2, 2]);
      ctx.fill();
      ctx.stroke();

      // +60 min ellipse
      const r60 = kmToPx(future60.uncertaintyRadiusKm);
      ctx.beginPath();
      ctx.ellipse(p60x, p60y, r60 * 1.5, r60 * 0.9, (baseCell.movementVector.bearingDeg * Math.PI) / 180, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(242, 140, 40, 0.5)';
      ctx.fillStyle = 'rgba(242, 140, 40, 0.06)';
      ctx.fill();
      ctx.stroke();

      // Time markers
      ctx.setLineDash([]);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('+30m', p30x + 8, p30y - 4);
      ctx.fillText('+60m', p60x + 8, p60y - 4);
    });
    ctx.restore();
  }
}
