'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EnvironmentalEChartProps {
  className?: string;
  height?: string | number;
}

export function EnvironmentalEChart({
  className = '',
  height = 320
}: EnvironmentalEChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, 'dark', {
      renderer: 'canvas'
    });

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animation: true,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#090d16',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11 },
        axisPointer: { type: 'cross', label: { backgroundColor: '#1e293b' } }
      },
      legend: {
        data: ['Rainfall (mm)', 'Temperature (°C)', 'Soil Moisture (%)', 'Drought Risk (%)'],
        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' },
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: ['-48h', '-36h', '-24h', '-12h', 'NOW', '+24h', '+3d', '+7d', '+14d'],
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Risk / Moisture (%)',
          min: 0,
          max: 100,
          position: 'left',
          axisLine: { lineStyle: { color: '#334155' } },
          axisLabel: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 10, formatter: '{value}%' },
          splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
        },
        {
          type: 'value',
          name: 'Temp (°C) / Rain (mm)',
          min: 0,
          max: 40,
          position: 'right',
          axisLine: { lineStyle: { color: '#334155' } },
          axisLabel: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 10 },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Rainfall (mm)',
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: { color: '#06b6d4', borderRadius: [2, 2, 0, 0] },
          data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 1.1, 3.5, 8.4]
        },
        {
          name: 'Temperature (°C)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          itemStyle: { color: '#f87171' },
          lineStyle: { width: 2 },
          data: [24.2, 26.8, 28.5, 29.4, 30.1, 30.5, 30.9, 31.3, 31.6]
        },
        {
          name: 'Soil Moisture (%)',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          itemStyle: { color: '#fbbf24' },
          lineStyle: { width: 2, type: 'solid' },
          data: [26.5, 24.8, 23.1, 21.0, 19.5, 18.9, 18.0, 16.3, 14.7]
        },
        {
          name: 'Drought Risk (%)',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          itemStyle: { color: '#c084fc' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(192, 132, 252, 0.4)' },
              { offset: 1, color: 'rgba(192, 132, 252, 0.02)' }
            ])
          },
          lineStyle: { width: 2.5 },
          data: [45.0, 52.0, 61.0, 71.0, 78.4, 80.0, 82.5, 85.0, 87.5]
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
  }, []);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
}
