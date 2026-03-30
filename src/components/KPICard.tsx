'use client';

import { formatCurrency, formatNumber, formatPercent, formatDays } from '@/lib/types';

interface KPICardProps {
  label: string;
  value: number;
  trend?: number;
  previousValue?: number;
  format: 'currency' | 'number' | 'percent' | 'days';
  icon?: string;
}

export default function KPICard({ label, value, trend, previousValue, format, icon }: KPICardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return formatPercent(value);
      case 'days':
        return formatDays(value);
      default:
        return formatNumber(value);
    }
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return 'text-neutral-500';
    // For DSO, lower is better
    if (label === 'DSO') {
      return trend < 0 ? 'text-green-600' : 'text-red-600';
    }
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = () => {
    if (!trend || trend === 0) return '→';
    return trend > 0 ? '↑' : '↓';
  };

  const formatTrend = () => {
    if (!trend) return '';
    return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
  };

  return (
    <div className="kpi-card bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-neutral-500 text-sm font-medium">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-neutral-900">
          {formatValue()}
        </div>
        {previousValue !== undefined && previousValue !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{formatTrend()}</span>
            <span className="text-neutral-400 text-xs ml-1">vs prev</span>
          </div>
        )}
      </div>
    </div>
  );
}