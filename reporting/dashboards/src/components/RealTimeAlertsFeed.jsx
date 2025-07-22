import React, { useState, useEffect, useRef } from 'react';
import { FiAlertTriangle, FiAlertCircle, FiInfo, FiCheckCircle, FiX, FiRefreshCw } from 'react-icons/fi';

const RealTimeAlertsFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const alertsEndRef = useRef(null);

  const alertTypes = [
    { value: 'all', label: 'All Alerts' },
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' }
  ];

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enterprise/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      setAlerts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message);
      
      // Generate mock alerts for demonstration
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlerts = () => {
    const mockAlerts = [];
    const alertLevels = ['critical', 'warning', 'info', 'success'];
    const sources = [
      'System Monitor', 'API Gateway', 'Database', 'Agent Framework', 
      'Security Scanner', 'Performance Monitor', 'Backup Service', 'Network Monitor'
    ];

    const messages = {
      critical: [
        'Database connection failed',
        'API endpoint returning 500 errors',
        'Agent communication timeout',
        'Disk space critically low',
        'Memory usage exceeded 95%'
      ],
      warning: [
        'High CPU usage detected (>85%)',
        'API response time degraded',
        'Agent performance below threshold',
        'Backup operation delayed',
        'Network latency increased'
      ],
      info: [
        'System maintenance scheduled',
        'New agent deployed successfully',
        'Configuration updated',
        'Routine backup completed',
        'Performance metrics updated'
      ],
      success: [
        'All systems operational',
        'Performance optimization completed',
        'Security scan passed',
        'Agent synchronization successful',
        'Database optimization completed'
      ]
    };

    for (let i = 0; i < 30; i++) {
      const level = alertLevels[Math.floor(Math.random() * alertLevels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[level][Math.floor(Math.random() * messages[level].length)];
      const timestamp = new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000);

      mockAlerts.push({
        id: `alert_${Date.now()}_${i}`,
        level: level,
        source: source,
        message: message,
        timestamp: timestamp.toISOString(),
        acknowledged: Math.random() > 0.7,
        details: {
          affected_components: level === 'critical' ? ['primary_database', 'api_gateway'] : ['monitoring'],
          resolution_time: level === 'success' ? '0s' : `${Math.floor(Math.random() * 300) + 10}s`,
          impact: level === 'critical' ? 'High' : level === 'warning' ? 'Medium' : 'Low'
        }
      });
    }

    return mockAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  useEffect(() => {
    fetchAlerts();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    alertsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [alerts]);

  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return <FiAlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <FiAlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <FiInfo className="w-4 h-4 text-blue-400" />;
      case 'success':
        return <FiCheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <FiInfo className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical':
        return 'border-red-500 bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-900/20';
      case 'success':
        return 'border-green-500 bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(alert => alert.level === filter);

  const getAlertStats = () => {
    const stats = {
      critical: alerts.filter(a => a.level === 'critical' && !a.acknowledged).length,
      warning: alerts.filter(a => a.level === 'warning' && !a.acknowledged).length,
      info: alerts.filter(a => a.level === 'info' && !a.acknowledged).length,
      success: alerts.filter(a => a.level === 'success' && !a.acknowledged).length,
      total: alerts.filter(a => !a.acknowledged).length
    };
    return stats;
  };

  const stats = getAlertStats();

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Real-Time Alerts</h3>
          {stats.total > 0 && (
            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {stats.total}
            </div>
          )}
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
          <div className="text-xs text-red-300">Critical</div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.warning}</div>
          <div className="text-xs text-yellow-300">Warning</div>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.info}</div>
          <div className="text-xs text-blue-300">Info</div>
        </div>
        <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.success}</div>
          <div className="text-xs text-green-300">Success</div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-yellow-500"
        >
          {alertTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded">
          ⚠️ {error} - Showing mock alerts for demonstration
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-gray-800 rounded border border-gray-700 h-80 overflow-y-auto">
        {loading && filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading alerts...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <FiCheckCircle className="w-8 h-8 text-green-400 mr-2" />
            No active alerts
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded p-4 border-l-4 ${getAlertColor(alert.level)} ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.level)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {alert.source}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                            ACK
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        {alert.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        Impact: {alert.details.impact} | 
                        Resolution Time: {alert.details.resolution_time}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-1 text-green-400 hover:bg-green-900/20 rounded"
                        title="Acknowledge"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                      title="Dismiss"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={alertsEndRef} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <span>
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
        <span>
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default RealTimeAlertsFeed;
