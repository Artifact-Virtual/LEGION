import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VIRUSTOTAL_API_KEY = process.env.REACT_APP_VIRUSTOTAL_API_KEY || 'YOUR_VIRUSTOTAL_KEY';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3/intelligence/search';

export default function VirusTotalIOCFeed() {
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIOCs() {
      setLoading(true);
      setError(null);
      try {
        // Example: fetch recent malicious URLs
        const res = await axios.get(VIRUSTOTAL_API_URL + '?query=type:url+malicious', {
          headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
        });
        setIocs(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch IOC data');
      } finally {
        setLoading(false);
      }
    }
    fetchIOCs();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      Loading IOCs...
    </div>
  );
  if (error) return (
    <div className="flex items-center gap-2 text-red-400">
      <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      {error}
    </div>
  );

  return (
    <div className="overflow-x-auto w-full h-32">
      <table className="min-w-full text-xs text-left">
        <thead className="sticky top-0 bg-black z-10">
          <tr className="border-b border-white">
            <th className="px-2 py-1 font-thin text-white">Type</th>
            <th className="px-2 py-1 font-thin text-white">Value</th>
            <th className="px-2 py-1 font-thin text-white">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {iocs.map(ioc => (
            <tr key={ioc.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors duration-150">
              <td className="px-2 py-1 text-white">{ioc.type}</td>
              <td className="px-2 py-1 text-white">{ioc.attributes.value}</td>
              <td className="px-2 py-1 text-white">{ioc.attributes.last_modification_date ? new Date(ioc.attributes.last_modification_date * 1000).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
