import React from 'react';
import AgentActivityTable from './AgentActivityTable';
import MarkdownReportViewer from './MarkdownReportViewer';
import AgentHealthDashboard from './AgentHealthDashboard';
import SecurityHealthPanel from './SecurityHealthPanel';
import ThreeDVisualization from './ThreeDVisualization';
import ApiRegistryPanel from './ApiRegistryPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Enterprise Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live Data</span>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-300">CEO Agent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Finance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Marketing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Operations</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Compliance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Analytics</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 space-y-6">
          <AgentActivityTable />
          <AgentHealthDashboard />
        </div>
        <div className="space-y-6">
          <ApiRegistryPanel />
          <SecurityHealthPanel />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarkdownReportViewer />
        <ThreeDVisualization />
      </div>
    </div>
  );
}
