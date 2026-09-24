import {
  StationMetadata,
  EnvironmentalStateVector,
  RiskAssessment,
  ForecastPoint,
  ActionRecommendation,
  AlertNotification,
  DataHealthScore
} from '@aquaguard/shared-types';

export const fallbackStations: StationMetadata[] = [
  {
    id: 62,
    siteId: 62,
    instrumentId: 61,
    name: "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
    coordinates: [37.014528, -1.099736],
    elevationMeters: 1523.0,
    county: "Kiambu",
    project: "3D FEWSNET",
    affiliation: "NCAR / JKUAT JHUB Africa",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:32:05Z",
    isPrimaryConduit: true
  },
  {
    id: 11,
    siteId: 12,
    instrumentId: 11,
    name: "Kenya Meteorological Department Embu MET",
    coordinates: [37.45, -0.5],
    elevationMeters: 1493.0,
    county: "Embu",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:37:50Z",
    isPrimaryConduit: false
  },
  {
    id: 2,
    siteId: 2,
    instrumentId: 2,
    name: "Kenya Met Department Nairobi Met Garden",
    coordinates: [36.7601, -1.30172],
    elevationMeters: 1799.0,
    county: "Nairobi",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:30:00Z",
    isPrimaryConduit: false
  },
  {
    id: 9,
    siteId: 9,
    instrumentId: 9,
    name: "Kenya Meteorological Department Nakuru",
    coordinates: [36.1042656, -0.2706403],
    elevationMeters: 1900.0,
    county: "Nakuru",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:25:00Z",
    isPrimaryConduit: false
  },
  {
    id: 18,
    siteId: 18,
    instrumentId: 18,
    name: "Kenya Met Dept Eldoret Kapsoya",
    coordinates: [35.3077, 0.50975],
    elevationMeters: 2137.0,
    county: "Uasin Gishu",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:20:00Z",
    isPrimaryConduit: false
  },
  {
    id: 59,
    siteId: 59,
    instrumentId: 59,
    name: "Turkana West Kakuma Station",
    coordinates: [34.88797, 3.69984],
    elevationMeters: 625.0,
    county: "Turkana",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:15:00Z",
    isPrimaryConduit: false
  },
  {
    id: 50,
    siteId: 50,
    instrumentId: 50,
    name: "Kilifi Tsangatsini Station",
    coordinates: [39.455545, -3.719753],
    elevationMeters: 221.0,
    county: "Kilifi",
    project: "3D FEWSNET",
    affiliation: "Kenya Meteorological Department",
    status: "ONLINE",
    lastObservationTime: "2026-09-24T11:10:00Z",
    isPrimaryConduit: false
  }
];

export const fallbackDataHealth: DataHealthScore = {
  overall: 96.4,
  completeness: 98.5,
  freshness: 97.0,
  consistency: 95.2,
  sensorCoverage: 94.8,
  lastSyncTime: "2026-09-24T11:32:05Z",
  activeSensors: 23,
  totalSensors: 24,
  status: "EXCELLENT"
};

export const fallbackEnvironment: EnvironmentalStateVector = {
  timestamp: "2026-09-24T11:32:05Z",
  stationId: 62,
  stationName: "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
  rainfallCurrentMm: 0.0,
  rainfallBaselineMm: 42.5,
  rainfallAnomalyPct: -100.0,
  temperatureCurrentC: 30.1,
  temperatureBaselineC: 21.8,
  temperatureAnomalyC: 8.3,
  soilMoistureCurrentPct: 19.5,
  soilMoistureBaselinePct: 33.5,
  soilMoistureAnomalyPct: -41.8,
  humidityCurrentPct: 31.7,
  humidityBaselinePct: 67.0,
  vegetationCurrentNdvi: 0.38,
  vegetationBaselineNdvi: 0.46,
  vegetationAnomalyPct: -17.4,
  evapotranspirationMmDay: 4.62,
  waterBalanceDeficitMm: -4.62,
  confidence: 0.88,
  dataHealth: fallbackDataHealth
};

export const fallbackRisks: RiskAssessment[] = [
  {
    category: "DROUGHT",
    probabilityPct: 78.4,
    severity: "HIGH",
    confidencePct: 84.0,
    horizon: "7-14 days",
    drivers: [
      {
        factor: "Rainfall Deficit",
        currentValue: "0.0 mm",
        baselineValue: "42.5 mm",
        deviation: "-100%",
        weightPct: 35.0,
        contributionPct: 44.6,
        status: "DEFICIT"
      },
      {
        factor: "Soil Moisture Depletion",
        currentValue: "19.5%",
        baselineValue: "33.5%",
        deviation: "-41.8%",
        weightPct: 30.0,
        contributionPct: 32.1,
        status: "DEFICIT"
      },
      {
        factor: "Thermal Evaporative Surge",
        currentValue: "30.1°C",
        baselineValue: "21.8°C",
        deviation: "+8.3°C",
        weightPct: 15.0,
        contributionPct: 12.8,
        status: "ELEVATED"
      },
      {
        factor: "Vegetation Vigor Deficit",
        currentValue: "0.38",
        baselineValue: "0.46",
        deviation: "-17.4%",
        weightPct: 15.0,
        contributionPct: 10.5,
        status: "DEFICIT"
      }
    ],
    evidence: [
      "Conduit dual rain gauges recorded 0.0 mm precipitation over monitoring window.",
      "Root-zone soil moisture collapsed to 19.5% (approaching permanent wilting point).",
      "Hargreaves-Samani potential evapotranspiration is 4.62 mm/day."
    ],
    affectedArea: {
      name: "Kiambu County & Juja Agro-ecological Catchment",
      latitude: -1.099736,
      longitude: 37.014528,
      radiusKm: 25.0
    },
    recommendedActionsCount: 4,
    modelVersion: "AQUAGUARD-RISK-v0.3",
    generatedAt: "2026-09-24T11:32:05Z",
    whyExplanation: [
      "Conduit rain gauges indicate persistent zero rainfall (0.0 mm), creating a 100% meteorological deficit.",
      "Root-zone soil moisture is depleted to 19.5% (41.8% below seasonal normal).",
      "High atmospheric vapor pressure deficit is desiccating crop canopies."
    ]
  },
  {
    category: "WATER_STRESS",
    probabilityPct: 78.5,
    severity: "HIGH",
    confidencePct: 88.0,
    horizon: "Immediate to 7 days",
    drivers: [
      {
        factor: "Water Balance Deficit",
        currentValue: "-4.62 mm/day",
        baselineValue: "-0.5 mm/day",
        deviation: "-824%",
        weightPct: 40.0,
        contributionPct: 48.0,
        status: "DEFICIT"
      },
      {
        factor: "Soil Storage Deficit",
        currentValue: "19.5%",
        baselineValue: "33.5%",
        deviation: "-41.8%",
        weightPct: 35.0,
        contributionPct: 36.0,
        status: "DEFICIT"
      }
    ],
    evidence: [
      "Net daily hydrological balance: -4.62 mm/day depletion",
      "Relative humidity dipped to 31.7% during peak heat hours"
    ],
    affectedArea: {
      name: "Juja Irrigation & Local Catchment Zone",
      latitude: -1.099736,
      longitude: 37.014528,
      radiusKm: 18.0
    },
    recommendedActionsCount: 3,
    modelVersion: "AQUAGUARD-RISK-v0.3",
    generatedAt: "2026-09-24T11:32:05Z",
    whyExplanation: [
      "Evaporative demand outstrips ground water replenishment.",
      "Shallow reservoir retention decreasing by ~2.1% daily."
    ]
  },
  {
    category: "HEAT",
    probabilityPct: 58.0,
    severity: "MEDIUM",
    confidencePct: 91.0,
    horizon: "Midday window (11:30 - 15:30)",
    drivers: [
      {
        factor: "Wet Bulb Globe Temp",
        currentValue: "22.7°C",
        baselineValue: "18.0°C",
        deviation: "+4.7°C",
        weightPct: 60.0,
        contributionPct: 65.0,
        status: "ELEVATED"
      }
    ],
    evidence: [
      "Conduit WBGT reading: 22.7°C",
      "Heat Index reading: 28.9°C"
    ],
    affectedArea: {
      name: "JKUAT Field Stations & Outdoor Labor Corridors",
      latitude: -1.099736,
      longitude: 37.014528,
      radiusKm: 10.0
    },
    recommendedActionsCount: 2,
    modelVersion: "AQUAGUARD-RISK-v0.3",
    generatedAt: "2026-09-24T11:32:05Z",
    whyExplanation: [
      "Thermal comfort thresholds warrant hydration and rest schedules for manual fieldwork."
    ]
  },
  {
    category: "FLOOD",
    probabilityPct: 4.0,
    severity: "LOW",
    confidencePct: 94.0,
    horizon: "7 days",
    drivers: [
      {
        factor: "Cumulative Rainfall",
        currentValue: "0.0 mm",
        baselineValue: "42.5 mm",
        deviation: "Zero Accumulation",
        weightPct: 70.0,
        contributionPct: 90.0,
        status: "NORMAL"
      }
    ],
    evidence: ["Dry antecedent soil storage provides high absorption capacity."],
    affectedArea: {
      name: "Thika River Basin Lowlands",
      latitude: -1.099736,
      longitude: 37.014528,
      radiusKm: 25.0
    },
    recommendedActionsCount: 1,
    modelVersion: "AQUAGUARD-RISK-v0.3",
    generatedAt: "2026-09-24T11:32:05Z",
    whyExplanation: ["Infiltration capacity remains high with zero localized flood vulnerability."]
  }
];

export const fallbackActions: ActionRecommendation[] = [
  {
    id: "ACT-IMM-01",
    title: "Prioritize Targeted Deficit Irrigation for High-Value Crops",
    urgency: "IMMEDIATE",
    category: "WATER_STRESS",
    reason: "Root-zone moisture is critically depleted to ~19.5% with high atmospheric vapor pressure deficit.",
    evidence: [
      "Conduit rain gauges: 0.0 mm precipitation",
      "Current soil moisture: 19.5% (-41.8% vs seasonal baseline)",
      "Daily evapotranspiration rate: 4.62 mm/day"
    ],
    expectedEffect: "Preserves xylem water potential and prevents irreversible leaf senescence in horticultural plots.",
    avoidedLossEstimate: "Avoids estimated 25-35% localized harvest loss across 400 hectares.",
    confidence: 0.89,
    targetSector: "AGRICULTURE",
    status: "PENDING"
  },
  {
    id: "ACT-24H-01",
    title: "Inspect & Seal Agricultural Water Storage & Off-stream Reservoirs",
    urgency: "NEXT 24 HOURS",
    category: "WATER_STRESS",
    reason: "Elevated daytime temperatures (+8.3°C above baseline) will accelerate surface evaporative loss by up to 28%.",
    evidence: [
      "SHT peak daytime temperature: 30.1°C",
      "Relative humidity dipped below 32%"
    ],
    expectedEffect: "Reduces evaporative open-water loss by 22% using shade cloth covers and leak containment.",
    avoidedLossEstimate: "Saves approximately 120,000 liters/day across community storage points.",
    confidence: 0.86,
    targetSector: "WATER_RESOURCES",
    status: "PENDING"
  },
  {
    id: "ACT-7D-01",
    title: "Delay Water-Intensive Field Seeding until Short Rains Onset",
    urgency: "NEXT 7 DAYS",
    category: "DROUGHT",
    reason: "14-day weather forecast indicates dry continuation (<5 mm total rainfall) before regional synoptic convergence.",
    evidence: [
      "Numerical weather prediction indicates dry north-easterly flow prevailing",
      "Drought probability remains elevated at 78-85%"
    ],
    expectedEffect: "Prevents premature germination failure and seed investment loss.",
    avoidedLossEstimate: "Protects smallholder input capital of ~$45/acre across community cooperatives.",
    confidence: 0.82,
    targetSector: "AGRICULTURE",
    status: "PENDING"
  },
  {
    id: "ACT-HEAT-01",
    title: "Enact Agricultural Labor Heat Safety Protocols (11:30 - 15:00)",
    urgency: "IMMEDIATE",
    category: "HEAT",
    reason: "Wet Bulb Globe Temperature (22.7°C) exceeds continuous physical labor caution threshold.",
    evidence: [
      "Conduit WBGT reading: 22.7°C",
      "Solar UV index: 3.1"
    ],
    expectedEffect: "Prevents heat exhaustion and worker dehydration incidents.",
    avoidedLossEstimate: "Ensures workforce safety compliance for over 650 field workers.",
    confidence: 0.94,
    targetSector: "COMMUNITY",
    status: "PENDING"
  }
];

export const fallbackAlerts: AlertNotification[] = [
  {
    id: "ALT-01",
    title: "Compound Agricultural & Hydrological Water Stress Detected",
    category: "WATER_STRESS",
    severity: "HIGH",
    detectedAt: "2026-09-24T11:32:05Z",
    message: "Dual rain gauges recorded 0.0 mm precipitation while root-zone soil moisture collapsed to 19.5% with daytime thermal peaks.",
    recommendedAction: "Activate deficit irrigation schedules and inspect reservoir storage.",
    status: "ACTIVE",
    stationName: "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
    stationId: 62
  },
  {
    id: "ALT-02",
    title: "Thermal Labor Comfort Threshold Approaching Caution",
    category: "HEAT",
    severity: "MEDIUM",
    detectedAt: "2026-09-24T11:32:05Z",
    message: "WBGT sensor registered 22.7°C with Solar UV Index 3.1. Midday outdoor labor limits recommended.",
    recommendedAction: "Implement shade breaks and worker hydration mandates.",
    status: "ACTIVE",
    stationName: "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
    stationId: 62
  }
];

export const fallbackForecast: ForecastPoint[] = [
  {
    horizon: "NOW",
    timestamp: "2026-09-24T11:32:05Z",
    rainfallExpectedMm: 0.0,
    rainfallLowerMm: 0.0,
    rainfallUpperMm: 0.0,
    temperatureExpectedC: 30.1,
    temperatureLowerC: 29.6,
    temperatureUpperC: 30.6,
    soilMoistureExpectedPct: 19.5,
    soilMoistureLowerPct: 19.0,
    soilMoistureUpperPct: 20.0,
    droughtProbabilityPct: 78.4,
    confidencePct: 95.0
  },
  {
    horizon: "24H",
    timestamp: "2026-09-25T11:32:05Z",
    rainfallExpectedMm: 0.2,
    rainfallLowerMm: 0.0,
    rainfallUpperMm: 1.5,
    temperatureExpectedC: 30.5,
    temperatureLowerC: 29.3,
    temperatureUpperC: 32.5,
    soilMoistureExpectedPct: 18.9,
    soilMoistureLowerPct: 18.0,
    soilMoistureUpperPct: 19.7,
    droughtProbabilityPct: 80.0,
    confidencePct: 90.0
  },
  {
    horizon: "3D",
    timestamp: "2026-09-27T11:32:05Z",
    rainfallExpectedMm: 1.1,
    rainfallLowerMm: 0.0,
    rainfallUpperMm: 3.8,
    temperatureExpectedC: 30.9,
    temperatureLowerC: 29.1,
    temperatureUpperC: 33.7,
    soilMoistureExpectedPct: 18.0,
    soilMoistureLowerPct: 16.7,
    soilMoistureUpperPct: 19.5,
    droughtProbabilityPct: 82.5,
    confidencePct: 84.0
  },
  {
    horizon: "7D",
    timestamp: "2026-10-01T11:32:05Z",
    rainfallExpectedMm: 3.5,
    rainfallLowerMm: 0.5,
    rainfallUpperMm: 9.2,
    temperatureExpectedC: 31.3,
    temperatureLowerC: 28.8,
    temperatureUpperC: 35.1,
    soilMoistureExpectedPct: 16.3,
    soilMoistureLowerPct: 14.5,
    soilMoistureUpperPct: 18.2,
    droughtProbabilityPct: 85.0,
    confidencePct: 76.0
  },
  {
    horizon: "14D",
    timestamp: "2026-10-08T11:32:05Z",
    rainfallExpectedMm: 8.4,
    rainfallLowerMm: 2.0,
    rainfallUpperMm: 21.0,
    temperatureExpectedC: 31.6,
    temperatureLowerC: 28.1,
    temperatureUpperC: 36.1,
    soilMoistureExpectedPct: 14.7,
    soilMoistureLowerPct: 12.0,
    soilMoistureUpperPct: 17.5,
    droughtProbabilityPct: 87.5,
    confidencePct: 68.0
  }
];
