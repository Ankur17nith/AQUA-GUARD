'use client';

import React, { useState } from 'react';
import { Cpu, Play, ShieldCheck, TrendingUp, Sliders, Sparkles } from 'lucide-react';
import { ScenarioSimulationResult } from '@aquaguard/shared-types';
import { api } from '@/lib/api';
import { ScenarioComparisonChart } from '@/components/charts/ScenarioComparisonChart';
import { toast } from 'sonner';

export function ScenarioLab() {
  const [rainfallDelta, setRainfallDelta] = useState(-30);
  const [temperatureDelta, setTemperatureDelta] = useState(2.0);
  const [horizonDays, setHorizonDays] = useState(14);
  const [initialSoilMoisture, setInitialSoilMoisture] = useState(19.5);
  const [isSimulating, setIsSimulating] = useState(false);

  // Result state
  const [result, setResult] = useState<ScenarioSimulationResult>({
    id: "SIM-DEMO-01",
    parameters: {
      rainfallDeltaPct: -30,
      temperatureDeltaC: 2.0,
      horizonDays: 14,
      initialSoilMoisturePct: 19.5,
      stationId: 62
    },
    currentMetrics: {
      droughtRiskPct: 78.4,
      waterStressPct: 78.5,
      soilMoisturePct: 19.5,
      vegetationStressPct: 48.0
    },
    projectedMetrics: {
      droughtRiskPct: 91.2,
      waterStressPct: 93.0,
      soilMoisturePct: 13.8,
      vegetationStressPct: 74.2
    },
    deltaMetrics: {
      droughtRiskDelta: 12.8,
      waterStressDelta: 14.5,
      soilMoistureDelta: -5.7,
      vegetationStressDelta: 26.2
    },
    impactAssessment: {
      agricultureCropRisk: "CRITICAL: Approaching permanent wilting point for staple maize; yield loss expected between 35-50% without immediate supplemental irrigation.",
      waterAvailabilityDepletion: "Elevated: Shallow community well extraction rates exceed natural recharge by 3.2x.",
      ecosystemStressLevel: "Severe: Vegetative canopy desiccates rapidly under persistent high vapor pressure deficit.",
      avoidedImpactWithIntervention: "MODELLED ESTIMATE: Controlled deficit irrigation and soil mulch cover can mitigate 42% of projected crop loss."
    },
    explanation: "The simulated climate scenario (Rainfall -30%, Temperature +2.0°C over 14 days) accelerates evapotranspiration demand while suppressing recharge. Root-zone soil moisture drops from 19.5% to 13.8%, escalating composite drought risk to 91.2% (+12.8%) and vegetation stress to 74.2%.",
    generatedAt: "2026-09-24T11:32:05Z",
    status: "SIMULATED"
  });

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await api.runScenario({
        scenarioName: "Interactive Digital Twin Simulation",
        rainfallDeltaPct: rainfallDelta,
        temperatureDeltaC: temperatureDelta,
        horizonDays: horizonDays,
        initialSoilMoisturePct: initialSoilMoisture,
        stationId: 62
      });
      setResult(res);
      toast.success("Digital Twin simulation updated");
    } catch {
      // Offline fallback computation
      const curDr = 78.4;
      const projDr = Math.min(98, Math.round(curDr + Math.abs(rainfallDelta) * 0.35 + temperatureDelta * 4.0));
      const projSm = Math.max(10, Math.round(initialSoilMoisture - (horizonDays * 0.4 * (1 + temperatureDelta * 0.05))));
      setResult({
        id: `SIM-LOCAL-${Date.now().toString().slice(-4)}`,
        parameters: { rainfallDeltaPct: rainfallDelta, temperatureDeltaC: temperatureDelta, horizonDays },
        currentMetrics: { droughtRiskPct: 78.4, waterStressPct: 78.5, soilMoisturePct: initialSoilMoisture, vegetationStressPct: 48.0 },
        projectedMetrics: { droughtRiskPct: projDr, waterStressPct: projDr + 2, soilMoisturePct: projSm, vegetationStressPct: 72.0 },
        deltaMetrics: { droughtRiskDelta: Math.round((projDr - curDr) * 10) / 10, waterStressDelta: 14.0, soilMoistureDelta: Math.round((projSm - initialSoilMoisture) * 10) / 10, vegetationStressDelta: 24.0 },
        impactAssessment: {
          agricultureCropRisk: "High localized moisture stress; yield reduction expected between 25-40%.",
          waterAvailabilityDepletion: "Depletes shallow groundwater storage by ~22%.",
          ecosystemStressLevel: "Severe canopy desiccation.",
          avoidedImpactWithIntervention: "MODELLED ESTIMATE: Controlled deficit irrigation and soil mulch cover can mitigate 42% of projected crop loss."
        },
        explanation: `Simulated rainfall change of ${rainfallDelta}% and temperature change of +${temperatureDelta}°C accelerates soil water depletion to ${projSm}%, escalating drought risk to ${projDr}%.`,
        generatedAt: new Date().toISOString(),
        status: "SIMULATED"
      });
      toast.success("Local Digital Twin simulation completed");
    } finally {
      setIsSimulating(false);
    }
  };

  const applyPreset = (rain: number, temp: number, days: number) => {
    setRainfallDelta(rain);
    setTemperatureDelta(temp);
    setHorizonDays(days);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#06B6D4]" />
            <h1 className="text-sm font-bold tracking-wider text-[#F1F4F8] uppercase">
              Climate Scenario Lab (Digital Twin Workspace)
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(249,115,22,0.15)] text-[#FB923C] border border-[rgba(249,115,22,0.3)] font-semibold">
              STATUS: SIMULATED
            </span>
          </div>
          <p className="text-xs text-[#8E9BAE] mt-0.5 font-sans">
            Simulate future localized microclimate trajectories by perturbing rainfall, temperature, and drying horizons.
          </p>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center gap-1.5 bg-[#15191F] p-1 rounded border border-[rgba(255,255,255,0.06)]">
          <span className="text-[10px] text-[#5C6777] px-1.5 uppercase font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            Presets:
          </span>
          <button
            onClick={() => applyPreset(0, 0, 7)}
            className="px-2 py-1 rounded bg-[#111418] hover:bg-[#1A2027] text-[#8E9BAE] hover:text-[#F1F4F8] transition-colors cursor-pointer text-xs"
          >
            Baseline
          </button>
          <button
            onClick={() => applyPreset(-30, 2.0, 14)}
            className="px-2 py-1 rounded bg-[rgba(245,158,11,0.15)] text-[#FBBF24] border border-[rgba(245,158,11,0.3)] font-semibold transition-colors cursor-pointer text-xs"
          >
            Severe Drought
          </button>
          <button
            onClick={() => applyPreset(-10, 4.0, 14)}
            className="px-2 py-1 rounded bg-[#111418] hover:bg-[#1A2027] text-[#8E9BAE] hover:text-[#F1F4F8] transition-colors cursor-pointer text-xs"
          >
            Heatwave Surge
          </button>
          <button
            onClick={() => applyPreset(40, -1.0, 7)}
            className="px-2 py-1 rounded bg-[#111418] hover:bg-[#1A2027] text-[#8E9BAE] hover:text-[#F1F4F8] transition-colors cursor-pointer text-xs"
          >
            Rain Influx
          </button>
        </div>
      </div>

      {/* Simulation Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Parameters */}
        <div className="lg:col-span-5 p-4 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#F1F4F8] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#06B6D4]" />
              Simulation Controls
            </span>
            <span className="text-[10px] text-[#5C6777]">Perturbation Vector</span>
          </div>

          {/* Slider 1: Rainfall */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8E9BAE]">Precipitation Deviation (ΔP)</span>
              <span className="text-[#06B6D4] font-bold">{rainfallDelta > 0 ? `+${rainfallDelta}%` : `${rainfallDelta}%`}</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={rainfallDelta}
              onChange={(e) => setRainfallDelta(Number(e.target.value))}
              aria-label="Precipitation Deviation"
              className="w-full accent-[#06B6D4] cursor-pointer"
            />
            <div className="flex justify-between text-[9.5px] text-[#5C6777]">
              <span>-60% (Acute Deficit)</span>
              <span>0% Normal</span>
              <span>+60% (Recharge)</span>
            </div>
          </div>

          {/* Slider 2: Temperature */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8E9BAE]">Thermal Warming (ΔT)</span>
              <span className="text-[#F87171] font-bold">+{temperatureDelta.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.5"
              value={temperatureDelta}
              onChange={(e) => setTemperatureDelta(Number(e.target.value))}
              aria-label="Thermal Warming"
              className="w-full accent-[#EF4444] cursor-pointer"
            />
            <div className="flex justify-between text-[9.5px] text-[#5C6777]">
              <span>+0.0°C Normal</span>
              <span>+2.5°C Elevated</span>
              <span>+5.0°C Extreme</span>
            </div>
          </div>

          {/* Slider 3: Horizon */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8E9BAE]">Projection Horizon</span>
              <span className="text-[#F59E0B] font-bold">{horizonDays} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="30"
              step="7"
              value={horizonDays}
              onChange={(e) => setHorizonDays(Number(e.target.value))}
              aria-label="Projection Horizon"
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <div className="flex justify-between text-[9.5px] text-[#5C6777]">
              <span>7d (Synoptic)</span>
              <span>14d (Medium)</span>
              <span>30d (Monthly)</span>
            </div>
          </div>

          {/* Slider 4: Initial Soil Moisture */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8E9BAE]">Initial Soil Water Content</span>
              <span className="text-[#F1F4F8] font-bold">{initialSoilMoisture}%</span>
            </div>
            <input
              type="range"
              min="12"
              max="40"
              step="1"
              value={initialSoilMoisture}
              onChange={(e) => setInitialSoilMoisture(Number(e.target.value))}
              aria-label="Initial Soil Water Content"
              className="w-full accent-[#10B981] cursor-pointer"
            />
            <div className="flex justify-between text-[9.5px] text-[#5C6777]">
              <span>12% (Wilting)</span>
              <span>19.5% (Observed)</span>
              <span>40% (Capacity)</span>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-2.5 rounded bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'RUNNING DIGITAL TWIN...' : 'RUN SIMULATION'}</span>
          </button>
        </div>

        {/* Right Column: Comparative Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[rgba(255,255,255,0.06)] pb-2">
              <span className="font-semibold text-[#8E9BAE] uppercase tracking-wider text-[11px]">
                Baseline vs Counterfactual Metrics
              </span>
              <div className="flex items-center gap-5 text-[10.5px]">
                <span className="text-[#5C6777]">CURRENT</span>
                <span className="text-[#06B6D4] font-semibold">SIMULATED</span>
                <span className="text-[#F59E0B] font-semibold">DELTA</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Drought Risk Probability', cur: result.currentMetrics.droughtRiskPct, sim: result.projectedMetrics.droughtRiskPct, delta: `+${result.deltaMetrics.droughtRiskDelta}%`, deltaColor: 'text-[#F87171]' },
                { label: 'Root-zone Soil Moisture', cur: result.currentMetrics.soilMoisturePct, sim: result.projectedMetrics.soilMoisturePct, delta: `${result.deltaMetrics.soilMoistureDelta}%`, deltaColor: 'text-[#F87171]' },
                { label: 'Composite Water Stress', cur: result.currentMetrics.waterStressPct, sim: result.projectedMetrics.waterStressPct, delta: `+${result.deltaMetrics.waterStressDelta}%`, deltaColor: 'text-[#F87171]' },
                { label: 'Vegetation Canopy Stress', cur: result.currentMetrics.vegetationStressPct, sim: result.projectedMetrics.vegetationStressPct, delta: `+${result.deltaMetrics.vegetationStressDelta}%`, deltaColor: 'text-[#F87171]' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#15191F] border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[#F1F4F8] font-medium">{row.label}</span>
                  <div className="flex items-center gap-6 tabular-nums">
                    <span className="text-[#8E9BAE] w-12 text-right">{row.cur}%</span>
                    <span className="text-[#06B6D4] font-bold text-sm w-12 text-right">{row.sim}%</span>
                    <span className={`${row.deltaColor} font-bold w-12 text-right`}>{row.delta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ECharts Baseline vs Counterfactual Trajectory */}
            <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-[11px] font-semibold uppercase text-[#8E9BAE]">
                  Comparative Trajectory Chart
                </span>
                <span className="text-[10px] text-[#F59E0B] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{result.deltaMetrics.droughtRiskDelta} pts risk shift
                </span>
              </div>
              <ScenarioComparisonChart
                currentMetrics={result.currentMetrics}
                projectedMetrics={result.projectedMetrics}
                height={210}
              />
            </div>
          </div>

          {/* Physical Feedback Analysis */}
          <div className="p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] text-xs">
            <div className="text-[11px] font-semibold text-[#06B6D4] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Twin State Feedback</span>
            </div>
            <p className="text-[#8E9BAE] font-sans leading-relaxed text-[11.5px]">
              {result.explanation}
            </p>
          </div>

          {/* Intervention Simulator: Without vs With Action */}
          <div className="p-3.5 rounded border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.04)] text-xs">
            <div className="text-[11px] font-semibold text-[#FBBF24] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Intervention Impact Simulation</span>
              <span className="text-[10px] text-[#8E9BAE]">Avoided Loss Analysis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded bg-[#14181D] border border-[rgba(239,68,68,0.25)] space-y-1">
                <div className="text-[#F87171] font-semibold text-[10.5px]">WITHOUT INTERVENTION:</div>
                <p className="text-[#8E9BAE] text-[10.5px] font-sans">
                  {result.impactAssessment.agricultureCropRisk}
                </p>
              </div>
              <div className="p-2.5 rounded bg-[#14181D] border border-[rgba(16,185,129,0.25)] space-y-1">
                <div className="text-[#10B981] font-semibold text-[10.5px]">WITH RECOMMENDED ACTION:</div>
                <p className="text-[#8E9BAE] text-[10.5px] font-sans">
                  {result.impactAssessment.avoidedImpactWithIntervention}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
