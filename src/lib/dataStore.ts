import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data.json');

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

interface DataStore {
  records: FinancialRecord[];
}

async function readData(): Promise<DataStore> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { records: [] };
  }
}

async function writeData(data: DataStore): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function getRecords(): Promise<FinancialRecord[]> {
  const data = await readData();
  return data.records;
}

export async function addRecords(records: FinancialRecord[]): Promise<void> {
  const data = await readData();
  const newRecords = records.map((r, i) => ({
    ...r,
    id: data.records.length + i + 1,
    uploadedAt: new Date().toISOString(),
  }));
  data.records = [...data.records, ...newRecords];
  await writeData(data);
}

export async function clearRecords(): Promise<void> {
  await writeData({ records: [] });
}

export async function getLatestRecord(): Promise<FinancialRecord | null> {
  const records = await getRecords();
  if (records.length === 0) return null;
  return records[records.length - 1];
}

export async function getPreviousRecord(): Promise<FinancialRecord | null> {
  const records = await getRecords();
  if (records.length < 2) return null;
  return records[records.length - 2];
}

export async function getKPIs() {
  const records = await getRecords();
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