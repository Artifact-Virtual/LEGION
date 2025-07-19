import React, { useEffect, useState } from 'react';

export default function FinancialDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/metrics/financial', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch financial metrics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading financial metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Financial Dashboard</h2>
      <ul>
        <li>Revenue: ${data.summary.revenue}</li>
        <li>Expenses: ${data.summary.expenses}</li>
        <li>Profit: ${data.summary.profit}</li>
      </ul>
      <h3>Trend</h3>
      <ul>
        {data.trend.labels.map((label, i) => (
          <li key={label}>{label}: Revenue ${data.trend.revenue[i]}, Expenses ${data.trend.expenses[i]}</li>
        ))}
      </ul>
    </div>
  );
}
