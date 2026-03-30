'use client';

import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'corenic-financial-data';

export function getRecords(): FinancialRecord[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return parsed.records || [];
  } catch {
    return [];
  }
}

export function saveRecords(records: FinancialRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ records }));
}

export function addRecords(newRecords: FinancialRecord[]): FinancialRecord[] {
  const existing = getRecords();
  const updated = [...existing, ...newRecords.map((r, i) => ({
    ...r,
    id: existing.length + i + 1,
    uploadedAt: new Date().toISOString(),
  }))];
  saveRecords(updated);
  return updated;
}

export function getKPIs(records: FinancialRecord[]) {
  const latest = records.length > 0 ? records[records.length - 1] : null;
  const previous = records.length > 1 ? records[records.length - 2] : null;
  
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