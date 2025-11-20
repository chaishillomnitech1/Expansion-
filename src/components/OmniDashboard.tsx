'use client';

import { useState, useEffect } from 'react';
import { OmniDashboardState } from '@/types';
import ZakatFlowWidget from './ZakatFlowWidget';
import YieldMetricsWidget from './YieldMetricsWidget';
import CompoundStatusGrid from './CompoundStatusGrid';
import SecurityLogsWidget from './SecurityLogsWidget';
import BroadcastWidget from './BroadcastWidget';
import { RefreshCw, Activity, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function OmniDashboard() {
  const [dashboardData, setDashboardData] = useState<OmniDashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
      setLastUpdate(new Date().toISOString());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-400">Initializing OmniTensor AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Omni-Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Real-Time Status Reporting • ScrollVerse Network • Phase 76
              </p>
            </div>
            <div className="flex items-center gap-4">
              {dashboardData.godModeActive && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-omni-gold/20 border border-omni-gold">
                  <CheckCircle className="w-5 h-5 text-omni-gold" />
                  <span className="text-omni-gold font-bold">GOD MODE</span>
                </div>
              )}
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>Last updated: {formatDate(lastUpdate)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Zakat Flow */}
          <ZakatFlowWidget metrics={dashboardData.zakatFlow} />

          {/* Yield Metrics */}
          <YieldMetricsWidget metrics={dashboardData.yieldMetrics} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Broadcast Messages */}
            <BroadcastWidget broadcasts={dashboardData.broadcasts} />

            {/* Security Logs */}
            <SecurityLogsWidget logs={dashboardData.securityLogs} />
          </div>

          {/* Compound Status Grid */}
          <CompoundStatusGrid compounds={dashboardData.compounds} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <span className="text-purple-400 font-bold">Omnitech1™</span> Advanced Execution Layer
            </p>
            <p>
              Sovereign: <span className="text-omni-gold">Chais Hill</span> • 
              ScrollVerse Infinity Loop • 
              OmniTensor AI Governance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
