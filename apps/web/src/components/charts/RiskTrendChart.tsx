'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RiskTrendChartProps {
  currentScore?: number;
  height?: number;
  className?: string;
}

export function RiskTrendChart({
  currentScore = 78.4,
  height = 240,
  className = ''
}: RiskTrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const timeline = ['-48h', '-36h', '-24h', '-12h', 'NOW', '+24h', '+3d', '+7d', '+14d'];
    const riskData = [45.0, 52.0, 61.0, 71.0, currentScore, 80.0, 82.5, 85.0, 87.5];

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#15191F',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F1F4F8', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; value: number }>;
          const pt = items?.[0];
          if (!pt) return '';
          return `<div style="font-weight:bold;margin-bottom:2px;">Step: ${pt.name}</div>
                  <div style="color:#F59E0B">Hazard Probability: <b>${pt.value}%</b></div>`;
        }
      },
      grid: {
        top: 24,
        right: 16,
        bottom: 24,
        left: 42
      },
      xAxis: {
        type: 'category',
        data: timeline,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#8E9BAE', fontSize: 10, fontFamily: 'monospace' }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
        axisLabel: {
          color: '#5C6777',
          fontSize: 10,
          fontFamily: 'monospace',
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'Hazard Probability',
          type: 'line',
          smooth: 0.3,
          data: riskData,
          symbolSize: 6,
          lineStyle: { color: '#F59E0B', width: 2.5 },
          itemStyle: { color: '#F59E0B' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245, 158, 11, 0.35)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.02)' }
            ])
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: 75,
                lineStyle: { color: '#EF4444', type: 'dashed', width: 1 },
                label: { formatter: 'CRITICAL (75%)', color: '#EF4444', position: 'insideEndTop', fontSize: 9 }
              },
              {
                yAxis: 50,
                lineStyle: { color: '#F59E0B', type: 'dashed', width: 1 },
                label: { formatter: 'ELEVATED (50%)', color: '#F59E0B', position: 'insideEndTop', fontSize: 9 }
              }
            ]
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [currentScore]);

  return (
    <div className={`w-full ${className}`}>
      <div ref={chartRef} style={{ height }} className="w-full" />
    </div>
  );
}
