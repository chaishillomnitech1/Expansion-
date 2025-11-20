'use client';

import { ZakatFlowMetrics } from '@/types';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Shield, DollarSign } from 'lucide-react';

interface ZakatFlowWidgetProps {
  metrics: ZakatFlowMetrics;
}

export default function ZakatFlowWidget({ metrics }: ZakatFlowWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400">7.77% Zakat Flow</h2>
        <Shield className="w-8 h-8 text-green-400" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Current Rate</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.currentRate}%</p>
          <p className="text-xs text-green-500 mt-1">Target: {metrics.targetRate}%</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Distributed</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(metrics.totalDistributed)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Amount</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Beneficiaries</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {formatNumber(metrics.beneficiaries)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Recipients</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Integrity</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.spiritualIntegrity}%</p>
          <p className="text-xs text-green-500 mt-1">Spiritual & Operational</p>
        </div>
      </div>
    </div>
  );
}
