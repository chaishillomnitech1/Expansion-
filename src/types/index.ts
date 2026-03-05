// Core types for the Omni-Dashboard system

export interface CompoundStatus {
  id: number;
  name: string;
  rank: number;
  mandate: string;
  status: 'SECURED' | 'PENDING' | 'ACTIVE' | 'SYNCING';
  yieldProgress: number;
  securityHealth: number;
  lastSync: string;
  nftHash: string;
}

export interface ZakatFlowMetrics {
  currentRate: number;
  targetRate: number;
  totalDistributed: number;
  beneficiaries: number;
  spiritualIntegrity: number;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  compoundId: number;
  eventType: 'SCAN' | 'VERIFICATION' | 'ALERT' | 'SYNC';
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  verified: boolean;
}

export interface YieldMetrics {
  totalCompounds: number;
  activeCompounds: number;
  totalYield: number;
  averageYield: number;
  phase76Completion: number;
}

export interface BroadcastMessage {
  id: string;
  timestamp: string;
  type: 'VICTORY' | 'STATUS' | 'ALERT' | 'PHASE_COMPLETION';
  title: string;
  message: string;
  phase: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface OmniDashboardState {
  compounds: CompoundStatus[];
  zakatFlow: ZakatFlowMetrics;
  securityLogs: SecurityLog[];
  yieldMetrics: YieldMetrics;
  broadcasts: BroadcastMessage[];
  lastUpdate: string;
  godModeActive: boolean;
}
