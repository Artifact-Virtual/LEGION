import React, { useEffect, useState } from 'react';

export default function ComplianceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/metrics/compliance', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch compliance metrics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading compliance metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Compliance Dashboard</h2>
      <ul>
        <li>Audits Passed: {data.audits_passed}</li>
        <li>Audits Failed: {data.audits_failed}</li>
        <li>Compliance Score: {data.compliance_score.toFixed(1)}%</li>
      </ul>
    </div>
  );
}
