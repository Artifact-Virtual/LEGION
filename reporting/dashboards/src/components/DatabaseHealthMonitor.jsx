import React, { useState, useEffect } from 'react';
import { FiDatabase, FiRefreshCw, FiCheck, FiX, FiAlertTriangle, FiHardDrive, FiCpu, FiActivity } from 'react-icons/fi';

const DatabaseHealthMonitor = () => {
  const [dbHealth, setDbHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const databases = [
    { name: 'Enterprise Operations', file: 'enterprise_operations.db', type: 'SQLite', critical: true },
    { name: 'CRM Database', file: 'crm.db', type: 'SQLite', critical: true },
    { name: 'Projects Database', file: 'projects.db', type: 'SQLite', critical: false },
    { name: 'Legion Active System', file: 'active_system.db', type: 'SQLite', critical: true },
    { name: 'Communication Cache', file: 'communication/cache.db', type: 'SQLite', critical: false },
    { name: 'Financial Data', file: 'finance/data/financial.db', type: 'SQLite', critical: true },
    { name: 'Monitoring Metrics', file: 'monitoring/metrics.db', type: 'SQLite', critical: false }
  ];

  const checkDatabaseHealth = async () => {
    setLoading(true);
    const healthResults = [];

    for (const db of databases) {
      try {
        // In a real implementation, this would make actual API calls to check database health
        const mockHealth = generateMockDbHealth(db);
        healthResults.push(mockHealth);
      } catch (err) {
        const errorHealth = {
          name: db.name,
          file: db.file,
          type: db.type,
          critical: db.critical,
          status: 'error',
          connectionStatus: 'failed',
          lastError: err.message,
          lastChecked: new Date().toISOString()
        };
        healthResults.push(errorHealth);
      }
    }

    setDbHealth(healthResults);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const generateMockDbHealth = (db) => {
    const isHealthy = Math.random() > (db.critical ? 0.05 : 0.15); // Critical DBs more likely to be healthy
    const fileSize = Math.floor(Math.random() * 500) + 10; // 10-510 MB
    const connections = Math.floor(Math.random() * 50) + 1;
    const queryTime = Math.floor(Math.random() * 100) + 5; // 5-105ms
    
    const status = isHealthy ? 'healthy' : 
                  Math.random() > 0.7 ? 'warning' : 'critical';
    
    return {
      name: db.name,
      file: db.file,
      type: db.type,
      critical: db.critical,
      status: status,
      connectionStatus: isHealthy ? 'connected' : 'timeout',
      fileSize: fileSize,
      connections: connections,
      maxConnections: 100,
      avgQueryTime: queryTime,
      lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Within last 24 hours
      diskUsage: Math.floor(Math.random() * 90) + 10,
      uptime: Math.random() * 100,
      transactions: Math.floor(Math.random() * 10000) + 100,
      errorRate: Math.random() * 5, // 0-5% error rate
      lastError: !isHealthy ? ['Connection timeout', 'Lock timeout', 'Disk space low', 'High memory usage'][Math.floor(Math.random() * 4)] : null,
      lastChecked: new Date().toISOString(),
      performance: {
        reads: Math.floor(Math.random() * 1000) + 10,
        writes: Math.floor(Math.random() * 500) + 5,
        cacheHitRate: 70 + Math.random() * 25 // 70-95%
      }
    };
  };

  useEffect(() => {
    checkDatabaseHealth();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(checkDatabaseHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <FiCheck className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'critical':
        return <FiX className="w-4 h-4 text-red-400" />;
      default:
        return <FiDatabase className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-green-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'critical':
        return 'border-red-500 bg-red-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getFileSizeColor = (sizeInMB) => {
    if (sizeInMB < 100) return 'text-green-400';
    if (sizeInMB < 300) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQueryTimeColor = (queryTime) => {
    if (queryTime < 50) return 'text-green-400';
    if (queryTime < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOverallHealth = () => {
    if (dbHealth.length === 0) return { status: 'unknown', percentage: 0 };
    
    const healthyCount = dbHealth.filter(db => db.status === 'healthy').length;
    const percentage = Math.round((healthyCount / dbHealth.length) * 100);
    
    const criticalIssues = dbHealth.filter(db => db.critical && db.status === 'critical').length;
    
    let status = 'healthy';
    if (criticalIssues > 0) status = 'critical';
    else if (percentage < 70) status = 'warning';
    
    return { status, percentage, healthyCount, total: dbHealth.length, criticalIssues };
  };

  const getTotalMetrics = () => {
    return dbHealth.reduce((acc, db) => {
      acc.totalSize += db.fileSize || 0;
      acc.totalConnections += db.connections || 0;
      acc.totalTransactions += db.transactions || 0;
      return acc;
    }, { totalSize: 0, totalConnections: 0, totalTransactions: 0 });
  };

  const overallHealth = getOverallHealth();
  const totalMetrics = getTotalMetrics();

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiDatabase className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Database Health Monitor</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(overallHealth.status)}
            <span className={`text-sm font-semibold ${
              overallHealth.status === 'healthy' ? 'text-green-400' :
              overallHealth.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {overallHealth.percentage}% Healthy
            </span>
          </div>
        </div>

        <button
          onClick={checkDatabaseHealth}
          disabled={loading}
          className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {dbHealth.length}
          </div>
          <div className="text-xs text-blue-300">Total Databases</div>
        </div>
        <div className="bg-green-900/20 border border-green-500/30 rounded p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {totalMetrics.totalSize.toFixed(0)}MB
          </div>
          <div className="text-xs text-green-300">Total Size</div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {totalMetrics.totalConnections}
          </div>
          <div className="text-xs text-yellow-300">Active Connections</div>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {totalMetrics.totalTransactions.toLocaleString()}
          </div>
          <div className="text-xs text-purple-300">Transactions</div>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded">
          ⚠️ {error} - Showing mock data for demonstration
        </div>
      )}

      {/* Database Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dbHealth.map((db) => (
          <div
            key={db.name}
            className={`rounded-lg p-4 border ${getStatusColor(db.status)} ${
              db.critical ? 'ring-2 ring-orange-500/50' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(db.status)}
                <span className="text-sm font-semibold text-white">
                  {db.name}
                </span>
              </div>
              {db.critical && (
                <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                  CRITICAL
                </span>
              )}
            </div>

            {/* Database Info */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Type</span>
                <span className="text-xs font-mono text-blue-400">{db.type}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">File Size</span>
                <span className={`text-xs font-mono ${getFileSizeColor(db.fileSize)}`}>
                  {db.fileSize}MB
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Connections</span>
                <span className="text-xs font-mono text-yellow-400">
                  {db.connections}/{db.maxConnections}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Query Time</span>
                <span className={`text-xs font-mono ${getQueryTimeColor(db.avgQueryTime)}`}>
                  {db.avgQueryTime}ms
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            {db.performance && (
              <div className="bg-gray-800/50 rounded p-2 mb-3">
                <div className="text-xs text-gray-400 mb-1">Performance</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <FiActivity className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-300">R: {db.performance.reads}/s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCpu className="w-3 h-3 text-green-400" />
                    <span className="text-gray-300">W: {db.performance.writes}/s</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Cache Hit: </span>
                    <span className="text-green-400">{db.performance.cacheHitRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Details */}
            <div className="space-y-1">
              {db.lastError && (
                <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                  Error: {db.lastError}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Last backup: {new Date(db.lastBackup).toLocaleDateString()}
              </div>
              
              <div className="text-xs text-gray-500">
                Uptime: {db.uptime.toFixed(1)}%
              </div>
              
              <div className="text-xs text-gray-500">
                Last checked: {new Date(db.lastChecked).toLocaleTimeString()}
              </div>
            </div>

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
              <div className={`w-2 h-2 rounded-full ${
                db.connectionStatus === 'connected' ? 'bg-green-400' : 
                db.connectionStatus === 'timeout' ? 'bg-red-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs text-gray-400 capitalize">
                {db.connectionStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-4">
        <span>
          Monitoring {dbHealth.length} databases ({dbHealth.filter(db => db.critical).length} critical)
        </span>
        <span>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default DatabaseHealthMonitor;
