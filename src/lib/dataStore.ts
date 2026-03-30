import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS financial_records (
      id SERIAL PRIMARY KEY,
      month VARCHAR(50) NOT NULL,
      revenue DECIMAL(15,2) DEFAULT 0,
      direct_costs DECIMAL(15,2) DEFAULT 0,
      gross_profit DECIMAL(15,2) DEFAULT 0,
      operating_income DECIMAL(15,2) DEFAULT 0,
      net_income DECIMAL(15,2) DEFAULT 0,
      cash DECIMAL(15,2) DEFAULT 0,
      backlog DECIMAL(15,2) DEFAULT 0,
      active_projects INTEGER DEFAULT 0,
      headcount INTEGER DEFAULT 0,
      dso DECIMAL(10,2) DEFAULT 0,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function getRecords() {
  try {
    const result = await sql`
      SELECT 
        id, month, revenue, direct_costs, gross_profit, 
        operating_income, net_income, cash, backlog, 
        active_projects, headcount, dso, uploaded_at
      FROM financial_records 
      ORDER BY uploaded_at ASC, id ASC
    `;
    
    return result.map((row: any) => ({
      id: row.id,
      month: row.month,
      revenue: parseFloat(row.revenue) || 0,
      directCosts: parseFloat(row.direct_costs) || 0,
      grossProfit: parseFloat(row.gross_profit) || 0,
      operatingIncome: parseFloat(row.operating_income) || 0,
      netIncome: parseFloat(row.net_income) || 0,
      cash: parseFloat(row.cash) || 0,
      backlog: parseFloat(row.backlog) || 0,
      activeProjects: row.active_projects || 0,
      headcount: row.headcount || 0,
      dso: parseFloat(row.dso) || 0,
      uploadedAt: row.uploaded_at,
    }));
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
}

export async function addRecords(records: any[]) {
  for (const record of records) {
    await sql`
      INSERT INTO financial_records (
        month, revenue, direct_costs, gross_profit,
        operating_income, net_income, cash, backlog,
        active_projects, headcount, dso
      ) VALUES (
        ${record.month},
        ${record.revenue},
        ${record.directCosts},
        ${record.grossProfit},
        ${record.operatingIncome},
        ${record.netIncome},
        ${record.cash},
        ${record.backlog},
        ${record.activeProjects},
        ${record.headcount},
        ${record.dso}
      )
    `;
  }
}

export async function clearRecords() {
  await sql`DELETE FROM financial_records`;
}

export async function getLatestRecord() {
  const result = await sql`
    SELECT * FROM financial_records 
    ORDER BY uploaded_at DESC, id DESC 
    LIMIT 1
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    month: row.month,
    revenue: parseFloat(row.revenue) || 0,
    directCosts: parseFloat(row.direct_costs) || 0,
    grossProfit: parseFloat(row.gross_profit) || 0,
    operatingIncome: parseFloat(row.operating_income) || 0,
    netIncome: parseFloat(row.net_income) || 0,
    cash: parseFloat(row.cash) || 0,
    backlog: parseFloat(row.backlog) || 0,
    activeProjects: row.active_projects || 0,
    headcount: row.headcount || 0,
    dso: parseFloat(row.dso) || 0,
    uploadedAt: row.uploaded_at,
  };
}

export async function getPreviousRecord() {
  const result = await sql`
    SELECT * FROM financial_records 
    ORDER BY uploaded_at DESC, id DESC 
    OFFSET 1 LIMIT 1
  `;
  
  if (result.length === 0) return null;
  
  const row = result[0];
  return {
    id: row.id,
    month: row.month,
    revenue: parseFloat(row.revenue) || 0,
    directCosts: parseFloat(row.direct_costs) || 0,
    grossProfit: parseFloat(row.gross_profit) || 0,
    operatingIncome: parseFloat(row.operating_income) || 0,
    netIncome: parseFloat(row.net_income) || 0,
    cash: parseFloat(row.cash) || 0,
    backlog: parseFloat(row.backlog) || 0,
    activeProjects: row.active_projects || 0,
    headcount: row.headcount || 0,
    dso: parseFloat(row.dso) || 0,
    uploadedAt: row.uploaded_at,
  };
}

export async function getKPIs() {
  const latest = await getLatestRecord();
  const previous = await getPreviousRecord();
  
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