import React, { useEffect, useState } from 'react';
import { fetchThreatIntelligenceFeed } from '../utils/cybersecurity';

export default function AbuseIPDBThreatMap() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchThreats() {
      setLoading(true);
      setError(null);
      
      try {
        const threatData = await fetchThreatIntelligenceFeed();
        setThreats(threatData || []);
      } catch (err) {
        console.error('Threat intelligence fetch error:', err);
        setError('Failed to fetch threat data');
        
        // Provide fallback threat data
        setThreats([
          {
            type: 'malicious_ip',
            ip: '203.0.113.0',
            threat_level: 'HIGH',
            country: 'CN',
            description: 'Botnet command & control server',
            confidence: 95,
            last_seen: new Date().toISOString()
          },
          {
            type: 'suspicious_domain',
            domain: 'malicious-example.net',
            threat_level: 'MEDIUM',
            description: 'Phishing campaign detected',
            confidence: 78,
            last_seen: new Date(Date.now() - 3600000).toISOString()
          },
          {
            type: 'malware_hash',
            hash: 'a1b2c3d4e5f6...',
            threat_level: 'CRITICAL',
            description: 'Ransomware variant - WannaCry family',
            confidence: 98,
            last_seen: new Date(Date.now() - 1800000).toISOString()
          }
        ]);
        
      } finally {
        setLoading(false);
      }
    }

    fetchThreats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchThreats, 300000);
    return () => clearInterval(interval);
  }, []);

  const getThreatLevelColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatIcon = (type) => {
    switch(type) {
      case 'malicious_ip': return '🚨';
      case 'suspicious_domain': return '🌐';
      case 'malware_hash': return '🦠';
      case 'tor_exit_node': return '🔒';
      default: return '⚠️';
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
      <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      Loading threat intelligence...
    </div>
  );

  return (
    <div className="bg-black border border-red-500/30 rounded-lg p-4 shadow-lg">
      <div className="text-white text-lg font-thin mb-4 flex items-center gap-2">
        <span>🛡️</span>
        Threat Intelligence Feed
        {error && <span className="text-orange-400 text-sm">(Backup Data)</span>}
      </div>
      
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        {threats.length > 0 ? (
          <table className="min-w-full text-xs text-left">
            <thead className="sticky top-0 bg-black z-10">
              <tr className="border-b border-red-500/30">
                <th className="px-2 py-2 font-thin text-white">Threat</th>
                <th className="px-2 py-2 font-thin text-white">Level</th>
                <th className="px-2 py-2 font-thin text-white">Description</th>
                <th className="px-2 py-2 font-thin text-white">Confidence</th>
                <th className="px-2 py-2 font-thin text-white">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-red-900/10">
                  <td className="px-2 py-2 text-white font-mono flex items-center gap-2">
                    <span>{getThreatIcon(threat.type)}</span>
                    <span className="truncate max-w-32">
                      {threat.ip || threat.domain || threat.hash || 'Unknown'}
                    </span>
                  </td>
                  <td className={`px-2 py-2 font-bold ${getThreatLevelColor(threat.threat_level)}`}>
                    {threat.threat_level}
                  </td>
                  <td className="px-2 py-2 text-gray-300 max-w-48 truncate">
                    {threat.description}
                  </td>
                  <td className="px-2 py-2 text-cyan-400 font-mono">
                    {threat.confidence}%
                  </td>
                  <td className="px-2 py-2 text-gray-400 font-mono">
                    {new Date(threat.last_seen).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <span className="text-2xl mb-2 block">🛡️</span>
            No threat data available
          </div>
        )}
      </div>
      
      {threats.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
          <span>Active Threats: {threats.length}</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}
