'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import RevenueChart from '@/components/RevenueChart';
import ProfitChart from '@/components/ProfitChart';
import CashBacklogChart from '@/components/CashBacklogChart';
import ProjectsChart from '@/components/ProjectsChart';
import FileUpload from '@/components/FileUpload';
import { getRecords, addRecords, getKPIs, FinancialRecord } from '@/lib/dataStore';

interface KPIData {
  revenue: { value: number; trend: number; previousValue: number };
  netIncome: { value: number; trend: number; previousValue: number };
  cash: { value: number; trend: number; previousValue: number };
  backlog: { value: number; trend: number; previousValue: number };
  activeProjects: { value: number; trend: number; previousValue: number };
  headcount: { value: number; trend: number; previousValue: number };
  dso: { value: number; trend: number; previousValue: number };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const storedRecords = getRecords();
    setRecords(storedRecords);
    setKpis(getKPIs(storedRecords));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUploadComplete = (newRecords: FinancialRecord[]) => {
    const updated = addRecords(newRecords);
    setRecords(updated);
    setKpis(getKPIs(updated));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-8 bg-neutral-50">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Executive Overview</h1>
                <p className="text-neutral-500 mt-1">
                  {records.length > 0 
                    ? `Data loaded: ${records.length} records`
                    : 'No data uploaded yet'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Upload New Data
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                label="Revenue"
                value={kpis?.revenue.value || 0}
                trend={kpis?.revenue.trend}
                previousValue={kpis?.revenue.previousValue}
                format="currency"
                icon="💰"
              />
              <KPICard
                label="Net Income"
                value={kpis?.netIncome.value || 0}
                trend={kpis?.netIncome.trend}
                previousValue={kpis?.netIncome.previousValue}
                format="currency"
                icon="📈"
              />
              <KPICard
                label="Cash Position"
                value={kpis?.cash.value || 0}
                trend={kpis?.cash.trend}
                previousValue={kpis?.cash.previousValue}
                format="currency"
                icon="🏦"
              />
              <KPICard
                label="Backlog"
                value={kpis?.backlog.value || 0}
                trend={kpis?.backlog.trend}
                previousValue={kpis?.backlog.previousValue}
                format="currency"
                icon="📋"
              />
              <KPICard
                label="Active Projects"
                value={kpis?.activeProjects.value || 0}
                trend={kpis?.activeProjects.trend}
                previousValue={kpis?.activeProjects.previousValue}
                format="number"
                icon="🏗️"
              />
              <KPICard
                label="Headcount"
                value={kpis?.headcount.value || 0}
                trend={kpis?.headcount.trend}
                previousValue={kpis?.headcount.previousValue}
                format="number"
                icon="👥"
              />
              <KPICard
                label="DSO"
                value={kpis?.dso.value || 0}
                trend={kpis?.dso.trend}
                previousValue={kpis?.dso.previousValue}
                format="days"
                icon="📅"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={records} />
              <ProfitChart data={records} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashBacklogChart data={records} />
              <ProjectsChart data={records} />
            </div>

            {/* Empty State */}
            {records.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
                <p className="text-neutral-500 mb-4">No data uploaded yet. Upload your first Excel or CSV file to see the dashboard.</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Upload Data
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900">Upload Data</h1>
              <p className="text-neutral-500 mt-1">
                Upload your financial data in Excel or CSV format to update the dashboard.
              </p>
            </div>
            <FileUpload onUploadComplete={handleUploadComplete} />
            
            <div className="mt-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}