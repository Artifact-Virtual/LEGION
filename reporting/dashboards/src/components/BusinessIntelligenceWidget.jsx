import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiBriefcase, FiTrendingUp, FiDollarSign, FiUsers, FiGlobe } from 'react-icons/fi';

const BusinessIntelligenceWidget = () => {
  const [economicData, setEconomicData] = useState({});
  const [corporateData, setCorporateData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('gdp');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock economic and business data
    const mockEconomicData = {
      gdp: {
        label: 'Global GDP Growth',
        value: 3.2,
        trend: 'up',
        data: [2.8, 3.1, 2.9, 3.2, 3.5, 3.8, 3.2],
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']
      },
      inflation: {
        label: 'Global Inflation Rate',
        value: 4.1,
        trend: 'down',
        data: [5.2, 4.8, 4.5, 4.3, 4.1, 3.9, 4.1],
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']
      },
      unemployment: {
        label: 'Global Unemployment',
        value: 5.8,
        trend: 'stable',
        data: [6.2, 6.0, 5.9, 5.8, 5.7, 5.8, 5.8],
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']
      },
      tradeFix: {
        label: 'Global Trade Volume',
        value: 127.3,
        trend: 'up',
        data: [120.2, 123.1, 124.8, 127.3, 129.1, 131.2, 127.3],
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']
      }
    };

    const mockCorporateData = [
      {
        company: 'Apple Inc.',
        symbol: 'AAPL',
        sector: 'Technology',
        marketCap: 2.95e12,
        revenue: 383.3e9,
        employees: 161000,
        founded: 1976,
        country: 'USA',
        esgScore: 82,
        risk: 'Low'
      },
      {
        company: 'Microsoft Corporation',
        symbol: 'MSFT',
        sector: 'Technology',
        marketCap: 3.19e12,
        revenue: 211.9e9,
        employees: 221000,
        founded: 1975,
        country: 'USA',
        esgScore: 89,
        risk: 'Low'
      },
      {
        company: 'Alphabet Inc.',
        symbol: 'GOOGL',
        sector: 'Technology',
        marketCap: 1.81e12,
        revenue: 307.4e9,
        employees: 181000,
        founded: 1998,
        country: 'USA',
        esgScore: 76,
        risk: 'Medium'
      },
      {
        company: 'Tesla Inc.',
        symbol: 'TSLA',
        sector: 'Automotive',
        marketCap: 789e9,
        revenue: 96.8e9,
        employees: 140000,
        founded: 2003,
        country: 'USA',
        esgScore: 71,
        risk: 'High'
      }
    ];

    setEconomicData(mockEconomicData);
    setCorporateData(mockCorporateData);
    setLoading(false);
  }, []);

  const selectedData = economicData[selectedMetric];

  const chartData = selectedData ? {
    labels: selectedData.labels,
    datasets: [
      {
        label: selectedData.label,
        data: selectedData.data,
        borderColor: selectedData.trend === 'up' ? '#10b981' : selectedData.trend === 'down' ? '#ef4444' : '#f59e0b',
        backgroundColor: selectedData.trend === 'up' ? '#10b98120' : selectedData.trend === 'down' ? '#ef444420' : '#f59e0b20',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  } : null;

  const sectorDistribution = {
    labels: ['Technology', 'Healthcare', 'Financial', 'Consumer', 'Industrial', 'Energy'],
    datasets: [
      {
        data: [35, 18, 15, 12, 11, 9],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
          '#06b6d4'
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading business intelligence...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiBriefcase className="w-6 h-6 text-purple-400" />
          Business Intelligence Hub
        </h3>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="gdp">GDP Growth</option>
          <option value="inflation">Inflation Rate</option>
          <option value="unemployment">Unemployment</option>
          <option value="tradeFix">Trade Volume</option>
        </select>
      </div>

      {/* Economic Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Economic Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          {selectedData && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">{selectedData.label}</h4>
                <div className={`flex items-center gap-1 ${
                  selectedData.trend === 'up' ? 'text-green-400' : 
                  selectedData.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  <FiTrendingUp className={`w-4 h-4 ${selectedData.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span className="text-2xl font-bold">{selectedData.value}%</span>
                </div>
              </div>
              <div className="h-48">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      },
                      y: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      }
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Global Market Composition */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Global Market by Sector</h4>
          <div className="h-48 flex items-center justify-center">
            <Doughnut
              data={sectorDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { 
                      color: '#ffffff',
                      font: { size: 10 },
                      padding: 10
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Corporate Intelligence */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiGlobe className="w-5 h-5 text-cyan-400" />
          Corporate Intelligence - Major Players
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corporateData.map((company, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="text-white font-semibold">{company.company}</h5>
                  <p className="text-gray-400 text-sm">{company.symbol} • {company.sector}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  company.risk === 'Low' ? 'bg-green-900 text-green-300' :
                  company.risk === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {company.risk} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white font-semibold">
                    ${(company.marketCap / 1e12).toFixed(2)}T
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Revenue</p>
                  <p className="text-white font-semibold">
                    ${(company.revenue / 1e9).toFixed(1)}B
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Employees</p>
                  <p className="text-white font-semibold">
                    {(company.employees / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">ESG Score</p>
                  <p className={`font-semibold ${
                    company.esgScore >= 80 ? 'text-green-400' :
                    company.esgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {company.esgScore}/100
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Founded {company.founded}</span>
                <span>{company.country}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Health Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <FiTrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Economic Growth</h5>
          <p className="text-green-400">Positive</p>
          <p className="text-gray-400 text-sm">Global expansion continues</p>
        </div>
        
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
          <FiDollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Market Liquidity</h5>
          <p className="text-blue-400">High</p>
          <p className="text-gray-400 text-sm">Ample capital availability</p>
        </div>
        
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
          <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Labor Market</h5>
          <p className="text-purple-400">Stable</p>
          <p className="text-gray-400 text-sm">Employment levels healthy</p>
        </div>
        
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center">
          <FiGlobe className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Trade Activity</h5>
          <p className="text-yellow-400">Robust</p>
          <p className="text-gray-400 text-sm">International commerce strong</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligenceWidget;
