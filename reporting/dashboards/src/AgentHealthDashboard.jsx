import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { Line } from 'react-chartjs-2';


export default function AgentHealthDashboard() {
  const [health, setHealth] = useState({ healthy: 0, errors: 0, warnings: 0 });
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5001/api/metrics/agent-health', {
          headers: { Authorization: 'Bearer admin-token-123' },
        });
        if (!res.ok) throw new Error('Failed to fetch agent health metrics');
        const data = await res.json();
        if (isMounted) {
          setHealth(data.summary);
          setTrend(data.trend);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
        // Use empty data instead of mock data
        if (isMounted) {
          setHealth({ healthy: 0, errors: 0, warnings: 0 });
          setTrend([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Healthy Agents',
        data: trend.length ? trend : [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  if (loading) return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="text-white">Loading agent health data...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="text-red-400">No real data source connected for agent health: {error}</div>
    </div>
  );

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Agent Health Dashboard</h2>
        {error && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-red-400">Data Unavailable</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Healthy Agents</h3>
          <p className="text-3xl font-bold text-green-400">{health.healthy}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Warnings</h3>
          <p className="text-3xl font-bold text-yellow-400">{health.warnings}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Errors</h3>
          <p className="text-3xl font-bold text-red-400">{health.errors}</p>
        </div>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Agent Health Trend</h3>
        <div className="h-64">
          <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#ffffff' }
              }
            },
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
          }} />
        </div>
      </div>
    </div>
  );
}
