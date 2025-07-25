import React, { useState, useEffect, useCallback } from 'react';
import PerformanceTrendAnalysis from './PerformanceTrendAnalysis';
import SelfImprovementMetrics from './SelfImprovementMetrics';
import ResourceUtilizationMonitoring from './ResourceUtilizationMonitoring';
import BottleneckIdentificationSystem from './BottleneckIdentificationSystem';
import OptimizationRecommendationEngine from './OptimizationRecommendationEngine';
import ConfigurationOptimizationTools from './ConfigurationOptimizationTools';
import './OptimizationDashboard.css';

const OptimizationDashboard = () => {
  const [optimizationData, setOptimizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // overview, performance, efficiency, resources, bottlenecks, recommendations
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateOptimizationData = useCallback(() => {
    const systemComponents = [
      'Agent Orchestrator', 'Workflow Engine', 'Database Layer', 'API Gateway',
      'Message Queue', 'Cache Layer', 'Load Balancer', 'Authentication Service',
      'File Storage', 'Monitoring System', 'Analytics Engine', 'Notification Service'
    ];

    const optimizationCategories = [
      'Performance', 'Resource Usage', 'Cost Efficiency', 'Reliability',
      'Scalability', 'Security', 'User Experience', 'Maintainability'
    ];

    const generateMetrics = () => ({
      systemHealth: (Math.random() * 20 + 80).toFixed(1), // 80-100%
      performanceScore: (Math.random() * 30 + 70).toFixed(1), // 70-100
      efficiencyRating: (Math.random() * 25 + 75).toFixed(1), // 75-100
      resourceUtilization: (Math.random() * 40 + 45).toFixed(1), // 45-85%
      costOptimization: (Math.random() * 35 + 65).toFixed(1), // 65-100%
      securityScore: (Math.random() * 15 + 85).toFixed(1), // 85-100%
      uptime: (Math.random() * 2 + 98).toFixed(2), // 98-100%
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      throughput: Math.floor(Math.random() * 2000) + 1000, // 1000-3000 req/min
      errorRate: (Math.random() * 0.5).toFixed(3), // 0-0.5%
      activeOptimizations: Math.floor(Math.random() * 15) + 8, // 8-22
      completedOptimizations: Math.floor(Math.random() * 50) + 25, // 25-75
      potentialSavings: Math.floor(Math.random() * 10000) + 5000, // $5000-15000
      actualSavings: Math.floor(Math.random() * 8000) + 3000 // $3000-11000
    });

    const systemComponents_detailed = systemComponents.map((component, index) => ({
      id: `component-${index + 1}`,
      name: component,
      health: (Math.random() * 30 + 70).toFixed(1), // 70-100%
      performance: (Math.random() * 25 + 75).toFixed(1), // 75-100
      efficiency: (Math.random() * 20 + 80).toFixed(1), // 80-100
      resourceUsage: {
        cpu: Math.floor(Math.random() * 60) + 20, // 20-80%
        memory: Math.floor(Math.random() * 70) + 15, // 15-85%
        disk: Math.floor(Math.random() * 50) + 10, // 10-60%
        network: Math.floor(Math.random() * 80) + 20 // 20-100%
      },
      optimizationPotential: Math.floor(Math.random() * 40) + 10, // 10-50%
      lastOptimized: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      issues: Math.floor(Math.random() * 5), // 0-4 issues
      recommendations: Math.floor(Math.random() * 8) + 2, // 2-9 recommendations
      trend: Math.random() > 0.4 ? 'improving' : Math.random() > 0.5 ? 'stable' : 'declining',
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      category: optimizationCategories[Math.floor(Math.random() * optimizationCategories.length)]
    }));

    const performanceTrends = Array.from({ length: parseInt(timeRange) || 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i));
      return {
        date: date.toISOString().split('T')[0],
        systemHealth: Math.floor(Math.random() * 15) + 85,
        performance: Math.floor(Math.random() * 20) + 75,
        efficiency: Math.floor(Math.random() * 18) + 82,
        responseTime: Math.floor(Math.random() * 100) + 80,
        throughput: Math.floor(Math.random() * 500) + 1500,
        errorRate: (Math.random() * 0.3).toFixed(3),
        resourceUsage: Math.floor(Math.random() * 30) + 50,
        optimizations: Math.floor(Math.random() * 5) + 2
      };
    });

    const optimizationRecommendations = [
      {
        id: 'opt-1',
        title: 'Implement Database Query Caching',
        category: 'Performance',
        priority: 'high',
        impact: 'high',
        effort: 'medium',
        description: 'Add Redis caching layer for frequently accessed database queries to reduce response times by 40%',
        potentialSavings: 5200,
        estimatedTime: '2-3 weeks',
        complexity: 'medium',
        dependencies: ['Redis setup', 'Cache invalidation strategy'],
        expectedBenefits: ['40% faster query response', 'Reduced database load', 'Better user experience'],
        status: 'pending',
        confidence: 87
      },
      {
        id: 'opt-2',
        title: 'Optimize Agent Task Distribution',
        category: 'Efficiency',
        priority: 'high',
        impact: 'high',
        effort: 'low',
        description: 'Implement intelligent load balancing for agent task distribution to improve throughput by 25%',
        potentialSavings: 3800,
        estimatedTime: '1-2 weeks',
        complexity: 'low',
        dependencies: ['Load balancing algorithm'],
        expectedBenefits: ['25% better throughput', 'Balanced workloads', 'Improved reliability'],
        status: 'in-progress',
        confidence: 92
      },
      {
        id: 'opt-3',
        title: 'Implement Auto-Scaling Infrastructure',
        category: 'Cost Efficiency',
        priority: 'medium',
        impact: 'high',
        effort: 'high',
        description: 'Deploy auto-scaling containers to optimize resource usage and reduce operational costs by 30%',
        potentialSavings: 7500,
        estimatedTime: '4-6 weeks',
        complexity: 'high',
        dependencies: ['Container orchestration', 'Monitoring integration'],
        expectedBenefits: ['30% cost reduction', 'Automatic scaling', 'Better resource utilization'],
        status: 'planned',
        confidence: 78
      },
      {
        id: 'opt-4',
        title: 'Upgrade Message Queue System',
        category: 'Reliability',
        priority: 'medium',
        impact: 'medium',
        effort: 'medium',
        description: 'Migrate to distributed message queue system for better reliability and fault tolerance',
        potentialSavings: 2100,
        estimatedTime: '2-3 weeks',
        complexity: 'medium',
        dependencies: ['Queue migration strategy', 'Data backup'],
        expectedBenefits: ['Improved reliability', 'Better fault tolerance', 'Reduced message loss'],
        status: 'pending',
        confidence: 85
      },
      {
        id: 'opt-5',
        title: 'Implement Edge Caching',
        category: 'Performance',
        priority: 'low',
        impact: 'medium',
        effort: 'medium',
        description: 'Deploy CDN and edge caching to improve global response times and reduce bandwidth costs',
        potentialSavings: 1900,
        estimatedTime: '3-4 weeks',
        complexity: 'medium',
        dependencies: ['CDN provider selection', 'Cache strategy'],
        expectedBenefits: ['Faster global access', 'Reduced bandwidth costs', 'Better user experience'],
        status: 'research',
        confidence: 71
      }
    ];

    const bottlenecks = [
      {
        id: 'bottleneck-1',
        component: 'Database Layer',
        type: 'Performance',
        severity: 'high',
        description: 'Database queries experiencing high latency during peak hours',
        impact: 'User response times increased by 150%',
        firstDetected: new Date(Date.now() - 72 * 3600000).toISOString(),
        affectedUsers: 1247,
        frequency: 'Daily',
        trend: 'worsening',
        suggestions: ['Optimize queries', 'Add indexes', 'Implement caching']
      },
      {
        id: 'bottleneck-2',
        component: 'Agent Orchestrator',
        type: 'Resource',
        severity: 'medium',
        description: 'CPU utilization spiking above 85% during workflow execution',
        impact: 'Task processing delays of 15-30 seconds',
        firstDetected: new Date(Date.now() - 48 * 3600000).toISOString(),
        affectedUsers: 892,
        frequency: 'Multiple times daily',
        trend: 'stable',
        suggestions: ['Scale horizontally', 'Optimize algorithms', 'Load balancing']
      },
      {
        id: 'bottleneck-3',
        component: 'API Gateway',
        type: 'Throughput',
        severity: 'low',
        description: 'Request queue building up during traffic spikes',
        impact: 'Occasional 2-3 second delays in API responses',
        firstDetected: new Date(Date.now() - 24 * 3600000).toISOString(),
        affectedUsers: 324,
        frequency: 'Weekly',
        trend: 'improving',
        suggestions: ['Increase connection pool', 'Add rate limiting', 'Cache responses']
      }
    ];

    const resourceOptimization = {
      current: {
        totalCost: 12450,
        cpuUtilization: 67,
        memoryUtilization: 72,
        storageUtilization: 58,
        networkUtilization: 43,
        wastedResources: 23
      },
      optimized: {
        totalCost: 9840,
        cpuUtilization: 78,
        memoryUtilization: 85,
        storageUtilization: 71,
        networkUtilization: 62,
        wastedResources: 8
      },
      savings: {
        cost: 2610,
        efficiency: 18,
        performance: 12
      }
    };

    return {
      overview: generateMetrics(),
      systemComponents: systemComponents_detailed,
      performanceTrends,
      recommendations: optimizationRecommendations,
      bottlenecks,
      resourceOptimization,
      optimizationStats: {
        totalOptimizations: optimizationRecommendations.length,
        activeOptimizations: optimizationRecommendations.filter(r => r.status === 'in-progress').length,
        completedOptimizations: Math.floor(Math.random() * 25) + 15,
        totalSavings: optimizationRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0),
        averageImplementationTime: '2-3 weeks',
        successRate: 89.2
      }
    };
  }, [timeRange]);

  useEffect(() => {
    const loadOptimizationData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = generateOptimizationData();
        setOptimizationData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading optimization data:', error);
        setLoading(false);
      }
    };

    loadOptimizationData();
  }, [generateOptimizationData, timeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const data = generateOptimizationData();
      setOptimizationData(data);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [generateOptimizationData, refreshInterval, autoRefresh]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#4facfe';
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'planned': return '#17a2b8';
      case 'research': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return 'fa-arrow-up text-success';
      case 'declining': return 'fa-arrow-down text-danger';
      case 'stable': return 'fa-minus text-warning';
      case 'worsening': return 'fa-arrow-down text-danger';
      default: return 'fa-minus text-muted';
    }
  };

  const renderOverview = () => (
    <div className="optimization-overview">
      <div className="overview-metrics">
        <div className="metric-row">
          <div className="metric-card primary">
            <div className="metric-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.systemHealth}%</div>
              <div className="metric-label">System Health</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-up"></i>
              +2.3%
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.performanceScore}</div>
              <div className="metric-label">Performance Score</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-up"></i>
              +5.1%
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">
              <i className="fas fa-cog"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.efficiencyRating}%</div>
              <div className="metric-label">Efficiency Rating</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-up"></i>
              +1.8%
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">
              <i className="fas fa-server"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.resourceUtilization}%</div>
              <div className="metric-label">Resource Usage</div>
            </div>
            <div className="metric-trend">
              <i className="fas fa-arrow-down"></i>
              -3.2%
            </div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">${optimizationData?.overview.potentialSavings?.toLocaleString()}</div>
              <div className="metric-label">Potential Savings</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.responseTime}ms</div>
              <div className="metric-label">Avg Response Time</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.throughput?.toLocaleString()}</div>
              <div className="metric-label">Throughput (req/min)</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="metric-content">
              <div className="metric-value">{optimizationData?.overview.errorRate}%</div>
              <div className="metric-label">Error Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-sections">
        <div className="section system-components-overview">
          <h3>System Components Health</h3>
          <div className="components-grid">
            {optimizationData?.systemComponents.slice(0, 8).map(component => (
              <div key={component.id} className="component-card">
                <div className="component-header">
                  <div className="component-name">{component.name}</div>
                  <div className="component-health" style={{color: component.health > 85 ? '#28a745' : component.health > 70 ? '#ffc107' : '#dc3545'}}>
                    {component.health}%
                  </div>
                </div>
                <div className="component-metrics">
                  <div className="metric-bar">
                    <div className="metric-label">Performance</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${component.performance}%`, backgroundColor: '#4facfe'}}></div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <div className="metric-label">Efficiency</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${component.efficiency}%`, backgroundColor: '#43e97b'}}></div>
                    </div>
                  </div>
                </div>
                <div className="component-status">
                  <span className={`trend-indicator ${component.trend}`}>
                    <i className={`fas ${getTrendIcon(component.trend).split(' ')[1]}`}></i>
                    {component.trend}
                  </span>
                  <span className="optimization-potential">{component.optimizationPotential}% potential</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section optimization-summary">
          <h3>Optimization Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-number">{optimizationData?.optimizationStats.activeOptimizations}</div>
              <div className="summary-label">Active Optimizations</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{optimizationData?.optimizationStats.completedOptimizations}</div>
              <div className="summary-label">Completed This Month</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">${optimizationData?.optimizationStats.totalSavings?.toLocaleString()}</div>
              <div className="summary-label">Total Potential Savings</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{optimizationData?.optimizationStats.successRate}%</div>
              <div className="summary-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'performance':
        return <PerformanceTrendAnalysis />;
      case 'efficiency':
        return <SelfImprovementMetrics />;
      case 'resources':
        return <ResourceUtilizationMonitoring />;
      case 'bottlenecks':
        return <BottleneckIdentificationSystem />;
      case 'recommendations':
        return <OptimizationRecommendationEngine />;
      case 'configuration':
        return <ConfigurationOptimizationTools />;
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="optimization-dashboard loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading optimization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="optimization-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>System Optimization Center</h2>
          <p>Monitor, analyze, and optimize system performance across all components</p>
        </div>
        <div className="header-controls">
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === '1d' ? 'active' : ''}`}
              onClick={() => setTimeRange('1d')}
            >
              1D
            </button>
            <button 
              className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button 
              className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button 
              className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              90D
            </button>
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
          className={`nav-btn ${activeView === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveView('performance')}
        >
          <i className="fas fa-tachometer-alt"></i>
          Performance
        </button>
        <button 
          className={`nav-btn ${activeView === 'efficiency' ? 'active' : ''}`}
          onClick={() => setActiveView('efficiency')}
        >
          <i className="fas fa-cog"></i>
          Efficiency
        </button>
        <button 
          className={`nav-btn ${activeView === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveView('resources')}
        >
          <i className="fas fa-server"></i>
          Resources
        </button>
        <button 
          className={`nav-btn ${activeView === 'bottlenecks' ? 'active' : ''}`}
          onClick={() => setActiveView('bottlenecks')}
        >
          <i className="fas fa-exclamation-triangle"></i>
          Bottlenecks
        </button>
        <button 
          className={`nav-btn ${activeView === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveView('recommendations')}
        >
          <i className="fas fa-lightbulb"></i>
          Recommendations
        </button>
        <button 
          className={`nav-btn ${activeView === 'configuration' ? 'active' : ''}`}
          onClick={() => setActiveView('configuration')}
        >
          <i className="fas fa-cogs"></i>
          Configuration
        </button>
      </div>

      <div className="dashboard-content">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default OptimizationDashboard;
