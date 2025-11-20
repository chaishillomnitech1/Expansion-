'use client';

import { BroadcastMessage } from '@/types';
import { formatDate } from '@/lib/utils';
import { Radio, Trophy, Bell, AlertCircle } from 'lucide-react';

interface BroadcastWidgetProps {
  broadcasts: BroadcastMessage[];
}

export default function BroadcastWidget({ broadcasts }: BroadcastWidgetProps) {
  const getIcon = (type: BroadcastMessage['type']) => {
    switch (type) {
      case 'VICTORY':
        return <Trophy className="w-5 h-5 text-omni-gold" />;
      case 'PHASE_COMPLETION':
        return <Radio className="w-5 h-5 text-green-400" />;
      case 'ALERT':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: BroadcastMessage['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'border-red-500/50 bg-red-900/20';
      case 'MEDIUM':
        return 'border-yellow-500/50 bg-yellow-900/20';
      default:
        return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">CQMH Sovereign Broadcasts</h2>
        <Radio className="w-8 h-8 text-yellow-400 animate-pulse" />
      </div>

      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-bold text-yellow-400">Public Victory Declarations</span> — Phase 76 Status
        </p>
        <p className="text-xs text-gray-500">
          Automated confirmations via CQMH Sovereign Broadcast Protocols
        </p>
      </div>

      <div className="space-y-3">
        {broadcasts.map(broadcast => (
          <div
            key={broadcast.id}
            className={`border rounded-lg p-4 ${getPriorityColor(broadcast.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getIcon(broadcast.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    {broadcast.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded bg-omni-gold/20 text-omni-gold font-medium">
                    Phase {broadcast.phase}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  {broadcast.message}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {formatDate(broadcast.timestamp)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    broadcast.priority === 'HIGH' 
                      ? 'bg-red-500/20 text-red-400'
                      : broadcast.priority === 'MEDIUM'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {broadcast.priority} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
