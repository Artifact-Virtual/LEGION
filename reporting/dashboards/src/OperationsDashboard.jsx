import React, { useEffect, useState } from 'react';

export default function OperationsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/metrics/operations', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch operations metrics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading operations metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Operations Dashboard</h2>
      <ul>
        <li>Tasks Completed: {data.tasks_completed}</li>
        <li>Tasks Pending: {data.tasks_pending}</li>
        <li>Efficiency: {data.efficiency.toFixed(1)}%</li>
      </ul>
    </div>
  );
}
