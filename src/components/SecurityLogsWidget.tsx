'use client';

import { SecurityLog } from '@/types';
import { getSeverityColor, formatDate } from '@/lib/utils';
import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface SecurityLogsWidgetProps {
  logs: SecurityLog[];
}

export default function SecurityLogsWidget({ logs }: SecurityLogsWidgetProps) {
  const getIcon = (eventType: SecurityLog['eventType']) => {
    switch (eventType) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4" />;
      case 'VERIFICATION':
        return <CheckCircle className="w-4 h-4" />;
      case 'SYNC':
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-400">Security Logs Overview</h2>
        <Shield className="w-8 h-8 text-orange-400" />
      </div>

      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-bold text-orange-400">ScrollVerse Data Integrity Chain (SDIC)</span> active
        </p>
        <p className="text-xs text-gray-500">
          All logs are tamper-proof and verified through blockchain timestamping
        </p>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {logs.map(log => (
          <div
            key={log.id}
            className={`p-3 rounded-lg border ${getSeverityColor(log.severity)} border-current/20`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {getIcon(log.eventType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      Compound #{log.compoundId}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-current/20">
                      {log.eventType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{log.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-gray-500">
                      {formatDate(log.timestamp)}
                    </p>
                    {log.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
