import React, { useState, useEffect } from 'react';
import { FiShield, FiActivity, FiAlertTriangle, FiCheckCircle, FiZap, FiServer, FiDatabase, FiWifi } from 'react-icons/fi';

// Real-time metric component
function MetricCard({ icon: Icon, title, value, status, trend, unit = '' }) {
  const statusColors = {
    good: 'text-green-400 border-green-400/30 bg-green-400/10',
    warning: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    critical: 'text-red-400 border-red-400/30 bg-red-400/10'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400'
  };

  return (
    <div className={`metric-card ${statusColors[status]} border-2 hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" />
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-gray-400">{unit}</span>
          {trend && (
            <span className={`text-xs ${trendColors[trend]}`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Security threat indicator
function ThreatLevel({ level }) {
  const levels = {
    low: { color: 'green', intensity: 1 },
    medium: { color: 'yellow', intensity: 2 },
    high: { color: 'orange', intensity: 3 },
    critical: { color: 'red', intensity: 4 }
  };

  const config = levels[level] || levels.low;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2 h-8 rounded-sm ${
              i <= config.intensity
                ? `bg-${config.color}-400 shadow-lg shadow-${config.color}-400/50`
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <div className="text-white">
        <div className="font-medium">Security Level</div>
        <div className={`text-sm text-${config.color}-400 uppercase font-bold`}>
          {level}
        </div>
      </div>
    </div>
  );
}

// System health monitor
function SystemHealth({ systems }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Server className="w-5 h-5 text-blue-400" />
        System Health
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {systems.map((system, index) => (
          <div key={index} className="flex items-center justify-between p-3 glass-card">
            <div className="flex items-center gap-3">
              <system.icon className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">{system.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-white font-mono">{system.value}{system.unit}</div>
                <div className="text-xs text-gray-400">{system.description}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                system.status === 'good' ? 'bg-green-400 animate-pulse' :
                system.status === 'warning' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400 animate-pulse'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Live alerts component
function LiveAlerts({ alerts }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        Live Alerts
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 ${
              alert.severity === 'critical' ? 'bg-red-400/10 border-red-400' :
              alert.severity === 'warning' ? 'bg-yellow-400/10 border-yellow-400' :
              'bg-blue-400/10 border-blue-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-white">{alert.title}</div>
                <div className="text-sm text-gray-300">{alert.message}</div>
                <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.severity === 'critical' ? 'bg-red-400/20 text-red-400' :
                alert.severity === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                'bg-blue-400/20 text-blue-400'
              }`}>
                {alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SecurityHealthPanel() {
  const [metrics, setMetrics] = useState({});
  const [threatLevel, setThreatLevel] = useState('low');
  const [systems, setSystems] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Simulate real-time data
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        cpuUsage: Math.floor(Math.random() * 30 + 20),
        memoryUsage: Math.floor(Math.random() * 40 + 30),
        networkActivity: Math.floor(Math.random() * 1000 + 500),
        activeConnections: Math.floor(Math.random() * 50 + 100),
        agentsOnline: Math.floor(Math.random() * 3 + 16),
        systemUptime: '99.97'
      });

      setSystems([
        {
          name: 'Database',
          icon: Database,
          value: Math.floor(Math.random() * 20 + 80),
          unit: '%',
          description: 'Query performance',
          status: 'good'
        },
        {
          name: 'API Gateway',
          icon: Wifi,
          value: Math.floor(Math.random() * 100 + 200),
          unit: 'ms',
          description: 'Response time',
          status: Math.random() > 0.8 ? 'warning' : 'good'
        },
        {
          name: 'Agent Network',
          icon: Activity,
          value: Math.floor(Math.random() * 3 + 16),
          unit: '/18',
          description: 'Active agents',
          status: 'good'
        },
        {
          name: 'Security Monitor',
          icon: Shield,
          value: Math.floor(Math.random() * 10000 + 50000),
          unit: ' scans',
          description: 'Threat scans/hr',
          status: 'good'
        }
      ]);

      // Randomly change threat level
      if (Math.random() > 0.9) {
        const levels = ['low', 'medium', 'high'];
        setThreatLevel(levels[Math.floor(Math.random() * levels.length)]);
      }
    };

    const updateAlerts = () => {
      const alertTypes = [
        { title: 'High CPU Usage', message: 'Agent processing load increased', severity: 'warning' },
        { title: 'New Security Scan', message: 'Automated security check completed', severity: 'info' },
        { title: 'Database Optimization', message: 'Query performance improved', severity: 'info' },
        { title: 'Network Latency', message: 'Slight increase in response time', severity: 'warning' },
        { title: 'Agent Restart', message: 'Marketing agent successfully restarted', severity: 'info' }
      ];

      if (Math.random() > 0.7) {
        const newAlert = {
          ...alertTypes[Math.floor(Math.random() * alertTypes.length)],
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    };

    updateMetrics();
    updateAlerts();

    const metricsInterval = setInterval(updateMetrics, 3000);
    const alertsInterval = setInterval(updateAlerts, 5000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(alertsInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-artifact-400" />
          Security & Health Dashboard
        </h2>
        <div className="glass-panel px-4 py-2">
          <ThreatLevel level={threatLevel} />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={Zap}
          title="CPU Usage"
          value={metrics.cpuUsage}
          unit="%"
          status={metrics.cpuUsage > 80 ? 'critical' : metrics.cpuUsage > 60 ? 'warning' : 'good'}
          trend="stable"
        />
        <MetricCard
          icon={Activity}
          title="Memory"
          value={metrics.memoryUsage}
          unit="%"
          status={metrics.memoryUsage > 85 ? 'critical' : metrics.memoryUsage > 70 ? 'warning' : 'good'}
          trend="up"
        />
        <MetricCard
          icon={Wifi}
          title="Network"
          value={metrics.networkActivity}
          unit="MB/s"
          status="good"
          trend="stable"
        />
        <MetricCard
          icon={Server}
          title="Connections"
          value={metrics.activeConnections}
          unit=""
          status="good"
          trend="down"
        />
        <MetricCard
          icon={CheckCircle}
          title="Agents Online"
          value={`${metrics.agentsOnline}/18`}
          unit=""
          status={metrics.agentsOnline < 16 ? 'warning' : 'good'}
          trend="stable"
        />
        <MetricCard
          icon={Activity}
          title="Uptime"
          value={metrics.systemUptime}
          unit="%"
          status="good"
          trend="stable"
        />
      </div>

      {/* System Health and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel">
          <SystemHealth systems={systems} />
        </div>
        <div className="glass-panel">
          <LiveAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
