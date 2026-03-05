import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'SECURED':
      return 'text-green-500';
    case 'ACTIVE':
      return 'text-blue-500';
    case 'SYNCING':
      return 'text-yellow-500';
    case 'PENDING':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return 'text-red-500 bg-red-500/10';
    case 'WARNING':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'INFO':
      return 'text-blue-500 bg-blue-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
}
