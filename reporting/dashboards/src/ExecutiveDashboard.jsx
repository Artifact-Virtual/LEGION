import React, { useEffect, useState } from 'react';

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/metrics/executive', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch executive metrics');
        return res.json();
      })
      .then(data => setKpis(data.kpis))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading executive metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!kpis) return null;

  return (
    <div>
      <h2>Executive Dashboard</h2>
      <ul>
        <li>Growth: {kpis.growth.toFixed(2)}%</li>
        <li>Customer Satisfaction: {kpis.customer_satisfaction.toFixed(1)}%</li>
        <li>Market Share: {kpis.market_share.toFixed(1)}%</li>
      </ul>
    </div>
  );
}
