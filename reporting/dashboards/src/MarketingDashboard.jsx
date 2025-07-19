import React, { useEffect, useState } from 'react';

export default function MarketingDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/metrics/marketing', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch marketing metrics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading marketing metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Marketing Dashboard</h2>
      <ul>
        <li>Campaigns: {data.campaigns}</li>
        <li>Leads: {data.leads}</li>
        <li>Conversion Rate: {data.conversion_rate.toFixed(2)}%</li>
      </ul>
    </div>
  );
}
