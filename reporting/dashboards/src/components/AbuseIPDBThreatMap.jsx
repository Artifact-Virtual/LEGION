import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ABUSEIPDB_API_KEY = process.env.REACT_APP_ABUSEIPDB_API_KEY || 'YOUR_ABUSEIPDB_KEY';
const ABUSEIPDB_API_URL = 'https://api.abuseipdb.com/api/v2/blacklist';

export default function AbuseIPDBThreatMap() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIPs() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(ABUSEIPDB_API_URL, {
          headers: { Key: ABUSEIPDB_API_KEY, Accept: 'application/json' }
        });
        setIps(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch threat data');
      } finally {
        setLoading(false);
      }
    }
    fetchIPs();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      Loading threats...
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 text-red-400">
      <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      {error}
    </div>
  );

  return (
    <div className="overflow-x-auto w-full h-64">
      <table className="min-w-full text-xs text-left">
        <thead className="sticky top-0 bg-black z-10">
          <tr className="border-b border-white">
            <th className="px-2 py-1 font-thin text-white">IP</th>
            <th className="px-2 py-1 font-thin text-white">Country</th>
            <th className="px-2 py-1 font-thin text-white">Abuse Score</th>
            <th className="px-2 py-1 font-thin text-white">Categories</th>
          </tr>
        </thead>
        <tbody>
          {ips.map(ip => (
            <tr key={ip.ipAddress} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150">
              <td className="px-2 py-1 text-white">{ip.ipAddress}</td>
              <td className="px-2 py-1 text-white">{ip.countryCode}</td>
              <td className={`px-2 py-1 ${ip.abuseConfidenceScore > 75 ? 'text-red-400 font-semibold' : ip.abuseConfidenceScore > 50 ? 'text-yellow-400 font-semibold' : 'text-green-400 font-semibold'}`}>{ip.abuseConfidenceScore}</td>
              <td className="px-2 py-1 text-white">{ip.categories.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
