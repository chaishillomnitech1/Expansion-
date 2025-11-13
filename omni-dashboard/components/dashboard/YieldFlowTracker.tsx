'use client';

import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface YieldData {
  compound: number;
  yield: number;
  zakat: number;
}

// Generate sample data for 50 compounds
const generateYieldData = (): YieldData[] => {
  const data: YieldData[] = [];
  for (let i = 1; i <= 50; i++) {
    const baseYield = Math.random() * 100000 + 50000;
    data.push({
      compound: i,
      yield: parseFloat(baseYield.toFixed(2)),
      zakat: parseFloat((baseYield * 0.0777).toFixed(2)), // 7.77% Zakat
    });
  }
  return data;
};

export default function YieldFlowTracker() {
  const yieldData = generateYieldData();
  
  // Calculate totals
  const totalYield = yieldData.reduce((sum, item) => sum + item.yield, 0);
  const totalZakat = yieldData.reduce((sum, item) => sum + item.zakat, 0);
  
  // Get recent compounds for chart (last 10)
  const recentData = yieldData.slice(-10);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Yield-Flow Tracker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ScrollCoin Zakat Flow (7.77%)
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-2xl font-bold">{totalZakat.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Zakat</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Compounds</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">50</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Yield</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${totalYield.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Zakat Rate</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">7.77%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recentData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis 
              dataKey="compound" 
              label={{ value: 'Compound ID', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis 
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Yield"
            />
            <Line 
              type="monotone" 
              dataKey="zakat" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Zakat (7.77%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Compounds Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">Compound</th>
              <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">Yield</th>
              <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">Zakat (7.77%)</th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((item) => (
              <tr 
                key={item.compound}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">
                  Compound #{item.compound}
                </td>
                <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">
                  ${item.yield.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-purple-600 dark:text-purple-400 font-medium">
                  ${item.zakat.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
