import {
  StationMetadata,
  CanonicalObservation,
  EnvironmentalStateVector,
  AnomalyReport,
  CompoundEvent,
  RiskAssessment,
  ForecastPoint,
  ScenarioSimulationRequest,
  ScenarioSimulationResult,
  ActionRecommendation,
  AlertNotification
} from '@aquaguard/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api/v1${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${url} failed, using local fallback client`, err);
    throw err;
  }
}

export const api = {
  getStations: () => fetchJson<StationMetadata[]>('/stations'),
  getStation: (id: number) => fetchJson<StationMetadata>(`/stations/${id}`),
  getCurrentEnvironment: (stationId: number = 62) =>
    fetchJson<EnvironmentalStateVector>(`/environment/current?station_id=${stationId}`),
  getEnvironmentHistory: (stationId: number = 62, limit: number = 100) =>
    fetchJson<CanonicalObservation[]>(`/environment/history?station_id=${stationId}&limit=${limit}`),
  getAnomalies: (stationId: number = 62) =>
    fetchJson<AnomalyReport[]>(`/anomalies?station_id=${stationId}`),
  getCompoundEvents: (stationId: number = 62) =>
    fetchJson<CompoundEvent[]>(`/compound-events?station_id=${stationId}`),
  getCurrentRisks: (stationId: number = 62) =>
    fetchJson<RiskAssessment[]>(`/risk/current?station_id=${stationId}`),
  getForecast: (stationId: number = 62) =>
    fetchJson<ForecastPoint[]>(`/forecast?station_id=${stationId}`),
  runScenario: (params: ScenarioSimulationRequest) =>
    fetchJson<ScenarioSimulationResult>('/scenarios', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
  getActions: (stationId: number = 62) =>
    fetchJson<ActionRecommendation[]>(`/actions?station_id=${stationId}`),
  getAlerts: (stationId: number = 62) =>
    fetchJson<AlertNotification[]>(`/alerts?station_id=${stationId}`),
  updateAlertStatus: (alertId: string, status: string) =>
    fetchJson<{ status: string }>(`/alerts/${alertId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    }),
  queryCopilot: (query: string, stationId: number = 62) =>
    fetchJson<{
      answer: string;
      grounding_data: Record<string, unknown>;
      evidence: { label: string; value: string; source: string }[];
      suggested_actions: string[];
      recommended_scenario?: ScenarioSimulationRequest;
      generated_at: string;
    }>('/copilot/query', {
      method: 'POST',
      body: JSON.stringify({ query, station_id: stationId })
    }),
  getDataSources: (stationId: number = 62) =>
    fetchJson<Record<string, unknown>>(`/data-sources?station_id=${stationId}`),
  getSystemHealth: () =>
    fetchJson<Record<string, unknown>>('/system/health'),
  setSystemMode: (mode: 'LIVE' | 'DEMO') =>
    fetchJson<{ status: string; new_mode: string }>(`/system/mode?mode=${mode}`, {
      method: 'POST'
    })
};
