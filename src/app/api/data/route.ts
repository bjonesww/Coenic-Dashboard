import { NextResponse } from 'next/server';
import { getRecords, getKPIs } from '@/lib/dataStore';

export async function GET() {
  try {
    const records = await getRecords();
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