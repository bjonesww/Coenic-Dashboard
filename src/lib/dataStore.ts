import { FinancialRecord } from './types';

// In-memory store (will persist while server is running)
// For production, this would be SQLite or a database
let financialRecords: FinancialRecord[] = [];

export function getRecords(): FinancialRecord[] {
  return financialRecords;
}

export function addRecords(records: FinancialRecord[]): void {
  financialRecords = [...financialRecords, ...records];
}

export function clearRecords(): void {
  financialRecords = [];
}

export function getLatestRecord(): FinancialRecord | null {
  if (financialRecords.length === 0) return null;
  return financialRecords[financialRecords.length - 1];
}

export function getPreviousRecord(): FinancialRecord | null {
  if (financialRecords.length < 2) return null;
  return financialRecords[financialRecords.length - 2];
}

export function getKPIs() {
  const latest = getLatestRecord();
  const previous = getPreviousRecord();
  
  if (!latest) {
    return {
      revenue: { value: 0, trend: 0, previousValue: 0 },
      netIncome: { value: 0, trend: 0, previousValue: 0 },
      cash: { value: 0, trend: 0, previousValue: 0 },
      backlog: { value: 0, trend: 0, previousValue: 0 },
      activeProjects: { value: 0, trend: 0, previousValue: 0 },
      headcount: { value: 0, trend: 0, previousValue: 0 },
      dso: { value: 0, trend: 0, previousValue: 0 },
    };
  }

  const calculateTrend = (current: number, prev: number) => {
    if (prev === 0) return 0;
    return ((current - prev) / Math.abs(prev)) * 100;
  };

  return {
    revenue: {
      value: latest.revenue,
      trend: previous ? calculateTrend(latest.revenue, previous.revenue) : 0,
      previousValue: previous?.revenue ?? 0,
    },
    netIncome: {
      value: latest.netIncome,
      trend: previous ? calculateTrend(latest.netIncome, previous.netIncome) : 0,
      previousValue: previous?.netIncome ?? 0,
    },
    cash: {
      value: latest.cash,
      trend: previous ? calculateTrend(latest.cash, previous.cash) : 0,
      previousValue: previous?.cash ?? 0,
    },
    backlog: {
      value: latest.backlog,
      trend: previous ? calculateTrend(latest.backlog, previous.backlog) : 0,
      previousValue: previous?.backlog ?? 0,
    },
    activeProjects: {
      value: latest.activeProjects,
      trend: previous ? calculateTrend(latest.activeProjects, previous.activeProjects) : 0,
      previousValue: previous?.activeProjects ?? 0,
    },
    headcount: {
      value: latest.headcount,
      trend: previous ? calculateTrend(latest.headcount, previous.headcount) : 0,
      previousValue: previous?.headcount ?? 0,
    },
    dso: {
      value: latest.dso,
      trend: previous ? calculateTrend(latest.dso, previous.dso) : 0,
      previousValue: previous?.dso ?? 0,
    },
  };
}