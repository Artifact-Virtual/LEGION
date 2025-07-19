import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
        const res = await fetch('/api/metrics/agent-health', {
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
        data: trend.length ? trend : [18, 18, 19, 20, 19, 18, 17],
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
      },
    ],
  };

  if (loading) return <div className="loading">Loading agent health data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Dashboard title="Agent Health Dashboard" className="bg-gradient-to-br from-green-600 to-green-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Healthy Agents</h3>
          <p className="text-3xl font-bold text-white">{health.healthy}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Warnings</h3>
          <p className="text-3xl font-bold text-yellow-300">{health.warnings}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Errors</h3>
          <p className="text-3xl font-bold text-red-300">{health.errors}</p>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Agent Health Trend</h3>
        <div className="h-64">
          <Line data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            },
            scales: {
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255,255,255,0.1)' }
              },
              y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255,255,255,0.1)' }
              }
            }
          }} />
        </div>
      </div>
    </Dashboard>
  );
}
