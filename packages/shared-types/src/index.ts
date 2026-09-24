/**
 * AQUA//GUARD Canonical Domain Types
 * Shared between FastAPI backend, Next.js frontend, and ML pipeline.
 */

export type DataStatus = 'OBSERVED' | 'DERIVED' | 'FORECAST' | 'MODELLED' | 'SIMULATED' | 'CACHED';

export type QualityFlag = 'VALID' | 'SUSPECT' | 'ESTIMATED' | 'OUTLIER' | 'DROPOUT';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskCategory = 'DROUGHT' | 'FLOOD' | 'HEAT' | 'WATER_STRESS' | 'VEGETATION_STRESS';

export type ActionUrgency = 'IMMEDIATE' | 'NEXT 24 HOURS' | 'NEXT 7 DAYS' | 'MONITOR';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SNOOZED';

export interface ProvenanceRecord {
  source: string;
  stationId: string | number;
  timestamp: string;
  rawValue?: number | null;
  normalizedValue?: number | null;
  unit: string;
  calculationMethod?: string;
  modelVersion?: string;
  quality: QualityFlag;
}

export interface StationMetadata {
  id: number;
  siteId: number;
  instrumentId: number;
  name: string;
  coordinates: [number, number]; // [lon, lat]
  elevationMeters: number;
  county: string;
  project: string;
  affiliation: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastObservationTime: string;
  isPrimaryConduit: boolean;
}

export interface CanonicalObservation {
  id?: string;
  stationId: number;
  stationName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  
  // Precipitation (mm)
  rainfallGauge1: number;
  rainfallGauge2: number;
  rainfallTotalToday: number;
  rainfallTotalPrior: number;
  
  // Temperature (°C)
  temperatureBmx: number;
  temperatureMcp: number;
  temperatureSht: number;
  wetBulbTemp: number;
  wetBulbGlobeTemp: number;
  heatIndex: number;
  
  // Atmosphere & Humidity
  pressureHpa: number;
  relativeHumidityPct: number;
  
  // Solar Irradiance
  solarVisible: number;
  solarInfrared: number;
  solarUvIndex: number;
  
  // Wind
  windSpeedMs: number;
  windDirectionDeg: number;
  windGustMs: number;
  
  // Derived / Sensor fusion (Proxies aligned with satellite & baseline)
  soilMoisturePct?: number; // Estimated from water balance / satellite fusion
  vegetationNdvi?: number;  // Earth observation fusion
  
  // Diagnostic Health
  batteryChargeStatus: number;
  cellSignalStrengthPct: number;
  systemHealthCode: number;
  
  source: string;
  status: DataStatus;
  quality: QualityFlag;
}

export interface DataHealthScore {
  overall: number; // 0 - 100
  completeness: number;
  freshness: number;
  consistency: number;
  sensorCoverage: number;
  lastSyncTime: string;
  activeSensors: number;
  totalSensors: number;
  status: 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'CRITICAL';
}

export interface EnvironmentalStateVector {
  timestamp: string;
  stationId: number;
  stationName: string;
  rainfallCurrentMm: number;
  rainfallBaselineMm: number;
  rainfallAnomalyPct: number;
  
  temperatureCurrentC: number;
  temperatureBaselineC: number;
  temperatureAnomalyC: number;
  
  soilMoistureCurrentPct: number;
  soilMoistureBaselinePct: number;
  soilMoistureAnomalyPct: number;
  
  humidityCurrentPct: number;
  humidityBaselinePct: number;
  
  vegetationCurrentNdvi: number;
  vegetationBaselineNdvi: number;
  vegetationAnomalyPct: number;
  
  evapotranspirationMmDay: number;
  waterBalanceDeficitMm: number;
  
  confidence: number;
  dataHealth: DataHealthScore;
}

export interface AnomalyReport {
  id: string;
  stationId: number;
  variable: string;
  currentValue: number;
  baselineValue: number;
  zScore: number;
  deviationPct: number;
  severity: RiskSeverity;
  detectedAt: string;
  method: 'Z_SCORE' | 'PERCENTILE_IQR' | 'ISOLATION_FOREST';
  description: string;
}

export interface CompoundEvent {
  id: string;
  type: 'COMPOUND_WATER_STRESS' | 'FLASH_FLOOD_PRECURSOR' | 'EXTREME_HEAT_DROUGHT' | 'VEGETATION_DESICCATION';
  title: string;
  severity: RiskSeverity;
  confidence: number;
  detectedAt: string;
  contributingFactors: {
    factor: string;
    signal: string;
    impactWeight: number;
    value: string;
  }[];
  description: string;
  evidence: string[];
}

export interface RiskDriver {
  factor: string;
  currentValue: number | string;
  baselineValue: number | string;
  deviation: string;
  weightPct: number;
  contributionPct: number;
  status: 'ELEVATED' | 'DEFICIT' | 'NORMAL';
}

export interface RiskAssessment {
  category: RiskCategory;
  probabilityPct: number;
  severity: RiskSeverity;
  confidencePct: number;
  horizon: string;
  drivers: RiskDriver[];
  evidence: string[];
  affectedArea: {
    name: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  recommendedActionsCount: number;
  modelVersion: string;
  generatedAt: string;
  whyExplanation: string[];
}

export interface ForecastPoint {
  horizon: 'NOW' | '24H' | '3D' | '7D' | '14D';
  timestamp: string;
  rainfallExpectedMm: number;
  rainfallLowerMm: number;
  rainfallUpperMm: number;
  temperatureExpectedC: number;
  temperatureLowerC: number;
  temperatureUpperC: number;
  soilMoistureExpectedPct: number;
  soilMoistureLowerPct: number;
  soilMoistureUpperPct: number;
  droughtProbabilityPct: number;
  confidencePct: number;
}

export interface ScenarioSimulationRequest {
  scenarioName?: string;
  rainfallDeltaPct: number; // e.g. -30 for 30% drop
  temperatureDeltaC: number; // e.g. +2.0
  horizonDays: number; // 7, 14, 21, 30
  initialSoilMoisturePct?: number;
  stationId?: number;
}

export interface ScenarioSimulationResult {
  id: string;
  parameters: ScenarioSimulationRequest;
  currentMetrics: {
    droughtRiskPct: number;
    waterStressPct: number;
    soilMoisturePct: number;
    vegetationStressPct: number;
  };
  projectedMetrics: {
    droughtRiskPct: number;
    waterStressPct: number;
    soilMoisturePct: number;
    vegetationStressPct: number;
  };
  deltaMetrics: {
    droughtRiskDelta: number;
    waterStressDelta: number;
    soilMoistureDelta: number;
    vegetationStressDelta: number;
  };
  impactAssessment: {
    agricultureCropRisk: string;
    waterAvailabilityDepletion: string;
    ecosystemStressLevel: string;
    avoidedImpactWithIntervention: string;
  };
  explanation: string;
  generatedAt: string;
  status: 'SIMULATED';
}

export interface ActionRecommendation {
  id: string;
  title: string;
  urgency: ActionUrgency;
  category: RiskCategory;
  reason: string;
  evidence: string[];
  expectedEffect: string;
  avoidedLossEstimate: string;
  confidence: number;
  targetSector: 'AGRICULTURE' | 'WATER_RESOURCES' | 'COMMUNITY' | 'INFRASTRUCTURE';
  status: 'PENDING' | 'IN_PROGRESS' | 'EXECUTED';
}

export interface AlertNotification {
  id: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  detectedAt: string;
  message: string;
  recommendedAction: string;
  status: AlertStatus;
  stationName: string;
  stationId: number;
}

export interface GuardianToolCall {
  tool: string;
  args: Record<string, unknown>;
  output: unknown;
}

export interface GuardianMessage {
  id: string;
  sender: 'USER' | 'GUARDIAN';
  timestamp: string;
  content: string;
  toolCalls?: GuardianToolCall[];
  evidence?: {
    label: string;
    value: string;
    source: string;
  }[];
  suggestedActions?: string[];
  scenarioPreset?: ScenarioSimulationRequest;
}

export interface ModelCard {
  name: string;
  version: string;
  task: string;
  architecture: string;
  features: string[];
  trainingData: string;
  metrics: {
    mae?: number;
    rmse?: number;
    r2?: number;
    f1Score?: number;
    precision?: number;
    recall?: number;
  };
  limitations: string[];
  scientificAssumptions: string[];
  lastUpdated: string;
}
