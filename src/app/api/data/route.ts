import { NextResponse } from 'next/server';
import { getRecords, getKPIs, initializeDatabase } from '@/lib/dataStore';

export async function GET() {
  try {
    // Initialize database tables on first run
    await initializeDatabase();
    
    const records = getRecords();
    const kpis = await getKPIs();

    return NextResponse.json({
      records,
      kpis,
      hasData: records.length > 0,
      lastUpdated: records.length > 0 ? records[records.length - 1].uploadedAt : null,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}