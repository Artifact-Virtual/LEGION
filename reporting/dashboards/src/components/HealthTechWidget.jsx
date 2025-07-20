import React, { useState, useEffect } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { FiActivity, FiHeart, FiTrendingUp, FiAlertTriangle, FiTarget } from 'react-icons/fi';

const HealthTechWidget = () => {
  const [healthData, setHealthData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('pandemic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock health and medical data
    const mockHealthData = {
      pandemic: {
        label: 'Global Health Status',
        current: 'Stable',
        newCases: 125000,
        trend: 'down',
        data: [180000, 165000, 150000, 140000, 130000, 125000, 120000],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
      },
      medicalBreakthroughs: [
        {
          title: 'CRISPR Gene Therapy Breakthrough',
          date: '2024-12-15',
          impact: 'High',
          category: 'Genetics',
          description: 'New treatment for inherited blindness shows 95% success rate'
        },
        {
          title: 'AI-Powered Cancer Detection',
          date: '2024-12-10',
          impact: 'High',
          category: 'Oncology',
          description: 'Machine learning model detects early-stage cancer with 99% accuracy'
        },
        {
          title: 'Longevity Drug Trial Results',
          date: '2024-12-05',
          impact: 'Medium',
          category: 'Anti-Aging',
          description: 'Clinical trial shows 30% increase in healthy lifespan in mammals'
        }
      ],
      drugDevelopment: {
        totalDrugs: 15420,
        inTrial: 3890,
        approved: 245,
        failed: 1240,
        phaseDistribution: [1200, 1890, 800, 245]
      },
      globalHealth: {
        vaccinated: 68.5,
        lifeExpectancy: 73.2,
        infantMortality: 28.2,
        chronicDiseases: 15.8
      }
    };

    setHealthData(mockHealthData);
    setLoading(false);
  }, []);

  const pandemicChartData = healthData.pandemic ? {
    labels: healthData.pandemic.labels,
    datasets: [
      {
        label: 'New Cases',
        data: healthData.pandemic.data,
        borderColor: healthData.pandemic.trend === 'up' ? '#ef4444' : '#10b981',
        backgroundColor: healthData.pandemic.trend === 'up' ? '#ef444420' : '#10b98120',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  } : null;

  const drugPhaseData = healthData.drugDevelopment ? {
    labels: ['Phase I', 'Phase II', 'Phase III', 'Approved'],
    datasets: [
      {
        label: 'Drugs in Development',
        data: healthData.drugDevelopment.phaseDistribution,
        backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
        borderColor: ['#1d4ed8', '#6d28d9', '#d97706', '#059669'],
        borderWidth: 2,
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading health technology data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiHeart className="w-6 h-6 text-red-400" />
          Health Technology Intelligence
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            healthData.pandemic?.current === 'Stable' ? 'bg-green-900 text-green-300' :
            healthData.pandemic?.current === 'Rising' ? 'bg-yellow-900 text-yellow-300' :
            'bg-red-900 text-red-300'
          }`}>
            {healthData.pandemic?.current}
          </span>
        </div>
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FiActivity className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-400">Global</span>
          </div>
          <p className="text-white text-2xl font-bold">{healthData.globalHealth?.vaccinated}%</p>
          <p className="text-gray-400 text-sm">Population Vaccinated</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="w-6 h-6 text-green-400" />
            <span className="text-xs text-gray-400">Average</span>
          </div>
          <p className="text-white text-2xl font-bold">{healthData.globalHealth?.lifeExpectancy}</p>
          <p className="text-gray-400 text-sm">Life Expectancy (years)</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FiAlertTriangle className="w-6 h-6 text-yellow-400" />
            <span className="text-xs text-gray-400">Per 1000</span>
          </div>
          <p className="text-white text-2xl font-bold">{healthData.globalHealth?.infantMortality}</p>
          <p className="text-gray-400 text-sm">Infant Mortality Rate</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FiTarget className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-gray-400">Population %</span>
          </div>
          <p className="text-white text-2xl font-bold">{healthData.globalHealth?.chronicDiseases}%</p>
          <p className="text-gray-400 text-sm">Chronic Diseases</p>
        </div>
      </div>

      {/* Pandemic Tracking & Drug Development */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pandemic Trends */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Global Health Monitoring</h4>
          {healthData.pandemic && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">New Cases (Weekly)</span>
                <div className={`flex items-center gap-1 ${
                  healthData.pandemic.trend === 'up' ? 'text-red-400' : 'text-green-400'
                }`}>
                  <FiTrendingUp className={`w-4 h-4 ${healthData.pandemic.trend === 'up' ? 'rotate-180' : ''}`} />
                  <span className="font-bold">{healthData.pandemic.newCases.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-48">
                <Line
                  data={pandemicChartData}
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

        {/* Drug Development Pipeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4">Drug Development Pipeline</h4>
          {healthData.drugDevelopment && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">Total in Development</p>
                  <p className="text-white text-xl font-bold">{healthData.drugDevelopment.totalDrugs.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">In Clinical Trials</p>
                  <p className="text-white text-xl font-bold">{healthData.drugDevelopment.inTrial.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Recently Approved</p>
                  <p className="text-green-400 text-xl font-bold">{healthData.drugDevelopment.approved}</p>
                </div>
                <div>
                  <p className="text-gray-400">Failed Trials</p>
                  <p className="text-red-400 text-xl font-bold">{healthData.drugDevelopment.failed}</p>
                </div>
              </div>
              <div className="h-32">
                <div className="flex items-end justify-between h-full">
                  {drugPhaseData.labels.map((label, index) => (
                    <div key={label} className="flex flex-col items-center">
                      <div 
                        className="w-8 rounded-t"
                        style={{
                          height: `${(drugPhaseData.datasets[0].data[index] / Math.max(...drugPhaseData.datasets[0].data)) * 100}%`,
                          backgroundColor: drugPhaseData.datasets[0].backgroundColor[index]
                        }}
                      />
                      <span className="text-xs text-gray-400 mt-2">{label}</span>
                      <span className="text-xs text-white font-semibold">{drugPhaseData.datasets[0].data[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Medical Breakthroughs */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4">Recent Medical Breakthroughs</h4>
        <div className="space-y-4">
          {healthData.medicalBreakthroughs?.map((breakthrough, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="text-white font-semibold">{breakthrough.title}</h5>
                  <p className="text-gray-400 text-sm">{breakthrough.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    breakthrough.impact === 'High' ? 'bg-red-900 text-red-300' :
                    breakthrough.impact === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {breakthrough.impact} Impact
                  </span>
                  <span className="text-xs text-gray-500">{breakthrough.date}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cyan-400">{breakthrough.category}</span>
                <span className="text-xs text-gray-500">Clinical Research</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Technology Sectors */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
          <FiActivity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Digital Health</h5>
          <p className="text-blue-400">$350B Market</p>
          <p className="text-gray-400 text-sm">Telemedicine & Apps</p>
        </div>
        
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
          <FiTarget className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Precision Medicine</h5>
          <p className="text-purple-400">$230B Market</p>
          <p className="text-gray-400 text-sm">Personalized Treatments</p>
        </div>
        
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <FiHeart className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Biotechnology</h5>
          <p className="text-green-400">$450B Market</p>
          <p className="text-gray-400 text-sm">Gene & Cell Therapy</p>
        </div>
      </div>
    </div>
  );
};

export default HealthTechWidget;
