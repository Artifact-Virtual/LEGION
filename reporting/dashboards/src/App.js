import React, { useState } from 'react';
import CommandCenter from './components/CommandCenter';
import AdvancedPriceChart from './components/AdvancedPriceChart';
import MarketSummaryTable from './components/MarketSummaryTable';
import NewsStream from './components/NewsStream';
import TrendingTopicsTable from './components/TrendingTopicsTable';
import AbuseIPDBThreatMap from './components/AbuseIPDBThreatMap';
import VirusTotalIOCFeed from './components/VirusTotalIOCFeed';
import WorldBankEconomicIndicators from './components/WorldBankEconomicIndicators';
import IMFWorldEconomicOutlook from './components/IMFWorldEconomicOutlook';
import WeatherDashboard from './components/WeatherDashboard';
import AstronomyWidget from './components/AstronomyWidget';
import EarthquakeMonitor from './components/EarthquakeMonitor';
import CryptoMarketWidget from './components/CryptoMarketWidget';
import StockMarketWidget from './components/StockMarketWidget';
import CybersecurityDashboard from './components/CybersecurityDashboard';
import BusinessIntelligenceWidget from './components/BusinessIntelligenceWidget';
import HealthTechWidget from './components/HealthTechWidget';
import EnergyEnvironmentWidget from './components/EnergyEnvironmentWidget';
import NewsAndEventsWidget from './components/NewsAndEventsWidget';
import SpaceScienceDashboard from './components/SpaceScienceDashboard';
// Import existing dashboard components
import MarkdownReportViewer from './MarkdownReportViewer';
import AgentActivityTable from './AgentActivityTable';
import AgentDirectory from './AgentDirectory';
import AgentHealthDashboard from './AgentHealthDashboard';
import ThreeDVisualization from './ThreeDVisualization';
import ComplianceDashboard from './ComplianceDashboard';
import FinancialDashboard from './FinancialDashboard';
import MarketingDashboard from './MarketingDashboard';
import OperationsDashboard from './OperationsDashboard';
import ExecutiveDashboard from './ExecutiveDashboard';
import SystemMessageFeed from './components/SystemMessageFeed';
import RealTimeAlertsFeed from './components/RealTimeAlertsFeed';
import ApiHealthMonitor from './components/ApiHealthMonitor';
import DatabaseHealthMonitor from './components/DatabaseHealthMonitor';
import avBlackLogo from './assets/logo/av-black-logo.png';

const TABS = [
  { key: 'enterprise', label: 'ENTERPRISE' },
  { key: 'executive', label: 'EXECUTIVE' },
  { key: 'operations', label: 'OPERATIONS' },
  { key: 'agents', label: 'AGENTS' },
  { key: 'reports', label: 'REPORTS' },
  { key: 'analytics', label: 'ANALYTICS' },
  { key: 'weather', label: 'WEATHER' },
  { key: 'health', label: 'HEALTH' },
  { key: 'energy', label: 'ENERGY' },
  { key: 'business', label: 'BUSINESS' },
  { key: 'compliance', label: 'COMPLIANCE' },
  { key: 'finance', label: 'FINANCE' },
  { key: 'marketing', label: 'MARKETING' },
  { key: 'infrastructure', label: 'INFRASTRUCTURE' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('enterprise');

  return (
    <div className="min-h-screen w-full bg-black text-white font-mono">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen z-30 w-16 bg-black flex flex-col items-center py-6">
        {/* Logo */}
        <img src={avBlackLogo} alt="AV" className="w-10 h-10 mb-8" />
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`w-12 h-12 flex items-center justify-center text-xs font-light tracking-wider transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'bg-gray-900 text-white border-l-2 border-blue-400' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-950'
              }`}
              onClick={() => setActiveTab(tab.key)}
              title={tab.label}
            >
              <span className="transform -rotate-90 whitespace-nowrap text-[10px]">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* AbuseIPDB Badge */}
        <div className="mt-auto">
          <a 
            href="https://www.abuseipdb.com/user/224927" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-10 h-10"
          >
            <img 
              src="https://www.abuseipdb.com/contributor/224927.svg" 
              alt="AbuseIPDB" 
              className="w-full h-full opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-16 min-h-screen bg-black">
        {/* Header */}
        <header className="bg-black px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-light text-gray-300 tracking-wide">
              ARTIFACT VIRTUAL • LEGION ENTERPRISE
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </div>
        </header>

        {/* Tab Content */}
        <main className="h-full">
          {activeTab === 'enterprise' && (
            <div className="h-full flex">
              <div className="flex-1">
                <CommandCenter />
              </div>
              <div className="w-1/3 p-4 border-l border-gray-800">
                <SystemMessageFeed />
              </div>
            </div>
          )}
          
          {activeTab === 'markets' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">FINANCIAL MARKETS</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">ADVANCED PRICE CHART</div>
                    <div className="w-full h-96">
                      <AdvancedPriceChart />
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">MARKET SUMMARY</div>
                    <MarketSummaryTable />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">STOCK MARKETS</div>
                    <StockMarketWidget />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">CRYPTOCURRENCY</div>
                    <CryptoMarketWidget />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'news' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">NEWS & INTELLIGENCE</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">GLOBAL NEWS</div>
                    <NewsAndEventsWidget />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">TRENDING ANALYSIS</div>
                    <TrendingTopicsTable />
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">LIVE NEWS STREAM</div>
                  <NewsStream />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">CYBERSECURITY INTELLIGENCE</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">COMPREHENSIVE SECURITY DASHBOARD</div>
                  <CybersecurityDashboard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">ABUSEIPDB THREAT INTELLIGENCE</div>
                    <AbuseIPDBThreatMap />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">VIRUSTOTAL IOC ANALYSIS</div>
                    <VirusTotalIOCFeed />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'economy' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">GLOBAL ECONOMIC INTELLIGENCE</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">WORLD BANK ECONOMIC INDICATORS</div>
                    <WorldBankEconomicIndicators />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">IMF WORLD ECONOMIC OUTLOOK</div>
                    <IMFWorldEconomicOutlook />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'science' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">SCIENCE & SPACE INTELLIGENCE</h2>
                
                {/* Space Science Dashboard */}
                <SpaceScienceDashboard />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">NASA & SPACE DATA</div>
                    <AstronomyWidget />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">USGS EARTHQUAKE MONITORING</div>
                    <EarthquakeMonitor />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'weather' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">WEATHER & CLIMATE INTELLIGENCE</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">GLOBAL WEATHER DASHBOARD</div>
                  <WeatherDashboard />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'health' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">HEALTH & MEDICAL TECHNOLOGY INTELLIGENCE</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">GLOBAL HEALTH MONITORING & MEDICAL TECH</div>
                  <HealthTechWidget />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'energy' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">ENERGY & ENVIRONMENTAL INTELLIGENCE</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">GLOBAL ENERGY & ENVIRONMENTAL ANALYTICS</div>
                  <EnergyEnvironmentWidget />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'business' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">BUSINESS INTELLIGENCE & CORPORATE ANALYTICS</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">CORPORATE & ECONOMIC INTELLIGENCE PLATFORM</div>
                  <BusinessIntelligenceWidget />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'executive' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">EXECUTIVE DASHBOARD</h2>
                <ExecutiveDashboard />
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">OPERATIONS MANAGEMENT</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OperationsDashboard />
                  <RealTimeAlertsFeed />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">AGENT MONITORING & MANAGEMENT</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">AGENT HEALTH MONITORING</div>
                    <AgentHealthDashboard />
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                    <div className="text-white text-sm font-light mb-4">AGENT DIRECTORY</div>
                    <AgentDirectory />
                  </div>
                </div>
                
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6 mb-6">
                  <div className="text-white text-sm font-light mb-4">AGENT ACTIVITY LOG</div>
                  <AgentActivityTable />
                </div>
                
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">3D AGENT NETWORK VISUALIZATION</div>
                  <ThreeDVisualization />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">EXECUTIVE REPORTS & DOCUMENTATION</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
                  <div className="text-white text-sm font-light mb-4">MARKDOWN REPORT VIEWER</div>
                  <MarkdownReportViewer />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">COMPLIANCE & REGULATORY MONITORING</h2>
                <ComplianceDashboard />
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">FINANCIAL ANALYTICS & REPORTING</h2>
                <FinancialDashboard />
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">MARKETING ANALYTICS & AUTOMATION</h2>
                <MarketingDashboard />
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-300 mb-6">INFRASTRUCTURE MONITORING</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ApiHealthMonitor />
                  <DatabaseHealthMonitor />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
