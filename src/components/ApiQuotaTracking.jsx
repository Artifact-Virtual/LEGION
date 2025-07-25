import React, { useState, useEffect } from 'react';
import './ApiQuotaTracking.css';

const ApiQuotaTracking = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedApi, setSelectedApi] = useState('all');

  // Mock data - replace with real API integration
  const [quotaData, setQuotaData] = useState({
    summary: {
      totalApis: 14,
      activeQuotas: 12,
      quotasExceeded: 2,
      averageUtilization: 67.8,
      totalRequests: 2847692,
      totalLimits: 4200000
    },
    apis: [
      {
        id: 'financial_data',
        name: 'Financial Data API',
        category: 'Financial',
        status: 'active',
        quotaType: 'requests_per_hour',
        currentUsage: 8450,
        dailyLimit: 10000,
        monthlyLimit: 300000,
        utilization: 84.5,
        resetTime: '2024-01-20T15:00:00Z',
        quotaStatus: 'warning',
        costPerRequest: 0.002,
        totalCost: 52.34,
        trends: {
          hourly: [12, 25, 45, 78, 92, 85, 76, 68, 55, 42, 35, 28],
          daily: [6500, 7200, 8100, 8450, 7800, 6900, 7500],
          monthly: [195000, 218000, 245000, 267000]
        }
      },
      {
        id: 'market_data',
        name: 'Market Intelligence API',
        category: 'Financial',
        status: 'active',
        quotaType: 'requests_per_minute',
        currentUsage: 450,
        dailyLimit: 500,
        monthlyLimit: 15000,
        utilization: 90.0,
        resetTime: '2024-01-20T14:35:00Z',
        quotaStatus: 'critical',
        costPerRequest: 0.005,
        totalCost: 67.50,
        trends: {
          hourly: [35, 42, 48, 52, 45, 43, 44, 46, 48, 50, 47, 45],
          daily: [380, 420, 465, 450, 435, 410, 445],
          monthly: [11500, 12800, 13600, 13500]
        }
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity Threat API',
        category: 'Security',
        status: 'active',
        quotaType: 'requests_per_day',
        currentUsage: 2800,
        dailyLimit: 5000,
        monthlyLimit: 150000,
        utilization: 56.0,
        resetTime: '2024-01-21T00:00:00Z',
        quotaStatus: 'normal',
        costPerRequest: 0.001,
        totalCost: 28.45,
        trends: {
          hourly: [85, 92, 105, 118, 125, 132, 128, 115, 98, 85, 75, 68],
          daily: [2200, 2650, 2980, 2800, 2450, 2100, 2350],
          monthly: [65000, 78000, 84000, 82000]
        }
      },
      {
        id: 'news_feed',
        name: 'Global News Feed API',
        category: 'News',
        status: 'active',  
        quotaType: 'requests_per_hour',
        currentUsage: 1850,
        dailyLimit: 2000,
        monthlyLimit: 60000,
        utilization: 92.5,
        resetTime: '2024-01-20T15:00:00Z',
        quotaStatus: 'critical',
        costPerRequest: 0.0015,
        totalCost: 45.67,
        trends: {
          hourly: [65, 78, 85, 92, 95, 88, 82, 77, 74, 78, 82, 85],
          daily: [1650, 1780, 1920, 1850, 1720, 1580, 1690],
          monthly: [48000, 52000, 56000, 54500]
        }
      },
      {
        id: 'weather_data',
        name: 'Weather Intelligence API',
        category: 'Environmental',
        status: 'active',
        quotaType: 'requests_per_day',
        currentUsage: 950,
        dailyLimit: 3000,
        monthlyLimit: 90000,
        utilization: 31.7,
        resetTime: '2024-01-21T00:00:00Z',
        quotaStatus: 'normal',
        costPerRequest: 0.0008,
        totalCost: 18.23,
        trends: {
          hourly: [28, 35, 42, 48, 52, 55, 58, 52, 45, 38, 32, 28],
          daily: [850, 920, 1050, 950, 880, 790, 860],
          monthly: [25000, 27500, 29000, 28500]
        }
      },
      {
        id: 'social_media',
        name: 'Social Media Analytics API',
        category: 'Social',
        status: 'exceeded',
        quotaType: 'requests_per_hour',
        currentUsage: 5200,
        dailyLimit: 5000,
        monthlyLimit: 150000,
        utilization: 104.0,
        resetTime: '2024-01-20T15:00:00Z',
        quotaStatus: 'exceeded',
        costPerRequest: 0.003,
        totalCost: 156.78,
        trends: {
          hourly: [380, 420, 455, 485, 520, 510, 495, 480, 465, 450, 445, 440],
          daily: [4800, 5100, 5350, 5200, 4950, 4700, 4900],
          monthly: [142000, 148000, 152000, 149000]
        }
      },
      {
        id: 'ai_processing',
        name: 'AI Processing API',
        category: 'AI/ML',
        status: 'active',
        quotaType: 'compute_units_per_hour',
        currentUsage: 2850,
        dailyLimit: 4000,
        monthlyLimit: 120000,
        utilization: 71.3,
        resetTime: '2024-01-20T15:00:00Z',
        quotaStatus: 'warning',
        costPerRequest: 0.012,
        totalCost: 342.67,
        trends: {
          hourly: [185, 210, 245, 285, 295, 285, 275, 265, 255, 245, 235, 225],
          daily: [2400, 2750, 3100, 2850, 2650, 2350, 2550],
          monthly: [72000, 82000, 89000, 85500]
        }
      },
      {
        id: 'translation',
        name: 'Language Translation API',
        category: 'Utility',
        status: 'active',
        quotaType: 'characters_per_day',
        currentUsage: 2450000,
        dailyLimit: 5000000,
        monthlyLimit: 150000000,
        utilization: 49.0,
        resetTime: '2024-01-21T00:00:00Z',
        quotaStatus: 'normal',
        costPerRequest: 0.00002,
        totalCost: 98.45,
        trends: {
          hourly: [85000, 105000, 125000, 145000, 165000, 175000, 180000, 170000, 155000, 135000, 115000, 95000],
          daily: [2100000, 2300000, 2650000, 2450000, 2250000, 2050000, 2200000],
          monthly: [65000000, 72000000, 78000000, 74500000]
        }
      }
    ],
    alerts: [
      {
        id: 'alert_1',
        type: 'quota_exceeded',
        severity: 'critical',
        api: 'Social Media Analytics API',
        message: 'Quota exceeded by 4%',
        timestamp: '2024-01-20T13:45:32Z',
        resolved: false
      },
      {
        id: 'alert_2',
        type: 'quota_warning',
        severity: 'warning',
        api: 'News Feed API',
        message: 'Usage at 92.5% of daily limit',
        timestamp: '2024-01-20T13:30:15Z',
        resolved: false
      },
      {
        id: 'alert_3',
        type: 'quota_warning',
        severity: 'warning',
        api: 'Market Intelligence API',
        message: 'Usage at 90% of minute limit',
        timestamp: '2024-01-20T13:25:42Z',
        resolved: false
      }
    ],
    predictions: {
      daily: {
        'financial_data': { predicted: 9200, confidence: 87 },
        'market_data': { predicted: 485, confidence: 92 },
        'news_feed': { predicted: 1920, confidence: 85 }
      },
      monthly: {
        'financial_data': { predicted: 275000, confidence: 78 },
        'social_media': { predicted: 155000, confidence: 89 }
      }
    }
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
        console.log('Refreshing quota data...');
      }, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, loading]);

  const getQuotaStatusColor = (status) => {
    switch (status) {
      case 'normal': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#fd7e14';
      case 'exceeded': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 100) return '#dc3545';
    if (utilization >= 90) return '#fd7e14';
    if (utilization >= 75) return '#ffc107';
    return '#17a2b8';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTimeUntilReset = (resetTime) => {
    const now = new Date();
    const reset = new Date(resetTime);
    const diff = reset - now;
    
    if (diff < 0) return 'Resetting...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredApis = selectedApi === 'all' 
    ? quotaData.apis 
    : quotaData.apis.filter(api => api.category === selectedApi);

  if (loading) {
    return (
      <div className="api-quota-tracking loading">
        <div className="loading-spinner">
          <i className="fas fa-chart-pie fa-spin"></i>
          <p>Loading quota tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-quota-tracking">
      {/* Header */}
      <div className="quota-header">
        <div className="header-info">
          <h2>
            <i className="fas fa-chart-pie"></i>
            API Quota & Usage Tracking
          </h2>
          <p>Monitor API usage, quotas, and cost optimization across all external services</p>
        </div>
        <div className="header-controls">
          <div className="view-toggle">
            {['overview', 'usage', 'costs', 'alerts'].map(view => (
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
      <div className="quota-summary">
        <div className="summary-cards">
          <div className="summary-card total">
            <div className="card-icon">
              <i className="fas fa-layer-group"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{quotaData.summary.totalApis}</div>
              <div className="card-label">Total APIs</div>
            </div>
          </div>
          
          <div className="summary-card active">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{quotaData.summary.activeQuotas}</div>
              <div className="card-label">Active Quotas</div>
            </div>
          </div>
          
          <div className="summary-card exceeded">
            <div className="card-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{quotaData.summary.quotasExceeded}</div>
              <div className="card-label">Quotas Exceeded</div>
            </div>
          </div>
          
          <div className="summary-card utilization">
            <div className="card-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{quotaData.summary.averageUtilization}%</div>
              <div className="card-label">Avg Utilization</div>
            </div>
          </div>
          
          <div className="summary-card requests">
            <div className="card-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{formatNumber(quotaData.summary.totalRequests)}</div>
              <div className="card-label">Total Requests</div>
            </div>
          </div>
          
          <div className="summary-card limits">
            <div className="card-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="card-content">
              <div className="card-value">{formatNumber(quotaData.summary.totalLimits)}</div>
              <div className="card-label">Total Limits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'overview' && (
        <div className="overview-section">
          {/* Filters */}
          <div className="quota-filters">
            <div className="filter-group">
              <label>Time Period:</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="filter-group">
              <label>API Category:</label>
              <select 
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Financial">Financial</option>
                <option value="Security">Security</option>
                <option value="News">News</option>
                <option value="Social">Social</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Utility">Utility</option>
              </select>
            </div>
            <button className="filter-btn">
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>

          {/* API Quota Grid */}
          <div className="quota-grid">
            {filteredApis.map(api => (
              <div key={api.id} className="quota-card">
                <div className="quota-card-header">
                  <div className="api-info">
                    <h4>{api.name}</h4>
                    <span className="api-category">{api.category}</span>
                  </div>
                  <div className="api-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getQuotaStatusColor(api.quotaStatus) }}
                    ></span>
                    <span className="status-text">{api.quotaStatus}</span>
                  </div>
                </div>

                <div className="quota-metrics">
                  <div className="usage-display">
                    <div className="usage-numbers">
                      <span className="current-usage">{formatNumber(api.currentUsage)}</span>
                      <span className="usage-separator">/</span>
                      <span className="usage-limit">{formatNumber(api.dailyLimit)}</span>
                    </div>
                    <div className="usage-type">{api.quotaType.replace(/_/g, ' ')}</div>
                  </div>
                  
                  <div className="utilization-bar">
                    <div 
                      className="utilization-fill"
                      style={{ 
                        width: `${Math.min(api.utilization, 100)}%`,
                        backgroundColor: getUtilizationColor(api.utilization)
                      }}
                    ></div>
                  </div>
                  
                  <div className="utilization-text">
                    {api.utilization.toFixed(1)}% utilized
                  </div>
                </div>

                <div className="quota-details">
                  <div className="detail-row">
                    <span className="detail-label">Reset Time:</span>
                    <span className="detail-value">{getTimeUntilReset(api.resetTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Monthly Limit:</span>
                    <span className="detail-value">{formatNumber(api.monthlyLimit)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Cost per Request:</span>
                    <span className="detail-value">{formatCurrency(api.costPerRequest)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Cost:</span>
                    <span className="detail-value cost-highlight">{formatCurrency(api.totalCost)}</span>
                  </div>
                </div>

                <div className="quota-actions">
                  <button className="quota-btn primary">
                    <i className="fas fa-chart-line"></i>
                    View Trends
                  </button>
                  <button className="quota-btn secondary">
                    <i className="fas fa-cog"></i>
                    Configure
                  </button>
                  <button className="quota-btn tertiary">
                    <i className="fas fa-bell"></i>
                    Alerts
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'usage' && (
        <div className="usage-section">
          <div className="usage-analytics">
            <h3>Usage Analytics</h3>
            <div className="analytics-grid">
              {filteredApis.slice(0, 4).map(api => (
                <div key={api.id} className="analytics-card">
                  <div className="analytics-header">
                    <h4>{api.name}</h4>
                    <div className="trend-indicator">
                      <i className="fas fa-arrow-up"></i>
                      <span>+12.5%</span>
                    </div>
                  </div>
                  
                  <div className="usage-chart">
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        {api.trends.daily.map((value, index) => (
                          <div 
                            key={index}
                            className="chart-bar"
                            style={{ 
                              height: `${(value / Math.max(...api.trends.daily)) * 100}%`,
                              backgroundColor: getUtilizationColor((value / api.dailyLimit) * 100)
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="usage-stats">
                    <div className="stat">
                      <span className="stat-label">Peak:</span>
                      <span className="stat-value">{formatNumber(Math.max(...api.trends.daily))}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{formatNumber(Math.round(api.trends.daily.reduce((a, b) => a + b, 0) / api.trends.daily.length))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="usage-predictions">
            <h3>Usage Predictions</h3>
            <div className="predictions-grid">
              {Object.entries(quotaData.predictions.daily).map(([apiId, prediction]) => {
                const api = quotaData.apis.find(a => a.id === apiId);
                return (
                  <div key={apiId} className="prediction-card">
                    <div className="prediction-header">
                      <h4>{api?.name}</h4>
                      <div className="confidence-score">
                        {prediction.confidence}% confidence
                      </div>
                    </div>
                    <div className="prediction-details">
                      <div className="predicted-usage">
                        <span className="prediction-label">Predicted Usage:</span>
                        <span className="prediction-value">{formatNumber(prediction.predicted)}</span>
                      </div>
                      <div className="prediction-comparison">
                        <span className="comparison-label">vs Current:</span>
                        <span className={`comparison-value ${prediction.predicted > api.currentUsage ? 'increase' : 'decrease'}`}>
                          {prediction.predicted > api.currentUsage ? '+' : ''}{((prediction.predicted - api.currentUsage) / api.currentUsage * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeView === 'costs' && (
        <div className="costs-section">
          <div className="cost-summary">
            <h3>Cost Analysis</h3>
            <div className="cost-cards">
              <div className="cost-card total-cost">
                <div className="cost-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="cost-content">
                  <div className="cost-value">
                    {formatCurrency(quotaData.apis.reduce((sum, api) => sum + api.totalCost, 0))}
                  </div>
                  <div className="cost-label">Total Cost (This Month)</div>
                  <div className="cost-trend">
                    <i className="fas fa-arrow-up"></i>
                    <span>+8.2% from last month</span>
                  </div>
                </div>
              </div>
              
              <div className="cost-card avg-cost">
                <div className="cost-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div className="cost-content">
                  <div className="cost-value">
                    {formatCurrency(quotaData.apis.reduce((sum, api) => sum + api.totalCost, 0) / quotaData.apis.length)}
                  </div>
                  <div className="cost-label">Average Cost per API</div>
                  <div className="cost-trend">
                    <i className="fas fa-arrow-down"></i>
                    <span>-2.1% from last month</span>
                  </div>
                </div>
              </div>
              
              <div className="cost-card highest-cost">
                <div className="cost-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="cost-content">
                  <div className="cost-value">
                    {formatCurrency(Math.max(...quotaData.apis.map(api => api.totalCost)))}
                  </div>
                  <div className="cost-label">Highest API Cost</div>
                  <div className="cost-api">AI Processing API</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cost-breakdown">
            <h3>Cost Breakdown by API</h3>
            <div className="breakdown-grid">
              {quotaData.apis
                .sort((a, b) => b.totalCost - a.totalCost)
                .map(api => (
                  <div key={api.id} className="breakdown-card">
                    <div className="breakdown-header">
                      <h4>{api.name}</h4>
                      <div className="cost-amount">{formatCurrency(api.totalCost)}</div>
                    </div>
                    <div className="breakdown-metrics">
                      <div className="metric-row">
                        <span className="metric-label">Cost per Request:</span>
                        <span className="metric-value">{formatCurrency(api.costPerRequest)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Total Requests:</span>
                        <span className="metric-value">{formatNumber(api.currentUsage)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Cost Efficiency:</span>
                        <span className={`metric-value ${api.totalCost / api.currentUsage < 0.01 ? 'efficient' : 'expensive'}`}>
                          {api.totalCost / api.currentUsage < 0.01 ? 'Efficient' : 'Review'}
                        </span>
                      </div>
                    </div>
                    <div className="cost-trend-bar">
                      <div 
                        className="trend-fill"
                        style={{ 
                          width: `${(api.totalCost / Math.max(...quotaData.apis.map(a => a.totalCost))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'alerts' && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h3>Quota Alerts & Notifications</h3>
            <div className="alerts-actions">
              <button className="alert-btn primary">
                <i className="fas fa-plus"></i>
                Create Alert
              </button>
              <button className="alert-btn secondary">
                <i className="fas fa-cog"></i>
                Alert Settings
              </button>
              <button className="alert-btn tertiary">
                <i className="fas fa-check-double"></i>
                Mark All Read
              </button>
            </div>
          </div>

          <div className="active-alerts">
            <h4>Active Alerts</h4>
            <div className="alerts-list">
              {quotaData.alerts
                .filter(alert => !alert.resolved)
                .map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.severity}`}>
                    <div className="alert-icon">
                      <i className={`fas ${
                        alert.severity === 'critical' ? 'fa-exclamation-circle' :
                        alert.severity === 'warning' ? 'fa-exclamation-triangle' :
                        'fa-info-circle'
                      }`}></i>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.api}</div>
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-timestamp">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="alert-actions">
                      <button className="alert-action-btn resolve">
                        <i className="fas fa-check"></i>
                        Resolve
                      </button>
                      <button className="alert-action-btn details">
                        <i className="fas fa-eye"></i>
                        Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="alert-configuration">
            <h4>Alert Configuration</h4>
            <div className="config-grid">
              <div className="config-card">
                <h5>Usage Thresholds</h5>
                <div className="config-form">
                  <div className="config-group">
                    <label>Warning Threshold:</label>
                    <input type="number" value="75" />
                    <span className="unit">%</span>
                  </div>
                  <div className="config-group">
                    <label>Critical Threshold:</label>
                    <input type="number" value="90" />
                    <span className="unit">%</span>
                  </div>
                  <div className="config-group">
                    <label>Exceeded Action:</label>
                    <select>
                      <option>Alert Only</option>
                      <option>Alert + Throttle</option>
                      <option>Alert + Block</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-card">
                <h5>Notification Settings</h5>
                <div className="config-form">
                  <div className="config-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email Notifications
                    </label>
                  </div>
                  <div className="config-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Dashboard Alerts
                    </label>
                  </div>
                  <div className="config-group">
                    <label>
                      <input type="checkbox" />
                      Slack Notifications
                    </label>
                  </div>
                  <div className="config-group">
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

              <div className="config-card">
                <h5>Cost Monitoring</h5>
                <div className="config-form">
                  <div className="config-group">
                    <label>Monthly Budget:</label>
                    <input type="number" value="1000" />
                    <span className="unit">USD</span>
                  </div>
                  <div className="config-group">
                    <label>Budget Alert at:</label>
                    <input type="number" value="80" />
                    <span className="unit">%</span>
                  </div>
                  <div className="config-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Daily Cost Reports
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="config-actions">
              <button className="config-btn primary">Save Configuration</button>
              <button className="config-btn secondary">Reset to Defaults</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiQuotaTracking;
