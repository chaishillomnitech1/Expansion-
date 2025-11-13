'use client';

import React from 'react';
import { Server, Activity, Zap, HardDrive } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DeploymentNode {
  id: number;
  name: string;
  status: 'Active' | 'Activating' | 'Pending' | 'Offline';
  hardware: string;
  yield: number;
  uptime: number;
}

const generateDeploymentData = (): DeploymentNode[] => {
  const hardwareTypes = ['OmniTensor-X1', 'OmniTensor-X2', 'OmniTensor-Pro', 'OmniTensor-Elite'];
  const statuses: Array<'Active' | 'Activating' | 'Pending' | 'Offline'> = ['Active', 'Activating', 'Pending', 'Offline'];
  
  const data: DeploymentNode[] = [];
  for (let i = 1; i <= 20; i++) {
    const statusIndex = i <= 12 ? 0 : i <= 16 ? 1 : i <= 18 ? 2 : 3;
    data.push({
      id: i,
      name: `Node-${i.toString().padStart(2, '0')}`,
      status: statuses[statusIndex],
      hardware: hardwareTypes[Math.floor(Math.random() * hardwareTypes.length)],
      yield: statusIndex === 0 ? Math.random() * 5000 + 2000 : 0,
      uptime: statusIndex === 0 ? 95 + Math.random() * 5 : 0,
    });
  }
  return data;
};

export default function DeploymentStatusTracker() {
  const deploymentData = generateDeploymentData();
  
  const activeNodes = deploymentData.filter(n => n.status === 'Active').length;
  const activatingNodes = deploymentData.filter(n => n.status === 'Activating').length;
  const pendingNodes = deploymentData.filter(n => n.status === 'Pending').length;
  const offlineNodes = deploymentData.filter(n => n.status === 'Offline').length;
  
  const totalYield = deploymentData.reduce((sum, node) => sum + node.yield, 0);
  const deploymentProgress = (activeNodes / deploymentData.length) * 100;

  // Data for chart - only active nodes
  const chartData = deploymentData
    .filter(node => node.status === 'Active')
    .slice(0, 10)
    .map(node => ({
      name: node.name,
      yield: Math.round(node.yield),
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Activating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'Activating':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'Pending':
        return <HardDrive className="w-4 h-4 text-yellow-500" />;
      case 'Offline':
        return <Server className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Deployment Status Tracker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              OmniTensor Hardware & Operational Yields
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {deploymentProgress.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Deployed</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeNodes}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Activating</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activatingNodes}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingNodes}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Offline</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{offlineNodes}</p>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Active Node Yields
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'Yield ($)', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="yield" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${270 + index * 10}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Yield Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Total Operational Yield
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From {activeNodes} active nodes
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${totalYield.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Per cycle</p>
          </div>
        </div>
      </div>

      {/* Deployment Nodes List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Deployment Nodes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deploymentData.slice(0, 10).map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(node.status)}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {node.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {node.hardware}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(node.status)}`}>
                  {node.status}
                </span>
                {node.status === 'Active' && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ${node.yield.toFixed(0)}/cycle
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
