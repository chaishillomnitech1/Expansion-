'use client';

import { CompoundStatus } from '@/types';
import { getStatusColor, formatDate } from '@/lib/utils';
import { Server, Shield, Activity } from 'lucide-react';
import { useState } from 'react';

interface CompoundStatusGridProps {
  compounds: CompoundStatus[];
}

export default function CompoundStatusGrid({ compounds }: CompoundStatusGridProps) {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredCompounds = compounds.filter(c => 
    filter === 'ALL' ? true : c.status === filter
  );

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Compound Stability Metrics</h2>
        <Server className="w-8 h-8 text-purple-400" />
      </div>

      <div className="flex gap-2 mb-4">
        {['ALL', 'SECURED', 'ACTIVE', 'SYNCING', 'PENDING'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-purple-500 text-white'
                : 'bg-black/30 text-gray-400 hover:bg-black/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {filteredCompounds.map(compound => (
          <div
            key={compound.id}
            className="bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-white">{compound.name}</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(compound.status)}`}>
                {compound.status}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-3">
              {compound.mandate}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Yield</span>
                </div>
                <span className="text-sm font-medium text-blue-400">
                  {compound.yieldProgress}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Security</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {compound.securityHealth}%
                </span>
              </div>

              <div className="pt-2 border-t border-purple-500/20">
                <p className="text-xs text-gray-500">
                  Last sync: {formatDate(compound.lastSync)}
                </p>
                <p className="text-xs text-purple-400 mt-1 truncate">
                  NFT: {compound.nftHash}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
