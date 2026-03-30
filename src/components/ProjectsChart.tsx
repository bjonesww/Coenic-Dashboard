'use client';

import ReactECharts from 'echarts-for-react';
import { FinancialRecord } from '@/lib/types';

interface ProjectsChartProps {
  data: FinancialRecord[];
  height?: string;
}

export default function ProjectsChart({ data, height = '280px' }: ProjectsChartProps) {
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
      data: ['Active Projects', 'Headcount'],
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
    yAxis: [
      {
        type: 'value',
        name: 'Projects',
        axisLine: { show: false },
        axisLabel: { color: '#737373' },
        splitLine: { lineStyle: { color: '#f5f5f5' } },
      },
      {
        type: 'value',
        name: 'Headcount',
        axisLine: { show: false },
        axisLabel: { color: '#737373' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Active Projects',
        type: 'bar',
        data: data.map(r => r.activeProjects),
        itemStyle: { color: '#6366f1' },
        barWidth: '40%',
      },
      {
        name: 'Headcount',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(r => r.headcount),
        smooth: true,
        itemStyle: { color: '#ec4899' },
        lineStyle: { width: 3 },
      },
    ],
    animation: true,
    animationDuration: 1000,
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Projects & Headcount</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}