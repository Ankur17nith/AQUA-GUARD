'use client';

import React, { useState } from 'react';
import { Cpu, Play, ShieldCheck, TrendingUp } from 'lucide-react';
import { ScenarioSimulationResult } from '@aquaguard/shared-types';
import { api } from '@/lib/api';
import { ScenarioComparisonChart } from '@/components/charts/ScenarioComparisonChart';

export function ScenarioLab() {
  const [rainfallDelta, setRainfallDelta] = useState(-30);
  const [temperatureDelta, setTemperatureDelta] = useState(2.0);
  const [horizonDays, setHorizonDays] = useState(14);
  const [initialSoilMoisture, setInitialSoilMoisture] = useState(19.5);
  const [isSimulating, setIsSimulating] = useState(false);

  // Result state (seeded with severe drought baseline result)
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
    } finally {
      setIsSimulating(false);
    }
  };

  // Presets
  const applyPreset = (rain: number, temp: number, days: number) => {
    setRainfallDelta(rain);
    setTemperatureDelta(temp);
    setHorizonDays(days);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold tracking-wider text-slate-100 uppercase">
              Climate Scenario Lab (Digital Twin Engine)
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              MODELLED SCENARIOS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Simulate future localized risk trajectories by perturbing Conduit precipitation, atmospheric temperatures, and drying horizon.
          </p>
        </div>

        {/* Preset Selector (Requirement #78, #79) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
          <span className="text-[10px] text-slate-400 px-2 uppercase font-bold">Presets:</span>
          <button
            onClick={() => applyPreset(0, 0, 7)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
          >
            Baseline
          </button>
          <button
            onClick={() => applyPreset(-30, 2.0, 14)}
            className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer"
          >
            Severe Drought (Demo)
          </button>
          <button
            onClick={() => applyPreset(-10, 4.0, 14)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
          >
            Heatwave Surge
          </button>
          <button
            onClick={() => applyPreset(40, -1.0, 7)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
          >
            Heavy Rain Influx
          </button>
        </div>
      </div>

      {/* Interactive Controls & Live Digital Twin Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders and Simulation Parameters */}
        <div className="lg:col-span-5 p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
            Simulation Parameters
          </div>

          {/* Slider 1: Rainfall Change */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Precipitation Deviation ($\Delta P$)</span>
              <span className="text-cyan-400 font-bold">{rainfallDelta > 0 ? `+${rainfallDelta}%` : `${rainfallDelta}%`}</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={rainfallDelta}
              onChange={(e) => setRainfallDelta(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-60% (Severe Deficit)</span>
              <span>0% Normal</span>
              <span>+60% (Heavy Rain)</span>
            </div>
          </div>

          {/* Slider 2: Temperature Change */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Thermal Warming ($\Delta T$)</span>
              <span className="text-red-400 font-bold">+{temperatureDelta.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.5"
              value={temperatureDelta}
              onChange={(e) => setTemperatureDelta(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>+0.0°C (Seasonal Normal)</span>
              <span>+2.5°C</span>
              <span>+5.0°C (Extreme Thermal)</span>
            </div>
          </div>

          {/* Slider 3: Simulation Horizon */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Projection Horizon</span>
              <span className="text-amber-400 font-bold">{horizonDays} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="30"
              step="7"
              value={horizonDays}
              onChange={(e) => setHorizonDays(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>7 Days (Weekly)</span>
              <span>14 Days (Biweekly)</span>
              <span>30 Days (Monthly)</span>
            </div>
          </div>

          {/* Slider 4: Initial Soil Moisture */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Initial Soil Water Content</span>
              <span className="text-slate-200 font-bold">{initialSoilMoisture}%</span>
            </div>
            <input
              type="range"
              min="12"
              max="40"
              step="1"
              value={initialSoilMoisture}
              onChange={(e) => setInitialSoilMoisture(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>12% (Wilting Point)</span>
              <span>19.5% (Conduit Observed)</span>
              <span>40% (Field Capacity)</span>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-950"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'RUNNING DIGITAL TWIN SIMULATION...' : 'RUN SIMULATION'}</span>
          </button>
        </div>

        {/* Right Column: Comparative Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Cards: Current vs Scenario */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2 mb-3">
              <span className="text-slate-400">METRIC COMPARISON</span>
              <div className="flex items-center gap-6">
                <span className="text-slate-400">CURRENT</span>
                <span className="text-cyan-400">SIMULATED SCENARIO</span>
                <span className="text-amber-400">DELTA</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Drought Risk */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-200 font-bold">Drought Risk Probability</span>
                <div className="flex items-center gap-8 tabular-nums">
                  <span className="text-slate-400">{result.currentMetrics.droughtRiskPct}%</span>
                  <span className="text-cyan-300 font-bold text-sm">{result.projectedMetrics.droughtRiskPct}%</span>
                  <span className="text-red-400 font-bold">+{result.deltaMetrics.droughtRiskDelta}%</span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-200 font-bold">Root-zone Soil Moisture</span>
                <div className="flex items-center gap-8 tabular-nums">
                  <span className="text-slate-400">{result.currentMetrics.soilMoisturePct}%</span>
                  <span className="text-cyan-300 font-bold text-sm">{result.projectedMetrics.soilMoisturePct}%</span>
                  <span className="text-red-400 font-bold">{result.deltaMetrics.soilMoistureDelta}%</span>
                </div>
              </div>

              {/* Water Stress */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-200 font-bold">Composite Water Stress</span>
                <div className="flex items-center gap-8 tabular-nums">
                  <span className="text-slate-400">{result.currentMetrics.waterStressPct}%</span>
                  <span className="text-cyan-300 font-bold text-sm">{result.projectedMetrics.waterStressPct}%</span>
                  <span className="text-red-400 font-bold">+{result.deltaMetrics.waterStressDelta}%</span>
                </div>
              </div>

              {/* Vegetation Stress */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-200 font-bold">Vegetation Canopy Stress</span>
                <div className="flex items-center gap-8 tabular-nums">
                  <span className="text-slate-400">{result.currentMetrics.vegetationStressPct}%</span>
                  <span className="text-cyan-300 font-bold text-sm">{result.projectedMetrics.vegetationStressPct}%</span>
                  <span className="text-red-400 font-bold">+{result.deltaMetrics.vegetationStressDelta}%</span>
                </div>
              </div>
            </div>

            {/* Apache ECharts Baseline vs Scenario Comparison (Requirement #15) */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-slate-300">
                  Visual Baseline vs Counterfactual Trajectory
                </span>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Risk increased by +{result.deltaMetrics.droughtRiskDelta} points under this scenario.
                </span>
              </div>
              <ScenarioComparisonChart
                currentMetrics={result.currentMetrics}
                projectedMetrics={result.projectedMetrics}
                height={220}
              />
            </div>
          </div>

          {/* Physical Explanation Box */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/90 text-xs">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Twin Physical Feedback Analysis</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11.5px]">
              {result.explanation}
            </p>
          </div>

          {/* Intervention Simulator: No Action vs Action (Requirement #27) */}
          <div className="p-4 rounded-lg border border-amber-800/50 bg-amber-950/20 text-xs">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Intervention Impact Simulator</span>
              <span className="text-[10px] text-amber-400/80">Avoided Loss Modeling</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded bg-slate-900/90 border border-red-900/40">
                <div className="text-red-400 font-bold mb-1">NO INTERVENTION:</div>
                <div className="text-slate-300 text-[10.5px] font-sans">
                  {result.impactAssessment.agricultureCropRisk}
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-900/90 border border-emerald-900/40">
                <div className="text-emerald-400 font-bold mb-1">WITH RECOMMENDED ACTION:</div>
                <div className="text-slate-300 text-[10.5px] font-sans">
                  {result.impactAssessment.avoidedImpactWithIntervention}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
