import { NextRequest, NextResponse } from 'next/server';
import { addRecords } from '@/lib/dataStore';
import { parseFile } from '@/lib/parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const records = parseFile(Buffer.from(buffer));

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No valid records found in file. Please check the format.' },
        { status: 400 }
      );
    }

    // Add uploaded timestamp
    const recordsWithTimestamp = records.map(r => ({
      ...r,
      uploadedAt: new Date().toISOString(),
    }));

    await addRecords(recordsWithTimestamp);

    return NextResponse.json({
      success: true,
      recordsAdded: records.length,
      message: `Successfully imported ${records.length} records`,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process file' },
      { status: 500 }
    );
  }
}