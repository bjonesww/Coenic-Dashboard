'use client';

import ReactECharts from 'echarts-for-react';
import { FinancialRecord } from '@/lib/types';

interface RevenueChartProps {
  data: FinancialRecord[];
  height?: string;
}

export default function RevenueChart({ data, height = '350px' }: RevenueChartProps) {
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
      textStyle: {
        color: '#171717',
      },
      formatter: (params: any) => {
        const dataPoint = params[0];
        const value = dataPoint.value;
        let formatted = '$';
        if (value >= 1000000) {
          formatted += (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 1000) {
          formatted += (value / 1000).toFixed(0) + 'K';
        } else {
          formatted += value.toFixed(0);
        }
        return `<strong>${dataPoint.name}</strong><br/>Revenue: ${formatted}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
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
        name: 'Revenue',
        type: 'bar',
        data: data.map(r => r.revenue),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0ea5e9' },
              { offset: 1, color: '#0284c7' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
    animation: true,
    animationDuration: 1000,
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Revenue Trend</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}