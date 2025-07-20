import React, { useState, useEffect } from 'react';
import { FiShield, FiAlertTriangle, FiActivity, FiGlobe, FiEye, FiTarget } from 'react-icons/fi';

const CybersecurityDashboard = () => {
  const [threatData, setThreatData] = useState([]);
  const [ipReputationData, setIpReputationData] = useState({});
  const [threatLevel, setThreatLevel] = useState('LOW');
  const [malwareDetections, setMalwareDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock cybersecurity data
    const mockThreatData = [
      {
        id: 1,
        type: 'Malware',
        severity: 'HIGH',
        source: '192.168.1.100',
        target: 'Web Server',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'Blocked',
        description: 'Attempted trojan injection detected and blocked'
      },
      {
        id: 2,
        type: 'Phishing',
        severity: 'MEDIUM',
        source: 'suspicious-email.com',
        target: 'Email Gateway',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'Quarantined',
        description: 'Phishing email attempt quarantined'
      },
      {
        id: 3,
        type: 'DDoS',
        severity: 'LOW',
        source: 'Multiple IPs',
        target: 'Load Balancer',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'Mitigated',
        description: 'Low-volume DDoS attack mitigated'
      }
    ];

    const mockIpReputationData = {
      totalQueries: 1247,
      maliciousIPs: 23,
      cleanIPs: 1224,
      topMaliciousCountries: [
        { country: 'Russia', count: 8 },
        { country: 'China', count: 6 },
        { country: 'North Korea', count: 4 },
        { country: 'Iran', count: 3 },
        { country: 'Unknown', count: 2 }
      ]
    };

    const mockMalwareDetections = [
      {
        name: 'Trojan.Win32.Agent',
        detections: 45,
        risk: 'HIGH',
        firstSeen: '2025-07-20T08:30:00Z'
      },
      {
        name: 'Adware.Generic',
        detections: 23,
        risk: 'MEDIUM',
        firstSeen: '2025-07-20T10:15:00Z'
      },
      {
        name: 'PUA.InstallCore',
        detections: 12,
        risk: 'LOW',
        firstSeen: '2025-07-20T12:45:00Z'
      }
    ];

    setThreatData(mockThreatData);
    setIpReputationData(mockIpReputationData);
    setMalwareDetections(mockMalwareDetections);
    setLoading(false);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-900 text-red-300 border-red-700';
      case 'MEDIUM': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'LOW': return 'bg-green-900 text-green-300 border-green-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Blocked': return 'text-red-400';
      case 'Quarantined': return 'text-yellow-400';
      case 'Mitigated': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading cybersecurity data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiShield className="w-6 h-6 text-blue-400" />
          Cybersecurity Command Center
        </h3>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-lg border text-sm font-semibold ${getSeverityColor(threatLevel)}`}>
            Threat Level: {threatLevel}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Systems Protected</span>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
          <FiAlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Active Threats</h5>
          <p className="text-red-400 text-2xl font-bold">{threatData.length}</p>
          <p className="text-gray-400 text-sm">Last 24 hours</p>
        </div>
        
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center">
          <FiEye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">IP Scans</h5>
          <p className="text-yellow-400 text-2xl font-bold">{ipReputationData.totalQueries}</p>
          <p className="text-gray-400 text-sm">Today</p>
        </div>
        
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <FiTarget className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Blocked</h5>
          <p className="text-green-400 text-2xl font-bold">{ipReputationData.maliciousIPs}</p>
          <p className="text-gray-400 text-sm">Malicious IPs</p>
        </div>
        
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
          <FiActivity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Clean Traffic</h5>
          <p className="text-blue-400 text-2xl font-bold">
            {Math.round((ipReputationData.cleanIPs / ipReputationData.totalQueries) * 100)}%
          </p>
          <p className="text-gray-400 text-sm">Success rate</p>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-400" />
            Recent Threat Activity
          </h4>
          <div className="space-y-4">
            {threatData.map((threat) => (
              <div key={threat.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                  <span className={`text-sm ${getStatusColor(threat.status)}`}>
                    {threat.status}
                  </span>
                </div>
                <h5 className="text-white font-semibold">{threat.type}</h5>
                <p className="text-gray-400 text-sm mb-2">{threat.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Source: {threat.source}</span>
                  <span>{new Date(threat.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Malware Detection */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiShield className="w-5 h-5 text-purple-400" />
            Malware Detection Summary
          </h4>
          <div className="space-y-4">
            {malwareDetections.map((malware, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-white font-semibold text-sm">{malware.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(malware.risk)}`}>
                    {malware.risk}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-semibold">{malware.detections} detections</span>
                  <span className="text-gray-400 text-xs">
                    First seen: {new Date(malware.firstSeen).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Threat Distribution */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiGlobe className="w-5 h-5 text-cyan-400" />
          Threat Geography - Top Malicious Sources
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ipReputationData.topMaliciousCountries.map((country, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {country.country === 'Russia' ? '🇷🇺' :
                 country.country === 'China' ? '🇨🇳' :
                 country.country === 'North Korea' ? '🇰🇵' :
                 country.country === 'Iran' ? '🇮🇷' : '🏴‍☠️'}
              </div>
              <h5 className="text-white font-semibold text-sm">{country.country}</h5>
              <p className="text-red-400 font-semibold">{country.count}</p>
              <p className="text-gray-400 text-xs">malicious IPs</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-3">🛡️ Security Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-gray-300">
            • Enable two-factor authentication for all admin accounts
          </div>
          <div className="text-gray-300">
            • Update firewall rules to block suspicious IP ranges
          </div>
          <div className="text-gray-300">
            • Schedule security audit for next week
          </div>
        </div>
      </div>
    </div>
  );
};

export default CybersecurityDashboard;
