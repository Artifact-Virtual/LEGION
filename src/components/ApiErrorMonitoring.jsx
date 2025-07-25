import React, { useState, useEffect } from 'react';
import './ApiErrorMonitoring.css';

const ApiErrorMonitoring = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15000);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedApi, setSelectedApi] = useState('all');

  // Mock data - replace with real API integration
  const [errorData, setErrorData] = useState({
    summary: {
      totalErrors: 1247,
      errorRate: 2.3,
      criticalErrors: 12,
      resolvedErrors: 1156,
      averageResolutionTime: 18,
      affectedApis: 8,
      uptime: 99.77
    },
    recentErrors: [
      {
        id: 'err_001',
        timestamp: '2024-01-20T14:32:15Z',
        api: 'Financial Data API',
        endpoint: '/api/v1/market-data/stocks',
        errorCode: '503',
        errorType: 'Service Unavailable',
        severity: 'critical',
        message: 'Database connection timeout after 30 seconds',
        count: 5,
        firstOccurrence: '2024-01-20T14:30:00Z',
        lastOccurrence: '2024-01-20T14:32:15Z',
        affectedUsers: 23,
        resolved: false,
        resolution: null
      },
      {
        id: 'err_002',
        timestamp: '2024-01-20T14:28:42Z',
        api: 'Social Media Analytics API',
        endpoint: '/api/v1/analytics/engagement',
        errorCode: '429',
        errorType: 'Rate Limit Exceeded',
        severity: 'warning',
        message: 'Request rate limit exceeded: 1000 requests per minute',
        count: 15,
        firstOccurrence: '2024-01-20T14:25:00Z',
        lastOccurrence: '2024-01-20T14:28:42Z',
        affectedUsers: 8,
        resolved: true,
        resolution: 'Rate limiting adjusted automatically'
      },
      {
        id: 'err_003',
        timestamp: '2024-01-20T14:25:18Z',
        api: 'News Feed API',
        endpoint: '/api/v1/news/trending',
        errorCode: '401',
        errorType: 'Authentication Failed',
        severity: 'high',
        message: 'Invalid API key or expired token',
        count: 3,
        firstOccurrence: '2024-01-20T14:25:18Z',
        lastOccurrence: '2024-01-20T14:25:18Z',
        affectedUsers: 1,
        resolved: true,
        resolution: 'User notified to refresh authentication'
      },
      {
        id: 'err_004',
        timestamp: '2024-01-20T14:22:35Z',
        api: 'Weather Intelligence API',
        endpoint: '/api/v1/weather/forecast',
        errorCode: '500',
        errorType: 'Internal Server Error',
        severity: 'medium',
        message: 'Unexpected null reference in data processing',
        count: 2,
        firstOccurrence: '2024-01-20T14:22:35Z',
        lastOccurrence: '2024-01-20T14:22:35Z',
        affectedUsers: 2,
        resolved: true,
        resolution: 'Fixed null check in data processing pipeline'
      },
      {
        id: 'err_005',
        timestamp: '2024-01-20T14:18:52Z',
        api: 'AI Processing API',
        endpoint: '/api/v1/ml/predict',
        errorCode: '422',
        errorType: 'Validation Error',
        severity: 'low',
        message: 'Invalid input parameters: missing required field "model_type"',
        count: 8,
        firstOccurrence: '2024-01-20T14:15:00Z',
        lastOccurrence: '2024-01-20T14:18:52Z',
        affectedUsers: 3,
        resolved: true,
        resolution: 'Input validation improved with better error messages'
      }
    ],
    errorTrends: {
      hourly: [
        { time: '09:00', total: 45, critical: 2, high: 8, medium: 15, low: 20 },
        { time: '10:00', total: 52, critical: 1, high: 12, medium: 18, low: 21 },
        { time: '11:00', total: 38, critical: 0, high: 6, medium: 14, low: 18 },
        { time: '12:00', total: 67, critical: 3, high: 15, medium: 22, low: 27 },
        { time: '13:00', total: 89, critical: 4, high: 18, medium: 31, low: 36 },
        { time: '14:00', total: 123, critical: 5, high: 25, medium: 42, low: 51 }
      ],
      daily: [
        { date: '2024-01-14', total: 1567, resolved: 1534 },
        { date: '2024-01-15', total: 1423, resolved: 1401 },
        { date: '2024-01-16', total: 1689, resolved: 1652 },
        { date: '2024-01-17', total: 1345, resolved: 1329 },
        { date: '2024-01-18', total: 1512, resolved: 1489 },
        { date: '2024-01-19', total: 1378, resolved: 1356 },
        { date: '2024-01-20', total: 1247, resolved: 1156 }
      ]
    },
    apiHealth: [
      {
        api: 'Financial Data API',
        status: 'degraded',
        errorRate: 4.2,
        errors24h: 156,
        uptime: 99.2,
        lastError: '2024-01-20T14:32:15Z',
        commonErrors: ['503 Service Unavailable', '504 Gateway Timeout', '429 Rate Limit']
      },
      {
        api: 'Social Media Analytics API',
        status: 'healthy',
        errorRate: 1.8,
        errors24h: 89,
        uptime: 99.9,
        lastError: '2024-01-20T14:28:42Z',
        commonErrors: ['429 Rate Limit', '400 Bad Request', '422 Validation Error']
      },
      {
        api: 'News Feed API',
        status: 'healthy',
        errorRate: 2.1,
        errors24h: 95,
        uptime: 99.8,
        lastError: '2024-01-20T14:25:18Z',
        commonErrors: ['401 Unauthorized', '404 Not Found', '500 Internal Error']
      },
      {
        api: 'Weather Intelligence API',
        status: 'healthy',
        errorRate: 1.3,
        errors24h: 67,
        uptime: 99.95,
        lastError: '2024-01-20T14:22:35Z',
        commonErrors: ['500 Internal Error', '422 Validation Error', '503 Service Unavailable']
      },
      {
        api: 'AI Processing API',
        status: 'warning',
        errorRate: 3.1,
        errors24h: 134,
        uptime: 99.5,
        lastError: '2024-01-20T14:18:52Z',
        commonErrors: ['422 Validation Error', '429 Rate Limit', '500 Internal Error']
      },
      {
        api: 'Cybersecurity Threat API',
        status: 'healthy',
        errorRate: 0.9,
        errors24h: 42,
        uptime: 99.98,
        lastError: '2024-01-20T13:45:12Z',
        commonErrors: ['401 Unauthorized', '403 Forbidden', '404 Not Found']
      }
    ],
    alerts: [
      {
        id: 'alert_err_001',
        type: 'error_spike',
        severity: 'critical',
        title: 'Critical Error Spike Detected',
        description: 'Financial Data API showing 300% increase in 5xx errors',
        timestamp: '2024-01-20T14:30:00Z',
        api: 'Financial Data API',
        acknowledged: false,
        assignedTo: 'DevOps Team'
      },
      {
        id: 'alert_err_002',
        type: 'service_degradation',
        severity: 'warning',
        title: 'Service Degradation Alert',
        description: 'AI Processing API response time increased by 150%',
        timestamp: '2024-01-20T14:15:00Z',
        api: 'AI Processing API',
        acknowledged: true,
        assignedTo: 'AI Team'
      },
      {
        id: 'alert_err_003',
        type: 'high_error_rate',
        severity: 'warning',
        title: 'High Error Rate Detected',
        description: 'Overall error rate exceeded 2% threshold',
        timestamp: '2024-01-20T14:00:00Z',
        api: 'All APIs',
        acknowledged: true,
        assignedTo: 'Platform Team'
      }
    ],
    resolutionPatterns: [
      {
        errorType: '503 Service Unavailable',
        commonCauses: ['Database timeout', 'Service overload', 'Network issues'],
        avgResolutionTime: 25,
        resolutionSteps: ['Check database connections', 'Scale services', 'Verify network connectivity'],
        successRate: 94
      },
      {
        errorType: '429 Rate Limit Exceeded',
        commonCauses: ['Traffic spike', 'Insufficient quotas', 'Bot activity'],
        avgResolutionTime: 8,
        resolutionSteps: ['Adjust rate limits', 'Scale capacity', 'Block suspicious traffic'],
        successRate: 98
      },
      {
        errorType: '401 Unauthorized',
        commonCauses: ['Expired tokens', 'Invalid API keys', 'Permission changes'],
        avgResolutionTime: 12,
        resolutionSteps: ['Refresh authentication', 'Verify API keys', 'Check permissions'],
        successRate: 96
      }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh && !loading) {
      interval = setInterval(() => {
        // Simulate data refresh
        console.log('Refreshing error monitoring data...');
      }, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, loading]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'warning': return '#ffc107';
      case 'medium': return '#17a2b8';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#28a745';
      case 'warning': return '#ffc107';
      case 'degraded': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const filteredErrors = errorData.recentErrors.filter(error => {
    if (selectedSeverity !== 'all' && error.severity !== selectedSeverity) return false;
    if (selectedApi !== 'all' && error.api !== selectedApi) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="api-error-monitoring loading">
        <div className="loading-spinner">
          <i className="fas fa-exclamation-triangle fa-spin"></i>
          <p>Loading error monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-error-monitoring">
      {/* Header */}
      <div className="error-header">
        <div className="header-info">
          <h2>
            <i className="fas fa-exclamation-triangle"></i>
            API Error Monitoring & Alerting
          </h2>
          <p>Real-time error tracking, analysis, and automated alerting for all external APIs</p>
        </div>
        <div className="header-controls">
          <div className="view-toggle">
            {['overview', 'errors', 'trends', 'alerts'].map(view => (
              <button
                key={view}
                className={`view-btn ${activeView === view ? 'active' : ''}`}
                onClick={() => setActiveView(view)}
              >
                {view}
              </button>
            ))}
          </div>
          <div className="refresh-control">
            <label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh
            </label>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="error-summary">
        <div className="summary-cards">
          <div className="summary-card total-errors">
            <div className="card-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.totalErrors}</div>
              <div className="card-label">Total Errors (24h)</div>
              <div className="card-trend">
                <i className="fas fa-arrow-down"></i>
                <span>-12.3% from yesterday</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card error-rate">
            <div className="card-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.errorRate}%</div>
              <div className="card-label">Error Rate</div>
              <div className="card-trend">
                <i className="fas fa-arrow-up"></i>
                <span>+0.3% from yesterday</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card critical-errors">
            <div className="card-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.criticalErrors}</div>
              <div className="card-label">Critical Errors</div>
              <div className="card-trend">
                <i className="fas fa-arrow-up"></i>
                <span>+4 in last hour</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card resolved-errors">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.resolvedErrors}</div>
              <div className="card-label">Resolved Errors</div>
              <div className="card-trend">
                <i className="fas fa-arrow-up"></i>
                <span>92.7% resolution rate</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card resolution-time">
            <div className="card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.averageResolutionTime}m</div>
              <div className="card-label">Avg Resolution Time</div>
              <div className="card-trend">
                <i className="fas fa-arrow-down"></i>
                <span>-5m improvement</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card uptime">
            <div className="card-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{errorData.summary.uptime}%</div>
              <div className="card-label">Overall Uptime</div>
              <div className="card-trend">
                <i className="fas fa-check"></i>
                <span>SLA maintained</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'overview' && (
        <div className="overview-section">
          {/* API Health Status */}
          <div className="api-health-overview">
            <h3>API Health Status</h3>
            <div className="health-grid">
              {errorData.apiHealth.map(api => (
                <div key={api.api} className="health-card">
                  <div className="health-header">
                    <div className="api-name">{api.api}</div>
                    <div className="api-status">
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(api.status) }}
                      ></span>
                      <span className="status-text">{api.status}</span>
                    </div>
                  </div>
                  
                  <div className="health-metrics">
                    <div className="metric-row">
                      <span className="metric-label">Error Rate:</span>
                      <span 
                        className="metric-value"
                        style={{ color: api.errorRate > 3 ? '#dc3545' : '#28a745' }}
                      >
                        {api.errorRate}%
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Errors (24h):</span>
                      <span className="metric-value">{api.errors24h}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Uptime:</span>
                      <span className="metric-value uptime">{api.uptime}%</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Last Error:</span>
                      <span className="metric-value">{formatTimeAgo(api.lastError)}</span>
                    </div>
                  </div>
                  
                  <div className="common-errors">
                    <div className="errors-title">Common Errors:</div>
                    {api.commonErrors.map((error, index) => (
                      <div key={index} className="error-tag">{error}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Critical Errors */}
          <div className="recent-critical-errors">
            <h3>Recent Critical Errors</h3>
            <div className="critical-errors-list">
              {filteredErrors
                .filter(error => error.severity === 'critical' && !error.resolved)
                .map(error => (
                  <div key={error.id} className="critical-error-item">
                    <div className="error-icon">
                      <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="error-details">
                      <div className="error-title">{error.api} - {error.errorType}</div>
                      <div className="error-message">{error.message}</div>
                      <div className="error-meta">
                        <span className="error-code">Code: {error.errorCode}</span>
                        <span className="error-count">Count: {error.count}</span>
                        <span className="error-users">Affected Users: {error.affectedUsers}</span>
                        <span className="error-time">{formatTimeAgo(error.timestamp)}</span>
                      </div>
                    </div>
                    <div className="error-actions">
                      <button className="error-btn primary">
                        <i className="fas fa-tools"></i>
                        Investigate
                      </button>
                      <button className="error-btn secondary">
                        <i className="fas fa-user-plus"></i>
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'errors' && (
        <div className="errors-section">
          {/* Filters */}
          <div className="error-filters">
            <div className="filter-group">
              <label>Time Range:</label>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="1h">Last Hour</option>
                <option value="4h">Last 4 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Severity:</label>
              <select 
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="warning">Warning</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="filter-group">
              <label>API:</label>
              <select 
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
              >
                <option value="all">All APIs</option>
                {errorData.apiHealth.map(api => (
                  <option key={api.api} value={api.api}>{api.api}</option>
                ))}
              </select>
            </div>
            <button className="filter-btn">
              <i className="fas fa-download"></i>
              Export Errors
            </button>
          </div>

          {/* Errors List */}
          <div className="errors-list">
            <div className="errors-header">
              <h3>Error Details ({filteredErrors.length} errors)</h3>
              <div className="list-actions">
                <button className="list-btn primary">
                  <i className="fas fa-check-double"></i>
                  Mark All Resolved
                </button>
                <button className="list-btn secondary">
                  <i className="fas fa-refresh"></i>
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="errors-table">
              {filteredErrors.map(error => (
                <div key={error.id} className="error-row">
                  <div className="error-severity">
                    <div 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(error.severity) }}
                    >
                      {error.severity}
                    </div>
                  </div>
                  
                  <div className="error-info">
                    <div className="error-primary">
                      <span className="error-api">{error.api}</span>
                      <span className="error-type">{error.errorType}</span>
                      <span className="error-code">({error.errorCode})</span>
                    </div>
                    <div className="error-endpoint">{error.endpoint}</div>
                    <div className="error-message">{error.message}</div>
                  </div>
                  
                  <div className="error-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Count:</span>
                      <span className="metric-value">{error.count}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Users:</span>
                      <span className="metric-value">{error.affectedUsers}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Duration:</span>
                      <span className="metric-value">
                        {Math.floor((new Date(error.lastOccurrence) - new Date(error.firstOccurrence)) / 60000)}m
                      </span>
                    </div>
                  </div>
                  
                  <div className="error-status">
                    <div className={`resolution-status ${error.resolved ? 'resolved' : 'unresolved'}`}>
                      <i className={`fas ${error.resolved ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      <span>{error.resolved ? 'Resolved' : 'Active'}</span>
                    </div>
                    <div className="error-time">{formatTimeAgo(error.timestamp)}</div>
                    {error.resolved && error.resolution && (
                      <div className="resolution-note">{error.resolution}</div>
                    )}
                  </div>
                  
                  <div className="error-row-actions">
                    <button className="row-btn primary">
                      <i className="fas fa-eye"></i>
                      Details
                    </button>
                    {!error.resolved && (
                      <button className="row-btn secondary">
                        <i className="fas fa-check"></i>
                        Resolve
                      </button>
                    )}
                    <button className="row-btn tertiary">
                      <i className="fas fa-copy"></i>
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'trends' && (
        <div className="trends-section">
          {/* Error Trends Chart */}
          <div className="trends-chart">
            <h3>Error Trends Analysis</h3>
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">Hourly Error Distribution</div>
                <div className="chart-legend">
                  <div className="legend-item critical">
                    <span className="legend-color"></span>
                    <span>Critical</span>
                  </div>
                  <div className="legend-item high">
                    <span className="legend-color"></span>
                    <span>High</span>
                  </div>
                  <div className="legend-item medium">
                    <span className="legend-color"></span>
                    <span>Medium</span>
                  </div>
                  <div className="legend-item low">
                    <span className="legend-color"></span>
                    <span>Low</span>
                  </div>
                </div>
              </div>
              
              <div className="chart-area">
                <div className="chart-bars">
                  {errorData.errorTrends.hourly.map((hour, index) => (
                    <div key={index} className="hour-bar">
                      <div className="bar-stack">
                        <div 
                          className="bar-segment critical"
                          style={{ height: `${(hour.critical / hour.total) * 100}%` }}
                        ></div>
                        <div 
                          className="bar-segment high"
                          style={{ height: `${(hour.high / hour.total) * 100}%` }}
                        ></div>
                        <div 
                          className="bar-segment medium"
                          style={{ height: `${(hour.medium / hour.total) * 100}%` }}
                        ></div>
                        <div 
                          className="bar-segment low"
                          style={{ height: `${(hour.low / hour.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="bar-label">{hour.time}</div>
                      <div className="bar-total">{hour.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Patterns */}
          <div className="resolution-patterns">
            <h3>Error Resolution Patterns</h3>
            <div className="patterns-grid">
              {errorData.resolutionPatterns.map(pattern => (
                <div key={pattern.errorType} className="pattern-card">
                  <div className="pattern-header">
                    <h4>{pattern.errorType}</h4>
                    <div className="success-rate">
                      <i className="fas fa-check-circle"></i>
                      <span>{pattern.successRate}% success rate</span>
                    </div>
                  </div>
                  
                  <div className="pattern-metrics">
                    <div className="pattern-metric">
                      <span className="metric-label">Avg Resolution Time:</span>
                      <span className="metric-value">{pattern.avgResolutionTime}m</span>
                    </div>
                  </div>
                  
                  <div className="common-causes">
                    <div className="causes-title">Common Causes:</div>
                    <ul>
                      {pattern.commonCauses.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="resolution-steps">
                    <div className="steps-title">Resolution Steps:</div>
                    <ol>
                      {pattern.resolutionSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'alerts' && (
        <div className="alerts-section">
          {/* Alert Configuration */}
          <div className="alert-config">
            <div className="config-header">
              <h3>Alert Configuration</h3>
              <div className="config-actions">
                <button className="config-btn primary">
                  <i className="fas fa-plus"></i>
                  New Alert Rule
                </button>
                <button className="config-btn secondary">
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
              </div>
            </div>
            
            <div className="config-panels">
              <div className="config-panel">
                <h4>Error Rate Thresholds</h4>
                <div className="threshold-settings">
                  <div className="threshold-item">
                    <label>Warning Threshold:</label>
                    <input type="number" value="2" />
                    <span className="unit">% error rate</span>
                  </div>
                  <div className="threshold-item">
                    <label>Critical Threshold:</label>
                    <input type="number" value="5" />
                    <span className="unit">% error rate</span>
                  </div>
                  <div className="threshold-item">
                    <label>Time Window:</label>
                    <select>
                      <option>5 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="config-panel">
                <h4>Notification Settings</h4>
                <div className="notification-settings">
                  <div className="notification-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email Notifications
                    </label>
                  </div>
                  <div className="notification-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Slack Alerts
                    </label>
                  </div>
                  <div className="notification-item">
                    <label>
                      <input type="checkbox" />
                      SMS Alerts (Critical Only)
                    </label>
                  </div>
                  <div className="notification-item">
                    <label>Alert Frequency:</label>
                    <select>
                      <option>Immediate</option>
                      <option>Every 5 minutes</option>
                      <option>Every 15 minutes</option>
                      <option>Hourly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="active-alerts">
            <h3>Active Alerts</h3>
            <div className="alerts-grid">
              {errorData.alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.severity}`}>
                  <div className="alert-header">
                    <div className="alert-severity">
                      <i className={`fas ${
                        alert.severity === 'critical' ? 'fa-exclamation-circle' :
                        'fa-exclamation-triangle'
                      }`}></i>
                      <span>{alert.severity}</span>
                    </div>
                    <div className="alert-time">{formatTimeAgo(alert.timestamp)}</div>
                  </div>
                  
                  <div className="alert-content">
                    <h4>{alert.title}</h4>
                    <p>{alert.description}</p>
                    <div className="alert-meta">
                      <span className="alert-api">API: {alert.api}</span>
                      <span className="alert-assignee">Assigned: {alert.assignedTo}</span>
                    </div>
                  </div>
                  
                  <div className="alert-actions">
                    <button className={`alert-btn ${alert.acknowledged ? 'acknowledged' : 'primary'}`}>
                      <i className={`fas ${alert.acknowledged ? 'fa-check' : 'fa-bell'}`}></i>
                      {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                    <button className="alert-btn secondary">
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                    <button className="alert-btn tertiary">
                      <i className="fas fa-times"></i>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiErrorMonitoring;
