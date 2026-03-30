'use client';

import ReactECharts from 'echarts-for-react';
import { FinancialRecord } from '@/lib/types';

interface ProfitChartProps {
  data: FinancialRecord[];
  height?: string;
}

export default function ProfitChart({ data, height = '350px' }: ProfitChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container flex items-center justify-center" style={{ height }}>
        <p className="text-neutral-400">No data available</p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      textStyle: { color: '#171717' },
    },
    legend: {
      data: ['Gross Profit', 'Operating Income', 'Net Income'],
      top: 0,
      textStyle: { color: '#737373' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(r => r.month),
      axisLine: { lineStyle: { color: '#e5e5e5' } },
      axisLabel: { color: '#737373' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: {
        color: '#737373',
        formatter: (value: number) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
          return `$${value}`;
        },
      },
      splitLine: { lineStyle: { color: '#f5f5f5' } },
    },
    series: [
      {
        name: 'Gross Profit',
        type: 'line',
        data: data.map(r => r.grossProfit),
        smooth: true,
        itemStyle: { color: '#0ea5e9' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
            ],
          },
        },
      },
      {
        name: 'Operating Income',
        type: 'line',
        data: data.map(r => r.operatingIncome),
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
      },
      {
        name: 'Net Income',
        type: 'line',
        data: data.map(r => r.netIncome),
        smooth: true,
        itemStyle: { color: '#6366f1' },
        lineStyle: { width: 3 },
      },
    ],
    animation: true,
    animationDuration: 1000,
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Profit Trends</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}