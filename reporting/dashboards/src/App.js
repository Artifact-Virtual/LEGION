import React from 'react';
import AgentActivityTable from './AgentActivityTable';
import MarkdownReportViewer from './MarkdownReportViewer';
import AgentHealthDashboard from './AgentHealthDashboard';
import SecurityHealthPanel from './SecurityHealthPanel';
import ThreeDVisualization from './ThreeDVisualization';
import ApiRegistryPanel from './ApiRegistryPanel';

// Import new comprehensive components
import CryptoMarketWidget from './components/CryptoMarketWidget';
import WeatherDashboard from './components/WeatherDashboard';
import AstronomyWidget from './components/AstronomyWidget';
import StockMarketWidget from './components/StockMarketWidget';
import CybersecurityDashboard from './components/CybersecurityDashboard';
import NewsAndEventsWidget from './components/NewsAndEventsWidget';
import EarthquakeMonitor from './components/EarthquakeMonitor';
import BusinessIntelligenceWidget from './components/BusinessIntelligenceWidget';
import HealthTechWidget from './components/HealthTechWidget';
import EnergyEnvironmentWidget from './components/EnergyEnvironmentWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Enterprise Intelligence Dashboard</h1>
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
          <span className="text-sm text-gray-300">Security</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Intelligence</span>
        </div>
      </div>

      {/* Core Operations Dashboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🚀 Core Operations</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <AgentActivityTable />
            <AgentHealthDashboard />
          </div>
          <div className="space-y-6">
            <ApiRegistryPanel />
            <SecurityHealthPanel />
          </div>
        </div>
      </div>

      {/* Financial Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">💰 Financial Intelligence</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StockMarketWidget />
          <CryptoMarketWidget />
        </div>
      </div>

      {/* Business Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🏢 Business Intelligence</h2>
        <div className="grid grid-cols-1 gap-6">
          <BusinessIntelligenceWidget />
        </div>
      </div>

      {/* Global Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🌍 Global Intelligence</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <NewsAndEventsWidget />
          <WeatherDashboard />
        </div>
      </div>

      {/* Health Technology Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🏥 Health Technology Intelligence</h2>
        <div className="grid grid-cols-1 gap-6">
          <HealthTechWidget />
        </div>
      </div>

      {/* Environmental Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🌱 Environmental Intelligence</h2>
        <div className="grid grid-cols-1 gap-6">
          <EnergyEnvironmentWidget />
        </div>
      </div>

      {/* Security & Risk Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🛡️ Security & Risk Intelligence</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CybersecurityDashboard />
          <EarthquakeMonitor />
        </div>
      </div>

      {/* Science & Exploration */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🌌 Science & Exploration</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AstronomyWidget />
          <ThreeDVisualization />
        </div>
      </div>

      {/* Executive Reports */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">📊 Executive Intelligence</h2>
        <div className="grid grid-cols-1 gap-6">
          <MarkdownReportViewer />
        </div>
      </div>
    </div>
  );
}
