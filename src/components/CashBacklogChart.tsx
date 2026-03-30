'use client';

import ReactECharts from 'echarts-for-react';
import { FinancialRecord } from '@/lib/types';

interface CashBacklogChartProps {
  data: FinancialRecord[];
  height?: string;
}

export default function CashBacklogChart({ data, height = '300px' }: CashBacklogChartProps) {
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
      data: ['Cash Position', 'Backlog'],
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
        name: 'Cash Position',
        type: 'line',
        data: data.map(r => r.cash),
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
            ],
          },
        },
      },
      {
        name: 'Backlog',
        type: 'line',
        data: data.map(r => r.backlog),
        smooth: true,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
            ],
          },
        },
      },
    ],
    animation: true,
    animationDuration: 1000,
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cash & Backlog</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}