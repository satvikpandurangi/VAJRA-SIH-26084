export type RegionId = 'kolkata' | 'delhi' | 'mumbai' | 'bengaluru' | 'uttarakhand';

export type HazardType = 'lightning' | 'hail' | 'downburst' | 'cloudburst' | 'severe_thunderstorm';

export type SeverityLevel = 'severe' | 'moderate' | 'developing' | 'low';

export interface RegionInfo {
  id: RegionId;
  name: string;
  hindiName: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  dwrStation: string;
  radarRadiusKm: number;
  description: string;
  synopticContext: string;
  orographicWarning?: boolean;
}

export interface StormCell {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  movementVector: {
    bearingDeg: number;
    speedKmh: number;
    directionLabel: string;
  };
  severity: SeverityLevel;
  topHazards: HazardType[];
  maxReflectivityDbz: number;
  echoTopKm: number;
  vilKgM2: number; // Vertically Integrated Liquid (kg/m²)
  poshPercent: number; // Probability of Severe Hail (%)
  deltaVKmh: number; // Radial velocity divergence (km/h) for downbursts
  trend: 'intensifying' | 'weakening' | 'steady';
  history30MinDbz: number[]; // 6 data points at -30, -25, -20, -15, -10, -5 min
  currentDbz: number;
  isNewSatelliteDetection?: boolean;
  rainfallRateMmH: number; // mm/hour
  areaSqKm: number;
  cloudTopTempC: number; // INSAT IR brightness temp in °C
}

export interface ArrivalWindow {
  town: string;
  coordinates: [number, number];
  windowStartMin: number;
  windowEndMin: number;
  probability: number; // 0 - 100%
  primaryHazard: HazardType;
  distanceKm: number;
  alertLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  peakImpactDbz: number;
}

export interface HazardProbabilityProfile {
  hazard: HazardType;
  label: string;
  icon: string;
  color: string;
  t0: number;
  t30: number;
  t60: number;
  t120: number;
  t240: number;
  confidenceT0: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceT60: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceT120: 'MEDIUM' | 'LOW' | 'GUIDANCE';
}

export interface LightningStrike {
  id: string;
  coordinates: [number, number];
  ageMin: number; // 0 to 15 min
  polarity: '+' | '-';
  peakCurrentKa: number;
}

export interface DataSourceStatus {
  radar: {
    status: 'online' | 'degraded';
    lastUpdate: string;
    latencySec: number;
    stationName: string;
    frequency: string;
  };
  insat: {
    status: 'online' | 'degraded';
    lastUpdate: string;
    channel: string;
    resolution: string;
  };
  lightning: {
    status: 'online' | 'degraded';
    lastUpdate: string;
    activeSensors: number;
    rateLast10Min: number;
  };
  nwp: {
    status: 'online' | 'degraded';
    cycle: string;
    model: string;
    resolution: string;
  };
}

export interface SkillCurvePoint {
  leadTimeMin: number;
  csiVajra: number;
  csiPysteps: number;
  fssVajra: number;
  fssPysteps: number;
}

export interface CAPAlert {
  identifier: string;
  sender: string;
  sent: string;
  status: 'Actual' | 'Exercise' | 'Draft';
  msgType: 'Alert' | 'Update' | 'Cancel';
  scope: 'Public' | 'Restricted' | 'Private';
  info: {
    category: 'Met';
    event: string;
    urgency: 'Immediate' | 'Expected' | 'Future';
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
    certainty: 'Observed' | 'Likely' | 'Possible';
    headline: string;
    description: string;
    instruction: string;
    contact: string;
    areaDesc: string;
    polygon: [number, number][]; // [lat, lng] pairs for CAP standard
  };
}
