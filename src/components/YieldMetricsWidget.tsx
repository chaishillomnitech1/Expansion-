'use client';

import { YieldMetrics } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Activity, BarChart3, TrendingUp, Target } from 'lucide-react';

interface YieldMetricsWidgetProps {
  metrics: YieldMetrics;
}

export default function YieldMetricsWidget({ metrics }: YieldMetricsWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Yield Progress Metrics</h2>
        <BarChart3 className="w-8 h-8 text-blue-400" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">Total Compounds</p>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.totalCompounds}</p>
          <p className="text-xs text-gray-500 mt-1">ScrollVerse Network</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Active</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.activeCompounds}</p>
          <p className="text-xs text-gray-500 mt-1">Online Now</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p className="text-gray-400 text-sm">Total Yield</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(metrics.totalYield)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cumulative</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">Average Yield</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(metrics.averageYield)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per Compound</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-omni-gold" />
            <p className="text-gray-400 text-sm">Phase 76</p>
          </div>
          <p className="text-3xl font-bold text-omni-gold">{metrics.phase76Completion}%</p>
          <p className="text-xs text-omni-gold/70 mt-1">Completion</p>
        </div>
      </div>
    </div>
  );
}
