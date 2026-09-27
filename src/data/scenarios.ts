import { RegionId, RegionInfo, StormCell, ArrivalWindow, LightningStrike, SkillCurvePoint } from './types';

export const REGIONS: Record<RegionId, RegionInfo> = {
  kolkata: {
    id: 'kolkata',
    name: 'Kolkata (Gangetic W. Bengal)',
    hindiName: 'कोलकाता एवं गांगेय पश्चिम बंगाल',
    center: [88.15, 22.75],
    zoom: 8.4,
    dwrStation: 'DWR Kolkata (S-Band Dual-Pol, 2.7 GHz)',
    radarRadiusKm: 250,
    description: 'Pre-monsoon Kalbaishakhi (Nor\'wester) squall line initiating over Chota Nagpur Plateau and surging ESE across the Gangetic plains.',
    synopticContext: 'Surface low over Jharkhand with strong south-westerly moisture flux from Bay of Bengal (CAPE > 3,800 J/kg, 0-6 km Shear ~ 42 kt).'
  },
  uttarakhand: {
    id: 'uttarakhand',
    name: 'Uttarakhand (Himalayan Terrain)',
    hindiName: 'उत्तराखंड हिमालयी क्षेत्र',
    center: [78.75, 30.35],
    zoom: 8.8,
    dwrStation: 'DWR Mukteshwar & Surkanda Devi (X-Band Polarimetric)',
    radarRadiusKm: 120,
    description: 'Orographic convective cloudburst event with localized intense rain rates exceeding 100 mm/h over Mandakini and Alaknanda catchments.',
    synopticContext: 'Monsoon trough interaction with Western Disturbance; intense moisture convergence against high topography with freezing level at 4.6 km.',
    orographicWarning: true
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi NCR (Northern Plains)',
    hindiName: 'दिल्ली राष्ट्रीय राजधानी क्षेत्र',
    center: [77.15, 28.65],
    zoom: 8.8,
    dwrStation: 'DWR Palam & Lodhi Road (C-Band)',
    radarRadiusKm: 240,
    description: 'Approaching pre-monsoon dust storm (Andhi) and high-based severe squall line along dryline boundary.',
    synopticContext: 'Dryline passage from Rajasthan meeting easterly moist tongue; extreme downdraft CAPE (DCAPE > 1,100 J/kg).'
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai (Konkan Coast)',
    hindiName: 'मुंबई एवं कोंकण तट',
    center: [72.95, 19.10],
    zoom: 8.9,
    dwrStation: 'DWR Mumbai Veravali (S-Band, 2.8 GHz)',
    radarRadiusKm: 250,
    description: 'Offshore-onshore mesoscale convective cloud band moving inland with heavy tropical convective bursts.',
    synopticContext: 'Offshore trough along west coast with low-level jet (LLJ) exceeding 35 kt at 850 hPa.'
  },
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru (Peninsular Plateau)',
    hindiName: 'बेंगलुरु एवं प्रायद्वीपीय पठार',
    center: [77.60, 12.98],
    zoom: 8.8,
    dwrStation: 'DWR Bengaluru (C-Band Dual-Pol)',
    radarRadiusKm: 220,
    description: 'Late afternoon pulse thunderstorms driven by strong surface heating and sea-breeze boundary collisions.',
    synopticContext: 'Wind discontinuity line over interior peninsula with deep dry sub-cloud layer facilitating strong microbursts.'
  }
};

export interface ScenarioDataset {
  cells: StormCell[];
  arrivalWindows: ArrivalWindow[];
  lightningStrikes: LightningStrike[];
}

export const SCENARIO_DATA: Record<RegionId, ScenarioDataset> = {
  kolkata: {
    cells: [
      {
        id: 'CELL-V01',
        name: 'Bardhaman–Hooghly Supercell Core',
        coordinates: [88.02, 23.08], // East of Bardhaman moving towards Hooghly & Kolkata
        movementVector: {
          bearingDeg: 115,
          speedKmh: 48,
          directionLabel: 'ESE at 48 km/h'
        },
        severity: 'severe',
        topHazards: ['hail', 'downburst', 'lightning', 'severe_thunderstorm'],
        maxReflectivityDbz: 64.5,
        echoTopKm: 16.4,
        vilKgM2: 58.2, // High VIL indicating large hail mass aloft
        poshPercent: 88, // 88% probability of severe hail (>2.5 cm)
        deltaVKmh: 74, // Downburst shear potential >70 km/h
        trend: 'intensifying',
        history30MinDbz: [48, 52, 55, 59, 62, 64.5],
        currentDbz: 64.5,
        rainfallRateMmH: 82,
        areaSqKm: 420,
        cloudTopTempC: -68.4
      },
      {
        id: 'CELL-V02',
        name: 'Kharagpur–Medinipur Multicell',
        coordinates: [87.42, 22.38], // Near Medinipur / Kharagpur
        movementVector: {
          bearingDeg: 125,
          speedKmh: 36,
          directionLabel: 'SE at 36 km/h'
        },
        severity: 'moderate',
        topHazards: ['lightning', 'severe_thunderstorm'],
        maxReflectivityDbz: 51.2,
        echoTopKm: 12.1,
        vilKgM2: 32.0,
        poshPercent: 24,
        deltaVKmh: 38,
        trend: 'weakening',
        history30MinDbz: [57, 56, 54, 53, 52, 51.2],
        currentDbz: 51.2,
        rainfallRateMmH: 45,
        areaSqKm: 280,
        cloudTopTempC: -54.0
      },
      {
        id: 'CELL-V03',
        name: 'Nadia–Murshidabad Inception Core',
        coordinates: [88.38, 23.55], // Northwest sector, newly flagged by INSAT-3DS rapid cooling
        movementVector: {
          bearingDeg: 120,
          speedKmh: 42,
          directionLabel: 'ESE at 42 km/h'
        },
        severity: 'developing',
        topHazards: ['lightning'],
        maxReflectivityDbz: 42.0,
        echoTopKm: 9.8,
        vilKgM2: 18.5,
        poshPercent: 12,
        deltaVKmh: 26,
        trend: 'intensifying',
        history30MinDbz: [22, 25, 29, 34, 38, 42.0],
        currentDbz: 42.0,
        isNewSatelliteDetection: true,
        rainfallRateMmH: 28,
        areaSqKm: 150,
        cloudTopTempC: -46.2
      }
    ],
    arrivalWindows: [
      {
        town: 'Bardhaman (Station)',
        coordinates: [87.855, 23.232],
        windowStartMin: 0,
        windowEndMin: 18,
        probability: 95,
        primaryHazard: 'downburst',
        distanceKm: 12,
        alertLevel: 'RED',
        peakImpactDbz: 62
      },
      {
        town: 'Howrah Junction',
        coordinates: [88.342, 22.585],
        windowStartMin: 32,
        windowEndMin: 52,
        probability: 84,
        primaryHazard: 'hail',
        distanceKm: 34,
        alertLevel: 'RED',
        peakImpactDbz: 61
      },
      {
        town: 'Kolkata (Alipore Met / Central)',
        coordinates: [88.3639, 22.5726],
        windowStartMin: 38,
        windowEndMin: 58,
        probability: 82,
        primaryHazard: 'lightning',
        distanceKm: 38,
        alertLevel: 'RED',
        peakImpactDbz: 59
      },
      {
        town: 'Dum Dum (NSCB Intl. Airport)',
        coordinates: [88.4467, 22.6547],
        windowStartMin: 44,
        windowEndMin: 65,
        probability: 76,
        primaryHazard: 'downburst',
        distanceKm: 42,
        alertLevel: 'ORANGE',
        peakImpactDbz: 57
      },
      {
        town: 'Haldia Port & Petrochemical',
        coordinates: [88.0664, 22.0667],
        windowStartMin: 75,
        windowEndMin: 110,
        probability: 58,
        primaryHazard: 'lightning',
        distanceKm: 72,
        alertLevel: 'YELLOW',
        peakImpactDbz: 48
      },
      {
        town: 'Medinipur Town',
        coordinates: [87.3215, 22.4257],
        windowStartMin: 10,
        windowEndMin: 35,
        probability: 68,
        primaryHazard: 'lightning',
        distanceKm: 16,
        alertLevel: 'YELLOW',
        peakImpactDbz: 51
      }
    ],
    lightningStrikes: [
      { id: 'L-101', coordinates: [88.04, 23.09], ageMin: 1.2, polarity: '-', peakCurrentKa: 48 },
      { id: 'L-102', coordinates: [88.01, 23.07], ageMin: 2.5, polarity: '+', peakCurrentKa: 72 },
      { id: 'L-103', coordinates: [87.98, 23.11], ageMin: 3.8, polarity: '-', peakCurrentKa: 35 },
      { id: 'L-104', coordinates: [88.07, 23.04], ageMin: 5.1, polarity: '-', peakCurrentKa: 29 },
      { id: 'L-105', coordinates: [88.05, 23.14], ageMin: 6.7, polarity: '+', peakCurrentKa: 88 },
      { id: 'L-106', coordinates: [87.43, 22.39], ageMin: 4.2, polarity: '-', peakCurrentKa: 31 },
      { id: 'L-107', coordinates: [87.40, 22.36], ageMin: 8.9, polarity: '-', peakCurrentKa: 24 },
      { id: 'L-108', coordinates: [88.39, 23.56], ageMin: 2.1, polarity: '-', peakCurrentKa: 42 },
      { id: 'L-109', coordinates: [88.11, 23.02], ageMin: 11.2, polarity: '-', peakCurrentKa: 19 },
      { id: 'L-110', coordinates: [87.95, 23.16], ageMin: 13.5, polarity: '+', peakCurrentKa: 55 }
    ]
  },
  uttarakhand: {
    cells: [
      {
        id: 'CELL-UK01',
        name: 'Rudraprayag–Mandakini Torrential Core',
        coordinates: [78.96, 30.32],
        movementVector: {
          bearingDeg: 75,
          speedKmh: 14, // Quasi-stationary mountain locked!
          directionLabel: 'ENE at 14 km/h (Quasi-stationary)'
        },
        severity: 'severe',
        topHazards: ['cloudburst', 'downburst', 'lightning'],
        maxReflectivityDbz: 66.8,
        echoTopKm: 15.8,
        vilKgM2: 64.0,
        poshPercent: 45,
        deltaVKmh: 62,
        trend: 'intensifying',
        history30MinDbz: [52, 56, 60, 63, 65, 66.8],
        currentDbz: 66.8,
        rainfallRateMmH: 118, // EXCEEDS 100 mm/h IMD CLOUDBURST THRESHOLD!
        areaSqKm: 28, // Compact mountain valley catchment 20-30 km²
        cloudTopTempC: -71.2
      },
      {
        id: 'CELL-UK02',
        name: 'Chamoli–Alaknanda Valley Cluster',
        coordinates: [79.28, 30.42],
        movementVector: {
          bearingDeg: 80,
          speedKmh: 18,
          directionLabel: 'E at 18 km/h'
        },
        severity: 'moderate',
        topHazards: ['cloudburst', 'lightning'],
        maxReflectivityDbz: 57.0,
        echoTopKm: 13.4,
        vilKgM2: 44.0,
        poshPercent: 20,
        deltaVKmh: 42,
        trend: 'steady',
        history30MinDbz: [54, 55, 56, 56, 57, 57.0],
        currentDbz: 57.0,
        rainfallRateMmH: 92, // Near threshold
        areaSqKm: 34,
        cloudTopTempC: -62.0
      },
      {
        id: 'CELL-UK03',
        name: 'Tehri Ridge Developing Band',
        coordinates: [78.48, 30.38],
        movementVector: {
          bearingDeg: 70,
          speedKmh: 20,
          directionLabel: 'ENE at 20 km/h'
        },
        severity: 'developing',
        topHazards: ['lightning'],
        maxReflectivityDbz: 44.2,
        echoTopKm: 10.2,
        vilKgM2: 21.0,
        poshPercent: 5,
        deltaVKmh: 22,
        trend: 'intensifying',
        history30MinDbz: [28, 32, 35, 38, 41, 44.2],
        currentDbz: 44.2,
        rainfallRateMmH: 42,
        areaSqKm: 85,
        cloudTopTempC: -48.5
      }
    ],
    arrivalWindows: [
      {
        town: 'Rudraprayag Sangam',
        coordinates: [78.981, 30.284],
        windowStartMin: 5,
        windowEndMin: 35,
        probability: 98,
        primaryHazard: 'cloudburst',
        distanceKm: 6,
        alertLevel: 'RED',
        peakImpactDbz: 66
      },
      {
        town: 'Karanprayag & Gauchar',
        coordinates: [79.218, 30.258],
        windowStartMin: 28,
        windowEndMin: 65,
        probability: 88,
        primaryHazard: 'cloudburst',
        distanceKm: 24,
        alertLevel: 'RED',
        peakImpactDbz: 62
      },
      {
        town: 'Chamoli / Gopeshwar',
        coordinates: [79.321, 30.409],
        windowStartMin: 45,
        windowEndMin: 90,
        probability: 82,
        primaryHazard: 'cloudburst',
        distanceKm: 36,
        alertLevel: 'RED',
        peakImpactDbz: 59
      },
      {
        town: 'Srinagar Garhwal',
        coordinates: [78.784, 30.223],
        windowStartMin: 60,
        windowEndMin: 110,
        probability: 65,
        primaryHazard: 'lightning',
        distanceKm: 45,
        alertLevel: 'ORANGE',
        peakImpactDbz: 52
      },
      {
        town: 'Rishikesh Valley',
        coordinates: [78.267, 30.086],
        windowStartMin: 120,
        windowEndMin: 190,
        probability: 45,
        primaryHazard: 'lightning',
        distanceKm: 78,
        alertLevel: 'YELLOW',
        peakImpactDbz: 44
      }
    ],
    lightningStrikes: [
      { id: 'L-201', coordinates: [78.95, 30.31], ageMin: 0.8, polarity: '-', peakCurrentKa: 62 },
      { id: 'L-202', coordinates: [78.97, 30.34], ageMin: 1.9, polarity: '+', peakCurrentKa: 94 },
      { id: 'L-203', coordinates: [78.93, 30.29], ageMin: 4.1, polarity: '-', peakCurrentKa: 48 },
      { id: 'L-204', coordinates: [79.27, 30.43], ageMin: 3.2, polarity: '-', peakCurrentKa: 36 },
      { id: 'L-205', coordinates: [79.30, 30.40], ageMin: 7.5, polarity: '+', peakCurrentKa: 77 }
    ]
  },
  delhi: {
    cells: [
      {
        id: 'CELL-DL01',
        name: 'Haryana–NCR Inflow Squall Line',
        coordinates: [76.88, 28.82],
        movementVector: { bearingDeg: 100, speedKmh: 54, directionLabel: 'E at 54 km/h' },
        severity: 'severe',
        topHazards: ['downburst', 'lightning', 'hail'],
        maxReflectivityDbz: 61.0,
        echoTopKm: 14.5,
        vilKgM2: 48.0,
        poshPercent: 65,
        deltaVKmh: 82, // Severe microburst gust front
        trend: 'intensifying',
        history30MinDbz: [44, 49, 53, 56, 59, 61.0],
        currentDbz: 61.0,
        rainfallRateMmH: 65,
        areaSqKm: 520,
        cloudTopTempC: -62.5
      }
    ],
    arrivalWindows: [
      {
        town: 'Gurugram Cyber City',
        coordinates: [77.089, 28.490],
        windowStartMin: 22,
        windowEndMin: 45,
        probability: 88,
        primaryHazard: 'downburst',
        distanceKm: 28,
        alertLevel: 'RED',
        peakImpactDbz: 60
      },
      {
        town: 'IGI Airport (T3 Terminal)',
        coordinates: [77.085, 28.556],
        windowStartMin: 28,
        windowEndMin: 50,
        probability: 90,
        primaryHazard: 'downburst',
        distanceKm: 32,
        alertLevel: 'RED',
        peakImpactDbz: 61
      },
      {
        town: 'Central Delhi (Connaught Place)',
        coordinates: [77.219, 28.632],
        windowStartMin: 40,
        windowEndMin: 68,
        probability: 82,
        primaryHazard: 'lightning',
        distanceKm: 42,
        alertLevel: 'RED',
        peakImpactDbz: 58
      },
      {
        town: 'Noida Sector 62',
        coordinates: [77.363, 28.628],
        windowStartMin: 55,
        windowEndMin: 85,
        probability: 72,
        primaryHazard: 'lightning',
        distanceKm: 56,
        alertLevel: 'ORANGE',
        peakImpactDbz: 54
      }
    ],
    lightningStrikes: [
      { id: 'L-301', coordinates: [76.90, 28.84], ageMin: 1.4, polarity: '-', peakCurrentKa: 55 },
      { id: 'L-302', coordinates: [76.85, 28.80], ageMin: 3.1, polarity: '+', peakCurrentKa: 81 }
    ]
  },
  mumbai: {
    cells: [
      {
        id: 'CELL-MUM01',
        name: 'Arabian Sea Offshore Inflow Band',
        coordinates: [72.62, 19.12],
        movementVector: { bearingDeg: 80, speedKmh: 32, directionLabel: 'ENE at 32 km/h' },
        severity: 'severe',
        topHazards: ['cloudburst', 'lightning', 'severe_thunderstorm'],
        maxReflectivityDbz: 58.5,
        echoTopKm: 13.8,
        vilKgM2: 52.0,
        poshPercent: 15,
        deltaVKmh: 45,
        trend: 'steady',
        history30MinDbz: [52, 54, 56, 57, 58, 58.5],
        currentDbz: 58.5,
        rainfallRateMmH: 88,
        areaSqKm: 460,
        cloudTopTempC: -66.0
      }
    ],
    arrivalWindows: [
      {
        town: 'Colaba / South Mumbai',
        coordinates: [72.825, 18.906],
        windowStartMin: 25,
        windowEndMin: 50,
        probability: 85,
        primaryHazard: 'cloudburst',
        distanceKm: 26,
        alertLevel: 'RED',
        peakImpactDbz: 57
      },
      {
        town: 'Santacruz Airport & BKC',
        coordinates: [72.856, 19.088],
        windowStartMin: 30,
        windowEndMin: 55,
        probability: 90,
        primaryHazard: 'cloudburst',
        distanceKm: 28,
        alertLevel: 'RED',
        peakImpactDbz: 58
      },
      {
        town: 'Thane & Navi Mumbai',
        coordinates: [72.978, 19.218],
        windowStartMin: 45,
        windowEndMin: 75,
        probability: 78,
        primaryHazard: 'lightning',
        distanceKm: 46,
        alertLevel: 'ORANGE',
        peakImpactDbz: 53
      }
    ],
    lightningStrikes: [
      { id: 'L-401', coordinates: [72.64, 19.14], ageMin: 2.1, polarity: '-', peakCurrentKa: 41 }
    ]
  },
  bengaluru: {
    cells: [
      {
        id: 'CELL-BLR01',
        name: 'Kolar–Hoskote Thunderstorm Cell',
        coordinates: [77.82, 13.04],
        movementVector: { bearingDeg: 255, speedKmh: 28, directionLabel: 'WSW at 28 km/h' },
        severity: 'moderate',
        topHazards: ['lightning', 'downburst'],
        maxReflectivityDbz: 53.4,
        echoTopKm: 12.8,
        vilKgM2: 36.0,
        poshPercent: 20,
        deltaVKmh: 52,
        trend: 'intensifying',
        history30MinDbz: [40, 44, 47, 50, 52, 53.4],
        currentDbz: 53.4,
        rainfallRateMmH: 52,
        areaSqKm: 310,
        cloudTopTempC: -56.0
      }
    ],
    arrivalWindows: [
      {
        town: 'Whitefield Tech Corridor',
        coordinates: [77.750, 12.969],
        windowStartMin: 18,
        windowEndMin: 38,
        probability: 86,
        primaryHazard: 'lightning',
        distanceKm: 18,
        alertLevel: 'ORANGE',
        peakImpactDbz: 53
      },
      {
        town: 'KIAL Kempegowda Intl. Airport',
        coordinates: [77.706, 13.198],
        windowStartMin: 35,
        windowEndMin: 60,
        probability: 74,
        primaryHazard: 'downburst',
        distanceKm: 32,
        alertLevel: 'YELLOW',
        peakImpactDbz: 49
      },
      {
        town: 'Bengaluru Central / MG Road',
        coordinates: [77.608, 12.975],
        windowStartMin: 42,
        windowEndMin: 70,
        probability: 70,
        primaryHazard: 'lightning',
        distanceKm: 38,
        alertLevel: 'YELLOW',
        peakImpactDbz: 48
      }
    ],
    lightningStrikes: [
      { id: 'L-501', coordinates: [77.80, 13.02], ageMin: 1.8, polarity: '-', peakCurrentKa: 34 }
    ]
  }
};

export const SKILL_CURVE_DATA: SkillCurvePoint[] = [
  { leadTimeMin: 15, csiVajra: 0.82, csiPysteps: 0.79, fssVajra: 0.91, fssPysteps: 0.88 },
  { leadTimeMin: 30, csiVajra: 0.74, csiPysteps: 0.69, fssVajra: 0.85, fssPysteps: 0.78 },
  { leadTimeMin: 60, csiVajra: 0.63, csiPysteps: 0.51, fssVajra: 0.76, fssPysteps: 0.62 },
  { leadTimeMin: 90, csiVajra: 0.54, csiPysteps: 0.38, fssVajra: 0.69, fssPysteps: 0.49 },
  { leadTimeMin: 120, csiVajra: 0.47, csiPysteps: 0.28, fssVajra: 0.62, fssPysteps: 0.39 },
  { leadTimeMin: 180, csiVajra: 0.39, csiPysteps: 0.16, fssVajra: 0.54, fssPysteps: 0.24 },
  { leadTimeMin: 240, csiVajra: 0.34, csiPysteps: 0.08, fssVajra: 0.48, fssPysteps: 0.14 },
  { leadTimeMin: 300, csiVajra: 0.30, csiPysteps: 0.04, fssVajra: 0.43, fssPysteps: 0.08 },
  { leadTimeMin: 360, csiVajra: 0.27, csiPysteps: 0.02, fssVajra: 0.39, fssPysteps: 0.05 }
];
