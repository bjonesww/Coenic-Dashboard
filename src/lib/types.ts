export interface FinancialRecord {
  id?: number;
  month: string;
  revenue: number;
  directCosts: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  cash: number;
  backlog: number;
  activeProjects: number;
  headcount: number;
  dso: number;
  uploadedAt?: string;
}

export interface KPIData {
  label: string;
  value: number;
  format: 'currency' | 'number' | 'percent' | 'days';
  trend?: number;
  previousValue?: number;
  icon?: string;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDays = (value: number): string => {
  return `${value.toFixed(0)} days`;
};

export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const defaultKPIs: KPIData[] = [
  { label: 'Revenue', value: 0, format: 'currency', icon: '💰' },
  { label: 'Net Income', value: 0, format: 'currency', icon: '📈' },
  { label: 'Cash Position', value: 0, format: 'currency', icon: '🏦' },
  { label: 'Backlog', value: 0, format: 'currency', icon: '📋' },
  { label: 'Active Projects', value: 0, format: 'number', icon: '🏗️' },
  { label: 'Headcount', value: 0, format: 'number', icon: '👥' },
  { label: 'DSO', value: 0, format: 'days', icon: '📅' },
];

// Expected column mappings (case-insensitive)
export const columnMappings: Record<string, string[]> = {
  month: ['month', 'date', 'period', 'month/year', 'month-year'],
  revenue: ['revenue', 'total revenue', 'sales', 'gross revenue'],
  directCosts: ['direct costs', 'cost of revenue', 'cogs', 'cost of goods'],
  grossProfit: ['gross profit', 'gross margin', 'gross income'],
  operatingIncome: ['operating income', 'operating profit', 'ebit', 'income from operations'],
  netIncome: ['net income', 'net profit', 'net earnings', 'bottom line', 'net loss'],
  cash: ['cash', 'cash position', 'cash on hand', 'cash balance', 'cash and equivalents'],
  backlog: ['backlog', 'backlog value', 'pipeline', 'pending revenue'],
  activeProjects: ['active projects', 'projects', 'current projects', 'open projects'],
  headcount: ['headcount', 'employees', 'staff', 'total headcount', 'workforce'],
  dso: ['dso', 'days sales outstanding', 'days sales', 'collection period'],
};