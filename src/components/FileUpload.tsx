'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FinancialRecord } from '@/lib/dataStore';

interface FileUploadProps {
  onUploadComplete: (records: FinancialRecord[]) => void;
}

function parseFileClient(file: File): Promise<FinancialRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        const records: FinancialRecord[] = json.map((row: any) => ({
          month: row.Month || row.month || row.Date || row.Period || '',
          revenue: parseFloat(row.Revenue || row.revenue || row.Sales || row['Total Revenue'] || 0) || 0,
          directCosts: parseFloat(row['Direct Costs'] || row['Cost of Revenue'] || row.COGS || row.directCosts || 0) || 0,
          grossProfit: parseFloat(row['Gross Profit'] || row['Gross Margin'] || row.grossProfit || 0) || 0,
          operatingIncome: parseFloat(row['Operating Income'] || row['Operating Profit'] || row.EBIT || row.operatingIncome || 0) || 0,
          netIncome: parseFloat(row['Net Income'] || row['Net Profit'] || row['Net Earnings'] || row.netIncome || 0) || 0,
          cash: parseFloat(row.Cash || row['Cash Position'] || row['Cash Balance'] || row.cash || 0) || 0,
          backlog: parseFloat(row.Backlog || row['Backlog Value'] || row.Pipeline || row.backlog || 0) || 0,
          activeProjects: parseInt(row['Active Projects'] || row.Projects || row['Current Projects'] || row.activeProjects || 0) || 0,
          headcount: parseInt(row.Headcount || row.Employees || row.Staff || row.headcount || 0) || 0,
          dso: parseFloat(row.DSO || ['Days Sales Outstanding'] || row.dso || 0) || 0,
        })).filter(r => r.month);
        
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setMessage(null);

    try {
      const records = await parseFileClient(file);
      
      if (records.length === 0) {
        setMessage({ type: 'error', text: 'No valid records found in file. Please check the format.' });
        setIsUploading(false);
        return;
      }

      onUploadComplete(records);
      setMessage({ type: 'success', text: `Successfully imported ${records.length} records` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to parse file. Please check the format.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Upload Financial Data</h3>
      
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-neutral-600">Processing file...</p>
          </div>
        ) : (
          <>
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="mt-2 text-sm text-neutral-600">
                <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-neutral-500">Excel (.xlsx, .xls) or CSV files</p>
            </label>
          </>
        )}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mt-4 text-xs text-neutral-500">
        <p className="font-medium mb-1">Expected columns:</p>
        <p>Month, Revenue, Direct Costs, Gross Profit, Operating Income, Net Income, Cash, Backlog, Active Projects, Headcount, DSO</p>
      </div>
    </div>
  );
}