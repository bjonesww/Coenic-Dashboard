import { FinancialRecord } from './types';
import * as XLSX from 'xlsx';

export function parseFile(file: Buffer): FinancialRecord[] {
  const workbook = XLSX.read(file, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

  if (data.length < 2) {
    throw new Error('File must contain headers and data rows');
  }

  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const records: FinancialRecord[] = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0 || !row[0]) continue;

    const record: FinancialRecord = {
      month: '',
      revenue: 0,
      directCosts: 0,
      grossProfit: 0,
      operatingIncome: 0,
      netIncome: 0,
      cash: 0,
      backlog: 0,
      activeProjects: 0,
      headcount: 0,
      dso: 0,
    };

    headers.forEach((header, index) => {
      const value = row[index];
      if (value === undefined || value === null || value === '') return;

      const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[$,]/g, ''));
      if (isNaN(numValue)) return;

      // Map columns by header name
      if (matchHeader(header, 'month')) {
        record.month = String(value);
      } else if (matchHeader(header, 'revenue')) {
        record.revenue = numValue;
      } else if (matchHeader(header, 'directCosts')) {
        record.directCosts = numValue;
      } else if (matchHeader(header, 'grossProfit')) {
        record.grossProfit = numValue;
      } else if (matchHeader(header, 'operatingIncome')) {
        record.operatingIncome = numValue;
      } else if (matchHeader(header, 'netIncome')) {
        record.netIncome = numValue;
      } else if (matchHeader(header, 'cash')) {
        record.cash = numValue;
      } else if (matchHeader(header, 'backlog')) {
        record.backlog = numValue;
      } else if (matchHeader(header, 'activeProjects')) {
        record.activeProjects = numValue;
      } else if (matchHeader(header, 'headcount')) {
        record.headcount = numValue;
      } else if (matchHeader(header, 'dso')) {
        record.dso = numValue;
      }
    });

    if (record.month) {
      records.push(record);
    }
  }

  return records;
}

function matchHeader(header: string, field: string): boolean {
  const patterns: Record<string, string[]> = {
    month: ['month', 'date', 'period', 'month/year', 'month-year', 'fiscal month'],
    revenue: ['revenue', 'total revenue', 'sales', 'gross revenue', 'total sales'],
    directCosts: ['direct costs', 'cost of revenue', 'cogs', 'cost of goods sold', 'direct cost'],
    grossProfit: ['gross profit', 'gross margin', 'gross income', 'gross profit margin'],
    operatingIncome: ['operating income', 'operating profit', 'ebit', 'income from operations', 'operating earnings'],
    netIncome: ['net income', 'net profit', 'net earnings', 'bottom line', 'net loss', 'net margin'],
    cash: ['cash', 'cash position', 'cash on hand', 'cash balance', 'cash and equivalents', 'total cash'],
    backlog: ['backlog', 'backlog value', 'pipeline', 'pending revenue', 'backlog amount'],
    activeProjects: ['active projects', 'projects', 'current projects', 'open projects', 'ongoing projects', 'project count'],
    headcount: ['headcount', 'employees', 'staff', 'total headcount', 'workforce', 'total employees', 'fte'],
    dso: ['dso', 'days sales outstanding', 'days sales', 'collection period', 'days sales outstanding'],
  };

  const lowerHeader = header.toLowerCase();
  return patterns[field]?.some(p => lowerHeader.includes(p)) || false;
}