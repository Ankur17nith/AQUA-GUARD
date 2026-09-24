'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ScenarioComparisonChartProps {
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
  height?: number;
}

export function ScenarioComparisonChart({
  currentMetrics,
  projectedMetrics,
  height = 240
}: ScenarioComparisonChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, 'dark', {
      renderer: 'canvas'
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animationDuration: 800,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#090d16',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11 }
      },
      legend: {
        data: ['Observed Baseline', 'Simulated Scenario'],
        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' },
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 10, formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['Vegetation Stress', 'Soil Moisture', 'Water Stress', 'Drought Risk'],
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }
      },
      series: [
        {
          name: 'Observed Baseline',
          type: 'bar',
          itemStyle: { color: '#64748b', borderRadius: [0, 2, 2, 0] },
          barGap: 0.2,
          data: [
            currentMetrics.vegetationStressPct,
            currentMetrics.soilMoisturePct,
            currentMetrics.waterStressPct,
            currentMetrics.droughtRiskPct
          ]
        },
        {
          name: 'Simulated Scenario',
          type: 'bar',
          itemStyle: { color: '#f59e0b', borderRadius: [0, 2, 2, 0] },
          data: [
            projectedMetrics.vegetationStressPct,
            projectedMetrics.soilMoisturePct,
            projectedMetrics.waterStressPct,
            projectedMetrics.droughtRiskPct
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [currentMetrics, projectedMetrics]);

  return (
    <div className="w-full">
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
}
