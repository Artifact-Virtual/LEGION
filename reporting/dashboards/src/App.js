import React from 'react';
import './chartConfig.js';
import AgentActivityTable from './AgentActivityTable';
import MarkdownReportViewer from './MarkdownReportViewer';
import AgentHealthDashboard from './AgentHealthDashboard';
import SecurityHealthPanel from './SecurityHealthPanel';
import ThreeDVisualization from './ThreeDVisualization';
import ApiSidebar from './ApiSidebar';
import AgentDirectory from './AgentDirectory';

// Import new comprehensive components

import WeatherDashboard from './components/WeatherDashboard';
import AstronomyWidget from './components/AstronomyWidget';
import AdvancedPriceChart from './components/AdvancedPriceChart';
import CybersecurityDashboard from './components/CybersecurityDashboard';
import NewsAndEventsWidget from './components/NewsAndEventsWidget';
import EarthquakeMonitor from './components/EarthquakeMonitor';
import BusinessIntelligenceWidget from './components/BusinessIntelligenceWidget';
import HealthTechWidget from './components/HealthTechWidget';
import EnergyEnvironmentWidget from './components/EnergyEnvironmentWidget';


export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <ApiSidebar />
      <main className="flex-1 p-8 flex flex-col gap-8 font-thin">
        {/* Top Navigation */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-thin text-white tracking-wide">Enterprise Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">Live</span>
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleString()}
            </div>
          </div>
        </header>

        {/* Agent Directory & Activity */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AgentDirectory />
          <AgentActivityTable />
        </section>

        {/* Health & Security */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SecurityHealthPanel />
        </section>

        {/* Intelligence & Operations */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <BusinessIntelligenceWidget />
          <AdvancedPriceChart />
        </section>

        {/* WeatherDashboard moved to sidebar */}

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <NewsAndEventsWidget />
          <EnergyEnvironmentWidget />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <HealthTechWidget />
          <EarthquakeMonitor />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CybersecurityDashboard />
          <AstronomyWidget />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <MarkdownReportViewer />
        </section>
      </main>
    </div>
  );
}
