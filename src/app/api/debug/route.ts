import { NextResponse } from 'next/server';

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlPreview = hasDbUrl 
    ? process.env.DATABASE_URL.substring(0, 30) + '...' 
    : 'NOT SET';
  
  return NextResponse.json({
    DATABASE_URL_set: hasDbUrl,
    DATABASE_URL_preview: dbUrlPreview,
    NODE_ENV: process.env.NODE_ENV,
  });
}