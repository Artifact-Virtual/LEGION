import React from 'react';
import AgentActivityTable from './AgentActivityTable';
import MarkdownReportViewer from './MarkdownReportViewer';
import AgentHealthDashboard from './AgentHealthDashboard';
import SecurityHealthPanel from './SecurityHealthPanel';
import ThreeDVisualization from './ThreeDVisualization';
import ApiRegistryPanel from './ApiRegistryPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">Enterprise Service Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-8">
          <AgentActivityTable />
          <AgentHealthDashboard />
          <SecurityHealthPanel />
        </div>
        <div className="space-y-8">
          <MarkdownReportViewer />
          <ThreeDVisualization />
          <ApiRegistryPanel />
        </div>
      </div>
    </div>
  );
}
