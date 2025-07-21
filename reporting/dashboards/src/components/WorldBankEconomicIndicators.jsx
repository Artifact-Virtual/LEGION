import React, { useEffect, useState } from 'react';

// World Bank API: https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json
// GDP (current US$), Unemployment (%), Inflation (%)
const INDICATORS = [
  { code: 'NY.GDP.MKTP.CD', label: 'GDP (Current US$)' },
  { code: 'SL.UEM.TOTL.ZS', label: 'Unemployment Rate (%)' },
  { code: 'FP.CPI.TOTL.ZG', label: 'Inflation Rate (%)' }
];

// Simple icons for indicators
const ICONS = {
  'GDP (Current US$)': <svg className="inline mr-1" width="16" height="16" fill="none" stroke="gold" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="gold">$</text></svg>,
  'Unemployment Rate (%)': <svg className="inline mr-1" width="16" height="16" fill="none" stroke="orange" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>,
  'Inflation Rate (%)': <svg className="inline mr-1" width="16" height="16" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/></svg>
};

export default function WorldBankEconomicIndicators() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIndicators() {
      setLoading(true);
      try {
        const results = await Promise.all(
          INDICATORS.map(async indicator => {
            const res = await fetch(`https://api.worldbank.org/v2/country/WLD/indicator/${indicator.code}?format=json&date=2022:2024&per_page=3`);
            const json = await res.json();
            const values = (json[1] || []).map(row => ({
              year: row.date,
              value: row.value,
              label: indicator.label
            }));
            return values;
          })
        );
        setData(results.flat());
        setError(null);
      } catch (e) {
        setError('Failed to fetch World Bank data');
      }
      setLoading(false);
    }
    fetchIndicators();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      Loading World Bank data...
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 text-red-400">
      <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      {error}
    </div>
  );

  // Color code values
  function valueColor(label, value) {
    if (value == null) return 'text-gray-500';
    if (label === 'GDP (Current US$)') return 'text-yellow-400 font-semibold';
    if (label === 'Unemployment Rate (%)') return value > 7 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold';
    if (label === 'Inflation Rate (%)') return value > 5 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold';
    return 'text-blue-400';
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs text-left">
        <thead className="sticky top-0 bg-black z-10">
          <tr className="border-b border-white">
            <th className="px-2 py-1 font-thin text-white">Indicator</th>
            <th className="px-2 py-1 font-thin text-white">Year</th>
            <th className="px-2 py-1 font-thin text-white">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150">
              <td className="px-2 py-1 text-white">
                {ICONS[row.label]}
                {row.label}
              </td>
              <td className="px-2 py-1 text-white">{row.year}</td>
              <td className={`px-2 py-1 ${valueColor(row.label, row.value)}`}>{row.value ? row.value.toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
