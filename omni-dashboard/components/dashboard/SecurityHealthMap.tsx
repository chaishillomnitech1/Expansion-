'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface SecurityProtocol {
  id: string;
  name: string;
  status: 'Secure' | 'Alert' | 'Warning';
  lastCheck: string;
  uptime: number;
}

const generateSecurityProtocols = (): SecurityProtocol[] => {
  const protocols = [
    'ScrollVerse Data Integrity',
    'SDIC TimeLock Protocol',
    'Family Access Control',
    'Yield Flow Protection',
    'Compound Security Layer',
    'Network Redundancy',
    'Encryption Gateway',
    'Access Logging System',
  ];

  return protocols.map((name, index) => ({
    id: `protocol-${index}`,
    name,
    status: Math.random() > 0.15 ? 'Secure' : (Math.random() > 0.5 ? 'Warning' : 'Alert'),
    lastCheck: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    uptime: 95 + Math.random() * 5,
  }));
};

export default function SecurityHealthMap() {
  const [protocols, setProtocols] = useState<SecurityProtocol[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initial load
    setProtocols(generateSecurityProtocols());

    // Update every 10 seconds for real-time simulation
    const interval = setInterval(() => {
      setProtocols(generateSecurityProtocols());
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const secureCount = protocols.filter(p => p.status === 'Secure').length;
  const alertCount = protocols.filter(p => p.status === 'Alert').length;
  const warningCount = protocols.filter(p => p.status === 'Warning').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Secure':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'Secure':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'Alert':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case 'Warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      default:
        return baseClasses;
    }
  };

  const formatLastCheck = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Security Health Map
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ScrollVerse Security Protocols
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Secure</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{secureCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{warningCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Alert</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{alertCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Protocols List */}
      <div className="space-y-3">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(protocol.status)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {protocol.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Last check: {formatLastCheck(protocol.lastCheck)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Uptime: {protocol.uptime.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className={getStatusBadge(protocol.status)}>
              {protocol.status}
            </div>
          </div>
        ))}
      </div>

      {/* System Health Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Overall System Health
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {secureCount === protocols.length 
                ? 'All systems operational' 
                : alertCount > 0 
                ? 'Immediate attention required'
                : 'Some protocols need review'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {((secureCount / protocols.length) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
