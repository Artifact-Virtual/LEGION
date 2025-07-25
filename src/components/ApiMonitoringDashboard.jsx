// components/ApiMonitoringDashboard.jsx

import React, { useState, useEffect } from 'react';
import './ApiMonitoringDashboard.css';

const ApiMonitoringDashboard = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // overview, health, performance, management, quotas, alerts, integration
  const [timeRange, setTimeRange] = useState('24h'); // 1h, 6h, 24h, 7d, 30d
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate comprehensive API monitoring data
  const generateApiData = () => {
    const apis = [
      // Financial APIs
      {
        id: 'coingecko',
        name: 'CoinGecko',
        category: 'Financial',
        status: 'healthy',
        uptime: 99.8,
        responseTime: 245,
        errorRate: 0.12,
        requestsPerHour: 1847,
        quotaUsed: 67,
        quotaLimit: 10000,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 94.2,
        endpoints: [
          { path: '/simple/price', status: 'healthy', avgResponseTime: 180 },
          { path: '/coins/markets', status: 'healthy', avgResponseTime: 320 },
          { path: '/coins/{id}', status: 'healthy', avgResponseTime: 290 }
        ],
        metrics: {
          totalRequests: 45628,
          successfulRequests: 45573,
          failedRequests: 55,
          avgDailyRequests: 1523,
          peakHour: '14:00',
          peakRequests: 847
        },
        configuration: {
          baseUrl: 'https://api.coingecko.com/api/v3',
          rateLimit: '10 calls/minute',
          timeout: 5000,
          retries: 3,
          authentication: 'API Key'
        }
      },
      {
        id: 'polygon',
        name: 'Polygon.io',
        category: 'Financial',
        status: 'healthy',
        uptime: 99.5,
        responseTime: 425,
        errorRate: 0.28,
        requestsPerHour: 967,
        quotaUsed: 45,
        quotaLimit: 5000,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 91.7,
        endpoints: [
          { path: '/v2/aggs/ticker', status: 'healthy', avgResponseTime: 380 },
          { path: '/v3/reference/tickers', status: 'healthy', avgResponseTime: 450 },
          { path: '/v2/snapshot/locale', status: 'warning', avgResponseTime: 680 }
        ],
        metrics: {
          totalRequests: 28947,
          successfulRequests: 28866,
          failedRequests: 81,
          avgDailyRequests: 963,
          peakHour: '09:30',
          peakRequests: 445
        },
        configuration: {
          baseUrl: 'https://api.polygon.io',
          rateLimit: '5 calls/minute',
          timeout: 8000,
          retries: 2,
          authentication: 'API Key'
        }
      },
      {
        id: 'alpha_vantage',
        name: 'Alpha Vantage',
        category: 'Financial',
        status: 'warning',
        uptime: 97.2,
        responseTime: 1240,
        errorRate: 2.8,
        requestsPerHour: 234,
        quotaUsed: 89,
        quotaLimit: 500,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 76.4,
        endpoints: [
          { path: '/query?function=TIME_SERIES_DAILY', status: 'warning', avgResponseTime: 1850 },
          { path: '/query?function=GLOBAL_QUOTE', status: 'healthy', avgResponseTime: 980 },
          { path: '/query?function=CURRENCY_EXCHANGE_RATE', status: 'critical', avgResponseTime: 2400 }
        ],
        metrics: {
          totalRequests: 8947,
          successfulRequests: 8697,
          failedRequests: 250,
          avgDailyRequests: 298,
          peakHour: '11:00',
          peakRequests: 89
        },
        configuration: {
          baseUrl: 'https://www.alphavantage.co',
          rateLimit: '5 calls/minute',
          timeout: 15000,
          retries: 1,
          authentication: 'API Key'
        }
      },
      // Cybersecurity APIs
      {
        id: 'virustotal',
        name: 'VirusTotal',
        category: 'Cybersecurity',
        status: 'healthy',
        uptime: 99.1,
        responseTime: 680,
        errorRate: 0.45,
        requestsPerHour: 456,
        quotaUsed: 32,
        quotaLimit: 1000,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 88.6,
        endpoints: [
          { path: '/api/v3/files', status: 'healthy', avgResponseTime: 580 },
          { path: '/api/v3/urls', status: 'healthy', avgResponseTime: 720 },
          { path: '/api/v3/domains', status: 'healthy', avgResponseTime: 640 }
        ],
        metrics: {
          totalRequests: 12847,
          successfulRequests: 12789,
          failedRequests: 58,
          avgDailyRequests: 428,
          peakHour: '15:00',
          peakRequests: 167
        },
        configuration: {
          baseUrl: 'https://www.virustotal.com',
          rateLimit: '4 calls/minute',
          timeout: 10000,
          retries: 2,
          authentication: 'API Key'
        }
      },
      {
        id: 'shodan',
        name: 'Shodan',
        category: 'Cybersecurity',
        status: 'healthy',
        uptime: 98.7,
        responseTime: 920,
        errorRate: 1.2,
        requestsPerHour: 234,
        quotaUsed: 78,
        quotaLimit: 1000,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 85.3,
        endpoints: [
          { path: '/shodan/host/search', status: 'healthy', avgResponseTime: 1100 },
          { path: '/shodan/host/{ip}', status: 'healthy', avgResponseTime: 780 },
          { path: '/api-info', status: 'healthy', avgResponseTime: 340 }
        ],
        metrics: {
          totalRequests: 6789,
          successfulRequests: 6707,
          failedRequests: 82,
          avgDailyRequests: 226,
          peakHour: '13:30',
          peakRequests: 78
        },
        configuration: {
          baseUrl: 'https://api.shodan.io',
          rateLimit: '1 call/second',
          timeout: 12000,
          retries: 1,
          authentication: 'API Key'
        }
      },
      // News & Research APIs
      {
        id: 'newsapi',
        name: 'NewsAPI',
        category: 'News',
        status: 'critical',
        uptime: 94.3,
        responseTime: 2850,
        errorRate: 8.7,
        requestsPerHour: 89,
        quotaUsed: 95,
        quotaLimit: 1000,
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 62.1,
        endpoints: [
          { path: '/v2/everything', status: 'critical', avgResponseTime: 3200 },
          { path: '/v2/top-headlines', status: 'warning', avgResponseTime: 2100 },
          { path: '/v2/sources', status: 'healthy', avgResponseTime: 890 }
        ],
        metrics: {
          totalRequests: 2847,
          successfulRequests: 2599,
          failedRequests: 248,
          avgDailyRequests: 95,
          peakHour: '08:00',
          peakRequests: 34
        },
        configuration: {
          baseUrl: 'https://newsapi.org',
          rateLimit: '1000 calls/day',
          timeout: 20000,
          retries: 3,
          authentication: 'API Key'
        }
      },
      // Science APIs
      {
        id: 'nasa',
        name: 'NASA Open Data',
        category: 'Science',
        status: 'healthy',
        uptime: 99.9,
        responseTime: 450,
        errorRate: 0.05,
        requestsPerHour: 345,
        quotaUsed: 15,
        quotaLimit: null, // Unlimited
        lastChecked: new Date(Date.now() - Math.random() * 300000).toISOString(),
        healthScore: 98.7,
        endpoints: [
          { path: '/planetary/apod', status: 'healthy', avgResponseTime: 380 },
          { path: '/planetary/earth/imagery', status: 'healthy', avgResponseTime: 520 },
          { path: '/neo/rest/v1/feed', status: 'healthy', avgResponseTime: 450 }
        ],
        metrics: {
          totalRequests: 9847,
          successfulRequests: 9842,
          failedRequests: 5,
          avgDailyRequests: 328,
          peakHour: '12:00',
          peakRequests: 123
        },
        configuration: {
          baseUrl: 'https://api.nasa.gov',
          rateLimit: 'No limit',
          timeout: 8000,
          retries: 2,
          authentication: 'API Key'
        }
      }
    ];

    const data = {
      timestamp: new Date().toISOString(),
      overview: {
        totalApis: apis.length,
        healthyApis: apis.filter(api => api.status === 'healthy').length,
        warningApis: apis.filter(api => api.status === 'warning').length,
        criticalApis: apis.filter(api => api.status === 'critical').length,
        averageUptime: (apis.reduce((sum, api) => sum + api.uptime, 0) / apis.length).toFixed(1),
        averageResponseTime: Math.round(apis.reduce((sum, api) => sum + api.responseTime, 0) / apis.length),
        totalRequestsPerHour: apis.reduce((sum, api) => sum + api.requestsPerHour, 0),
        averageHealthScore: (apis.reduce((sum, api) => sum + api.healthScore, 0) / apis.length).toFixed(1)
      },
      apis: apis,
      categories: {
        Financial: apis.filter(api => api.category === 'Financial'),
        Cybersecurity: apis.filter(api => api.category === 'Cybersecurity'),
        News: apis.filter(api => api.category === 'News'),
        Science: apis.filter(api => api.category === 'Science')
      },
      systemHealth: {
        overallScore: 86.4,
        connectivity: 94.2,
        performance: 82.1,
        reliability: 89.7,
        security: 91.3
      },
      alerts: [
        {
          id: 'alert_001',
          type: 'critical',
          api: 'NewsAPI',
          message: 'Response time exceeding threshold (>2000ms)',
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          acknowledged: false
        },
        {
          id: 'alert_002',
          type: 'warning',
          api: 'Alpha Vantage',
          message: 'Quota usage above 80%',
          timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          acknowledged: false
        },
        {
          id: 'alert_003',
          type: 'info',
          api: 'Polygon.io',
          message: 'Endpoint /v2/snapshot/locale showing increased latency',
          timestamp: new Date(Date.now() - Math.random() * 10800000).toISOString(),
          acknowledged: true
        }
      ],
      performance: {
        last24Hours: {
          totalRequests: 127834,
          successRate: 96.8,
          averageResponseTime: 687,
          peakHour: '14:00',
          peakRequests: 2847
        },
        trends: {
          uptimeChange: '+0.3%',
          responseTimeChange: '-12ms',
          errorRateChange: '-0.15%',
          requestVolumeChange: '+8.2%'
        }
      }
    };

    return data;
  };

  useEffect(() => {
    const loadData = () => {
      setApiData(generateApiData());
      setLoading(false);
    };

    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, timeRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#17a2b8';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
  };

  const renderOverview = () => {
    if (!apiData) return null;

    return (
      <div className="overview-content">
        <div className="overview-metrics">
          <div className="metric-card primary">
            <div className="metric-icon">
              <i className="fas fa-network-wired"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{apiData.overview.totalApis}</div>
              <div className="metric-label">Total APIs</div>
            </div>
            <div className="metric-breakdown">
              <div className="breakdown-item healthy">
                <span>{apiData.overview.healthyApis} Healthy</span>
              </div>
              <div className="breakdown-item warning">
                <span>{apiData.overview.warningApis} Warning</span>
              </div>
              <div className="breakdown-item critical">
                <span>{apiData.overview.criticalApis} Critical</span>
              </div>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{apiData.overview.averageUptime}%</div>
              <div className="metric-label">Average Uptime</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-up"></i>
              <span>+0.3% vs yesterday</span>
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{apiData.overview.averageResponseTime}ms</div>
              <div className="metric-label">Avg Response Time</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-down"></i>
              <span>-12ms improvement</span>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{apiData.overview.totalRequestsPerHour.toLocaleString()}</div>
              <div className="metric-label">Requests/Hour</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-up"></i>
              <span>+8.2% increase</span>
            </div>
          </div>
        </div>

        <div className="api-status-grid">
          {apiData.apis.map(api => (
            <div key={api.id} className="api-status-card">
              <div className="api-header">
                <div className="api-info">
                  <h3>{api.name}</h3>
                  <span className="api-category">{api.category}</span>
                </div>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(api.status) }}
                >
                  <span>{api.status}</span>
                </div>
              </div>

              <div className="api-metrics">
                <div className="metric-row">
                  <span className="metric-label">Health Score:</span>
                  <span 
                    className="metric-value"
                    style={{ color: getHealthScoreColor(api.healthScore) }}
                  >
                    {api.healthScore}%
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Uptime:</span>
                  <span className="metric-value">{api.uptime}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Response Time:</span>
                  <span className="metric-value">{api.responseTime}ms</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Error Rate:</span>
                  <span className="metric-value">{api.errorRate}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Requests/Hour:</span>
                  <span className="metric-value">{api.requestsPerHour}</span>
                </div>
                {api.quotaLimit && (
                  <div className="metric-row">
                    <span className="metric-label">Quota Usage:</span>
                    <span className="metric-value">
                      {api.quotaUsed}% ({api.quotaUsed * api.quotaLimit / 100}/{api.quotaLimit})
                    </span>
                  </div>
                )}
              </div>

              <div className="api-endpoints">
                <div className="endpoints-header">
                  <strong>Endpoints Status:</strong>
                </div>
                {api.endpoints.slice(0, 2).map((endpoint, index) => (
                  <div key={index} className="endpoint-item">
                    <span className="endpoint-path">{endpoint.path}</span>
                    <span 
                      className="endpoint-status"
                      style={{ color: getStatusColor(endpoint.status) }}
                    >
                      {endpoint.status}
                    </span>
                  </div>
                ))}
                {api.endpoints.length > 2 && (
                  <div className="endpoint-item">
                    <span className="endpoint-more">+{api.endpoints.length - 2} more</span>
                  </div>
                )}
              </div>

              <div className="api-actions">
                <button className="action-btn primary">
                  <i className="fas fa-chart-bar"></i>
                  View Details
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-cog"></i>
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="system-health-section">
          <h3>System Health Overview</h3>
          <div className="health-metrics">
            {Object.entries(apiData.systemHealth).map(([metric, score]) => (
              <div key={metric} className="health-metric">
                <div className="metric-name">
                  {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="health-score-container">
                  <div className="score-circle">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${score}, 100`}
                        style={{ stroke: getHealthScoreColor(score) }}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="score-text">{score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {apiData.alerts && apiData.alerts.length > 0 && (
          <div className="alerts-section">
            <h3>Recent Alerts</h3>
            <div className="alerts-list">
              {apiData.alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <div className="alert-icon">
                    <i className={`fas ${
                      alert.type === 'critical' ? 'fa-exclamation-triangle' :
                      alert.type === 'warning' ? 'fa-exclamation-circle' :
                      'fa-info-circle'
                    }`}></i>
                  </div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <strong>{alert.api}</strong>
                      <span className="alert-time">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="alert-message">{alert.message}</div>
                  </div>
                  <div className="alert-actions">
                    {!alert.acknowledged && (
                      <button className="ack-btn">
                        <i className="fas fa-check"></i>
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'health':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-heartbeat" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>API Health Monitoring</h3>
              <p>Comprehensive API health status and monitoring dashboard</p>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-tachometer-alt" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>Performance Metrics</h3>
              <p>Detailed API performance analytics and trending data</p>
            </div>
          </div>
        );
      case 'management':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-cogs" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>Connection Management</h3>
              <p>API connection management and load balancing controls</p>
            </div>
          </div>
        );
      case 'quotas':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-chart-pie" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>Quota & Usage Tracking</h3>
              <p>API quota monitoring and usage analytics dashboard</p>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-bell" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>Error Monitoring & Alerts</h3>
              <p>API error tracking, alerting system, and incident management</p>
            </div>
          </div>
        );
      case 'integration':
        return (
          <div className="view-placeholder">
            <div>
              <i className="fas fa-plus-circle" style={{ fontSize: '3em', marginBottom: '20px' }}></i>
              <h3>API Integration Tools</h3>
              <p>Tools for adding and configuring new API integrations</p>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="api-monitoring-dashboard loading">
        <div className="loading-spinner">
          <i className="fas fa-network-wired fa-spin"></i>
          <p>Loading API monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-monitoring-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>
            <i className="fas fa-network-wired"></i>
            API Monitoring Center
          </h2>
          <p>Comprehensive external API health monitoring and management platform</p>
        </div>
        
        <div className="header-controls">
          <div className="time-range-selector">
            {['1h', '6h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                className={`time-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="refresh-controls">
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto Refresh
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              disabled={!autoRefresh}
            >
              <option value={15}>15s</option>
              <option value={30}>30s</option>
              <option value={60}>1min</option>
              <option value={300}>5min</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-navigation">
        <button
          className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          <i className="fas fa-chart-pie"></i>
          Overview
        </button>
        <button
          className={`nav-btn ${activeView === 'health' ? 'active' : ''}`}
          onClick={() => setActiveView('health')}
        >
          <i className="fas fa-heartbeat"></i>
          Health
        </button>
        <button
          className={`nav-btn ${activeView === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveView('performance')}
        >
          <i className="fas fa-tachometer-alt"></i>
          Performance
        </button>
        <button
          className={`nav-btn ${activeView === 'management' ? 'active' : ''}`}
          onClick={() => setActiveView('management')}
        >
          <i className="fas fa-cogs"></i>
          Management
        </button>
        <button
          className={`nav-btn ${activeView === 'quotas' ? 'active' : ''}`}
          onClick={() => setActiveView('quotas')}
        >
          <i className="fas fa-chart-pie"></i>
          Quotas
        </button>
        <button
          className={`nav-btn ${activeView === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveView('alerts')}
        >
          <i className="fas fa-bell"></i>
          Alerts
        </button>
        <button
          className={`nav-btn ${activeView === 'integration' ? 'active' : ''}`}
          onClick={() => setActiveView('integration')}
        >
          <i className="fas fa-plus-circle"></i>
          Integration
        </button>
      </div>

      <div className="dashboard-content">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default ApiMonitoringDashboard;
