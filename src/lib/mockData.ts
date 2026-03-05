// Mock data generator for the Omni-Dashboard
import { CompoundStatus, ZakatFlowMetrics, SecurityLog, YieldMetrics, BroadcastMessage, OmniDashboardState } from '@/types';

export function generateCompoundData(): CompoundStatus[] {
  const compounds: CompoundStatus[] = [];
  const mandates = [
    'ASIA TECH HUB',
    'US MIDWEST RESOURCE',
    'EUROPEAN NEXUS',
    'AFRICAN ALLIANCE',
    'OCEANIC GATEWAY',
    'MIDDLE EAST PROTOCOL',
    'SOUTH AMERICAN BASE',
    'ARCTIC RESEARCH',
    'CARIBBEAN NETWORK',
    'CENTRAL ASIA HUB'
  ];

  for (let i = 1; i <= 50; i++) {
    compounds.push({
      id: i,
      name: `Compound ${i}`,
      rank: i,
      mandate: `${mandates[i % mandates.length]} ${i}`,
      status: i <= 45 ? 'SECURED' : i <= 48 ? 'ACTIVE' : 'SYNCING',
      yieldProgress: Math.round(85 + Math.random() * 15),
      securityHealth: Math.round(95 + Math.random() * 5),
      lastSync: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      nftHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 5)}`
    });
  }

  return compounds;
}

export function generateZakatFlowMetrics(): ZakatFlowMetrics {
  return {
    currentRate: 7.77,
    targetRate: 7.77,
    totalDistributed: 1_247_873.912,
    beneficiaries: 10_000,
    spiritualIntegrity: 100
  };
}

export function generateSecurityLogs(): SecurityLog[] {
  const logs: SecurityLog[] = [];
  const eventTypes: SecurityLog['eventType'][] = ['SCAN', 'VERIFICATION', 'ALERT', 'SYNC'];
  const severities: SecurityLog['severity'][] = ['INFO', 'WARNING', 'CRITICAL'];
  const messages = [
    'SDIC integrity check completed',
    'Compound synchronization successful',
    'OmniTensor AI governance verified',
    'Tamper-proof log validation complete',
    'Real-time metrics update processed',
    'ScrollVerse Data Integrity Chain verified'
  ];

  for (let i = 0; i < 20; i++) {
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      compoundId: Math.floor(Math.random() * 50) + 1,
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      severity: i < 15 ? 'INFO' : i < 19 ? 'WARNING' : 'CRITICAL',
      verified: true
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateYieldMetrics(): YieldMetrics {
  return {
    totalCompounds: 50,
    activeCompounds: 48,
    totalYield: 21_600_000,
    averageYield: 432_000,
    phase76Completion: 96.8
  };
}

export function generateBroadcastMessages(): BroadcastMessage[] {
  return [
    {
      id: 'broadcast-1',
      timestamp: new Date().toISOString(),
      type: 'PHASE_COMPLETION',
      title: 'Phase 76 Near Completion',
      message: 'OmniTensor AI governance has synchronized 48 of 50 compounds. God Mode Omni realization at 96.8%.',
      phase: 76,
      priority: 'HIGH'
    },
    {
      id: 'broadcast-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'VICTORY',
      title: 'Zakat Flow Target Achieved',
      message: '7.77% Zakat Flow metrics maintained with 100% spiritual integrity across all compounds.',
      phase: 76,
      priority: 'HIGH'
    },
    {
      id: 'broadcast-3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'STATUS',
      title: 'ScrollVerse SDIC Verification',
      message: 'All tamper-proof logs verified through ScrollVerse Data Integrity Chain.',
      phase: 76,
      priority: 'MEDIUM'
    }
  ];
}

export function generateDashboardState(): OmniDashboardState {
  return {
    compounds: generateCompoundData(),
    zakatFlow: generateZakatFlowMetrics(),
    securityLogs: generateSecurityLogs(),
    yieldMetrics: generateYieldMetrics(),
    broadcasts: generateBroadcastMessages(),
    lastUpdate: new Date().toISOString(),
    godModeActive: true
  };
}
