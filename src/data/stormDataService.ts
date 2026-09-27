import { 
  RegionId, 
  RegionInfo, 
  StormCell, 
  ArrivalWindow, 
  HazardProbabilityProfile, 
  DataSourceStatus, 
  SkillCurvePoint, 
  CAPAlert,
  LightningStrike 
} from './types';
import { REGIONS, SCENARIO_DATA, SKILL_CURVE_DATA } from './scenarios';
import { computeAdvectedCells } from './proceduralRadar';

class StormDataService {
  private currentRegionId: RegionId = 'kolkata';

  public getRegions(): RegionInfo[] {
    return Object.values(REGIONS);
  }

  public getRegion(id: RegionId): RegionInfo {
    return REGIONS[id] || REGIONS.kolkata;
  }

  public getCells(regionId: RegionId = this.currentRegionId): StormCell[] {
    const dataset = SCENARIO_DATA[regionId] || SCENARIO_DATA.kolkata;
    return dataset.cells;
  }

  public getArrivalWindows(regionId: RegionId = this.currentRegionId): ArrivalWindow[] {
    const dataset = SCENARIO_DATA[regionId] || SCENARIO_DATA.kolkata;
    return dataset.arrivalWindows;
  }

  public getLightningStrikes(regionId: RegionId = this.currentRegionId): LightningStrike[] {
    const dataset = SCENARIO_DATA[regionId] || SCENARIO_DATA.kolkata;
    return dataset.lightningStrikes;
  }

  public getDataSourceStatus(): DataSourceStatus {
    return {
      radar: {
        status: 'online',
        lastUpdate: '14:05 IST',
        latencySec: 42,
        stationName: 'DWR-S Dual-Pol (5-min vol. scan)',
        frequency: '2.7 - 2.9 GHz'
      },
      insat: {
        status: 'online',
        lastUpdate: '14:00 IST',
        channel: 'INSAT-3DS Rapid Scan TIR-1 & WV',
        resolution: '4.0 km'
      },
      lightning: {
        status: 'online',
        lastUpdate: '14:04 IST',
        activeSensors: 84,
        rateLast10Min: 342
      },
      nwp: {
        status: 'online',
        cycle: 'NCMRWF Unified Model 06:00 UTC',
        model: 'NCUM-Regional Convection Permitting',
        resolution: '1.5 km'
      }
    };
  }

  public getHazardProbabilities(cell: StormCell): HazardProbabilityProfile[] {
    const isSevere = cell.severity === 'severe';
    const hasHail = cell.topHazards.includes('hail');
    const isCloudburst = cell.topHazards.includes('cloudburst');

    return [
      {
        hazard: 'severe_thunderstorm',
        label: 'Severe Thunderstorm',
        icon: 'CloudLightning',
        color: '#C0182D',
        t0: isSevere ? 95 : 65,
        t30: isSevere ? 90 : 60,
        t60: isSevere ? 82 : 48,
        t120: isSevere ? 65 : 35,
        t240: isSevere ? 42 : 22,
        confidenceT0: 'HIGH',
        confidenceT60: 'HIGH',
        confidenceT120: 'MEDIUM'
      },
      {
        hazard: 'lightning',
        label: 'Cloud-to-Ground Lightning',
        icon: 'Zap',
        color: '#FFD400',
        t0: 98,
        t30: 92,
        t60: 84,
        t120: 60,
        t240: 38,
        confidenceT0: 'HIGH',
        confidenceT60: 'HIGH',
        confidenceT120: 'MEDIUM'
      },
      {
        hazard: 'hail',
        label: 'Severe Hail (≥2.5 cm)',
        icon: 'Sparkles',
        color: '#E0E7FF',
        t0: hasHail ? 88 : 25,
        t30: hasHail ? 78 : 20,
        t60: hasHail ? 55 : 12,
        t120: hasHail ? 30 : 5,
        t240: 10,
        confidenceT0: 'HIGH',
        confidenceT60: 'MEDIUM',
        confidenceT120: 'LOW'
      },
      {
        hazard: 'downburst',
        label: 'Microburst / Downburst (>70 km/h)',
        icon: 'Wind',
        color: '#A855F7',
        t0: isSevere ? 84 : 40,
        t30: isSevere ? 75 : 30,
        t60: isSevere ? 60 : 20,
        t120: isSevere ? 35 : 10,
        t240: 15,
        confidenceT0: 'HIGH',
        confidenceT60: 'MEDIUM',
        confidenceT120: 'LOW'
      },
      {
        hazard: 'cloudburst',
        label: 'Extreme Rain / Cloudburst (≥100 mm/h)',
        icon: 'CloudRain',
        color: '#1E88E5',
        t0: isCloudburst ? 94 : (cell.rainfallRateMmH > 60 ? 65 : 18),
        t30: isCloudburst ? 90 : 45,
        t60: isCloudburst ? 78 : 30,
        t120: isCloudburst ? 52 : 15,
        t240: 25,
        confidenceT0: 'HIGH',
        confidenceT60: 'HIGH',
        confidenceT120: 'MEDIUM'
      }
    ];
  }

  public getSkillCurveData(): SkillCurvePoint[] {
    return SKILL_CURVE_DATA;
  }

  /**
   * Probe point inspection: computes estimated arrival window,
   * closest storm cell, bearing, and distance from custom clicked coordinates.
   */
  public probeCoordinates(
    regionId: RegionId,
    clickLng: number,
    clickLat: number,
    leadTimeMin: number
  ) {
    const dataset = SCENARIO_DATA[regionId] || SCENARIO_DATA.kolkata;
    const advected = computeAdvectedCells(dataset.cells, leadTimeMin);

    let closestCell = dataset.cells[0];
    let minDistanceKm = 9999;
    let closestAdvected = advected[0];

    dataset.cells.forEach((cell, idx) => {
      const adv = advected[idx];
      const dLat = (clickLat - cell.coordinates[1]) * 110.574;
      const dLng = (clickLng - cell.coordinates[0]) * 111.320 * Math.cos((clickLat * Math.PI) / 180);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);

      if (dist < minDistanceKm) {
        minDistanceKm = dist;
        closestCell = cell;
        closestAdvected = adv;
      }
    });

    const speedKmPerMin = closestCell.movementVector.speedKmh / 60;
    const estTimeMin = Math.round(minDistanceKm / speedKmPerMin);
    const windowStart = Math.max(0, estTimeMin - 12);
    const windowEnd = estTimeMin + 15;

    const probability = Math.max(10, Math.min(95, Math.round(95 - minDistanceKm * 0.8)));

    return {
      coordinates: [clickLng, clickLat] as [number, number],
      closestCellId: closestCell.id,
      closestCellName: closestCell.name,
      distanceKm: Math.round(minDistanceKm),
      windowStartMin: windowStart,
      windowEndMin: windowEnd,
      estimatedArrivalMin: estTimeMin,
      probability,
      predictedDbz: Math.round(closestAdvected.dbz * (probability / 100)),
      topHazards: closestCell.topHazards
    };
  }

  /**
   * Common Alerting Protocol (CAP v1.2) Generator
   */
  public generateCAPAlert(cell: StormCell, region: RegionInfo): { alert: CAPAlert; xml: string; json: string } {
    const nowIso = new Date().toISOString();
    const alertId = `IN-IMD-NOWCAST-${region.id.toUpperCase()}-${cell.id}-${Date.now()}`;
    const hazardList = cell.topHazards.map(h => h.replace('_', ' ').toUpperCase()).join(', ');

    const polygon: [number, number][] = [
      [cell.coordinates[1] + 0.15, cell.coordinates[0] - 0.20],
      [cell.coordinates[1] + 0.22, cell.coordinates[0] + 0.18],
      [cell.coordinates[1] - 0.12, cell.coordinates[0] + 0.25],
      [cell.coordinates[1] - 0.18, cell.coordinates[0] - 0.15],
      [cell.coordinates[1] + 0.15, cell.coordinates[0] - 0.20]
    ];

    const alert: CAPAlert = {
      identifier: alertId,
      sender: `nowcast-officer@imd.gov.in`,
      sent: nowIso,
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      info: {
        category: 'Met',
        event: `Severe Convective Nowcast: ${hazardList}`,
        urgency: cell.severity === 'severe' ? 'Immediate' : 'Expected',
        severity: cell.severity === 'severe' ? 'Extreme' : 'Severe',
        certainty: 'Observed',
        headline: `IMD NOWCAST WARNING: Severe Thunderstorm with ${hazardList} approaching ${region.name}`,
        description: `Doppler radar ${region.dwrStation} and INSAT-3DS show convective cell ${cell.id} (${cell.name}) with reflectivity ${cell.maxReflectivityDbz} dBZ, VIL ${cell.vilKgM2} kg/m², POSH ${cell.poshPercent}%, moving ${cell.movementVector.directionLabel}.`,
        instruction: `Take shelter immediately in sturdy structures. Stay away from open fields, tall trees, and electrical poles. Aviation and railways are advised to enact convective flight and track protocols.`,
        contact: 'Duty Meteorologist, National Weather Forecasting Centre (NWFC), New Delhi',
        areaDesc: `${region.name} and adjoining districts`,
        polygon
      }
    };

    const polyString = polygon.map(p => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join(' ');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.identifier}</identifier>
  <sender>${alert.sender}</sender>
  <sent>${alert.sent}</sent>
  <status>${alert.status}</status>
  <msgType>${alert.msgType}</msgType>
  <scope>${alert.scope}</scope>
  <code>IMD_NOWCAST_V2</code>
  <info>
    <category>${alert.info.category}</category>
    <event>${alert.info.event}</event>
    <urgency>${alert.info.urgency}</urgency>
    <severity>${alert.info.severity}</severity>
    <certainty>${alert.info.certainty}</certainty>
    <headline>${alert.info.headline}</headline>
    <description>${alert.info.description}</description>
    <instruction>${alert.info.instruction}</instruction>
    <contact>${alert.info.contact}</contact>
    <area>
      <areaDesc>${alert.info.areaDesc}</areaDesc>
      <polygon>${polyString}</polygon>
    </area>
  </info>
</alert>`;

    const json = JSON.stringify(alert, null, 2);

    return { alert, xml, json };
  }
}

export const stormDataService = new StormDataService();
