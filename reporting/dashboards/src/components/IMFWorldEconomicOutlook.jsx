import React, { useEffect, useState } from 'react';

// IMF World Economic Outlook API (public, no signup): https://www.imf.org/external/datamapper/api/v1
// Example: https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/all?year=2022,2023,2024
const INDICATORS = [
  { code: 'NGDP_RPCH', label: 'GDP Growth (%)' },
  { code: 'PCPIPCH', label: 'Inflation Rate (%)' },
  { code: 'UNEMP_R', label: 'Unemployment Rate (%)' }
];

export default function IMFWorldEconomicOutlook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIndicators() {
      setLoading(true);
      try {
        const results = await Promise.all(
          INDICATORS.map(async indicator => {
            const res = await fetch(`https://www.imf.org/external/datamapper/api/v1/${indicator.code}/WEOADV?year=2022,2023,2024`);
            const json = await res.json();
            // Data format: { WEOADV: { 2022: value, 2023: value, 2024: value } }
            const country = json[indicator.code]?.WEOADV || {};
            return Object.entries(country).map(([year, value]) => ({
              year,
              value,
              label: indicator.label
            }));
          })
        );
        setData(results.flat());
        setError(null);
      } catch (e) {
        setError('Failed to fetch IMF data');
      }
      setLoading(false);
    }
    fetchIndicators();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      Loading IMF data...
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 text-red-400">
      <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      {error}
    </div>
  );

  function valueColor(label, value) {
    if (value == null) return 'text-gray-500';
    if (label === 'GDP Growth (%)') return value > 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold';
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
              <td className="px-2 py-1 text-white">{row.label}</td>
              <td className="px-2 py-1 text-white">{row.year}</td>
              <td className={`px-2 py-1 ${valueColor(row.label, row.value)}`}>{row.value ? row.value.toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
