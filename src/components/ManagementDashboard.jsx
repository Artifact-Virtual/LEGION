import React, { useState, useEffect, useCallback } from 'react';
import ActiveWorkflowDisplay from './ActiveWorkflowDisplay';
import WorkflowTriggerMonitoring from './WorkflowTriggerMonitoring';
import AutomationScheduleManager from './AutomationScheduleManager';
import ProcessOptimizationTracking from './ProcessOptimizationTracking';
import './ManagementDashboard.css';

const ManagementDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [workflows, setWorkflows] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowModal, setWorkflowModal] = useState(false);
  const [managementFilters, setManagementFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    department: 'all',
    trigger: 'all',
    schedule: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');
  const [bulkActions, setBulkActions] = useState([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState([]);

  // Mock data generators
  const generateWorkflows = useCallback(() => {
    const workflowTypes = ['business-process', 'data-pipeline', 'automation', 'integration', 'analysis', 'reporting'];
    const statuses = ['running', 'completed', 'failed', 'paused', 'queued', 'scheduled', 'cancelled'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    const departments = ['marketing', 'sales', 'finance', 'operations', 'research', 'strategy', 'legal', 'hr'];
    
    const workflowNames = [
      'Customer Onboarding Process', 'Lead Qualification Pipeline', 'Financial Reporting Automation',
      'Market Research Analysis', 'Content Creation Workflow', 'Sales Performance Review',
      'Compliance Audit Process', 'Strategic Planning Pipeline', 'Employee Performance Review',
      'Product Launch Coordination', 'Customer Support Escalation', 'Revenue Recognition Process',
      'Marketing Campaign Automation', 'Risk Assessment Pipeline', 'Data Quality Management',
      'Customer Feedback Analysis', 'Inventory Management Process', 'Security Compliance Check',
      'Business Intelligence Pipeline', 'Project Status Reporting', 'Budget Planning Process',
      'Competitive Analysis Workflow', 'Partnership Evaluation', 'Training Program Management'
    ];

    return Array.from({ length: 24 }, (_, index) => ({
      id: `workflow-${index + 1}`,
      name: workflowNames[index] || `Workflow ${index + 1}`,
      type: workflowTypes[Math.floor(Math.random() * workflowTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      description: `Enterprise workflow for ${workflowTypes[Math.floor(Math.random() * workflowTypes.length)]} automation and optimization.`,
      createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(), // 30 days
      startedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      completedAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 43200000).toISOString() : null,
      estimatedDuration: Math.floor(Math.random() * 7200) + 300, // seconds
      actualDuration: Math.floor(Math.random() * 6000) + 400, // seconds
      progress: Math.floor(Math.random() * 100),
      steps: Math.floor(Math.random() * 12) + 3,
      completedSteps: Math.floor(Math.random() * 10) + 1,
      failedSteps: Math.floor(Math.random() * 2),
      owner: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez'][Math.floor(Math.random() * 5)],
      assignedAgents: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `agent-${Math.floor(Math.random() * 20) + 1}`),
      triggerType: ['manual', 'scheduled', 'event-driven', 'condition-based'][Math.floor(Math.random() * 4)],
      triggerCondition: ['time-based', 'data-threshold', 'system-event', 'manual-trigger'][Math.floor(Math.random() * 4)],
      nextRun: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 86400000).toISOString() : null,
      frequency: ['once', 'hourly', 'daily', 'weekly', 'monthly'][Math.floor(Math.random() * 5)],
      executionCount: Math.floor(Math.random() * 100) + 1,
      successRate: (Math.random() * 30 + 70).toFixed(1),
      averageExecutionTime: (Math.random() * 3600 + 300).toFixed(0),
      resourceUsage: {
        cpu: Math.floor(Math.random() * 80) + 10,
        memory: Math.floor(Math.random() * 70) + 20,
        network: Math.floor(Math.random() * 60) + 5,
        storage: Math.floor(Math.random() * 50) + 10
      },
      performance: {
        efficiency: Math.floor(Math.random() * 30) + 70,
        reliability: Math.floor(Math.random() * 25) + 75,
        scalability: Math.floor(Math.random() * 35) + 65,
        maintainability: Math.floor(Math.random() * 40) + 60
      },
      metrics: {
        throughput: (Math.random() * 1000 + 100).toFixed(0) + '/hr',
        errorRate: (Math.random() * 5).toFixed(2) + '%',
        avgResponseTime: (Math.random() * 2000 + 100).toFixed(0) + 'ms',
        costPerExecution: '$' + (Math.random() * 10 + 0.5).toFixed(2)
      },
      dependencies: Array.from({ length: Math.floor(Math.random() * 4) }, () => `workflow-${Math.floor(Math.random() * 24) + 1}`),
      tags: ['enterprise', 'automated', 'business-critical', 'optimized', 'scalable'].slice(0, Math.floor(Math.random() * 3) + 2),
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      environment: ['production', 'staging', 'development'][Math.floor(Math.random() * 3)],
      alertsEnabled: Math.random() > 0.2,
      alertsCount: Math.floor(Math.random() * 10),
      lastAlert: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      slaCompliance: (Math.random() * 20 + 80).toFixed(1),
      businessImpact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      optimizationPotential: Math.floor(Math.random() * 50) + 10,
      lastOptimized: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 1296000000).toISOString() : null,
      notes: `Workflow optimized for enterprise ${workflowTypes[Math.floor(Math.random() * workflowTypes.length)]} operations with comprehensive automation.`
    }));
  }, []);

  const generateTriggers = useCallback(() => {
    const triggerTypes = ['time-based', 'event-driven', 'condition-based', 'manual', 'api-webhook'];
    const statuses = ['active', 'inactive', 'triggered', 'failed', 'pending'];
    
    return Array.from({ length: 18 }, (_, index) => ({
      id: `trigger-${index + 1}`,
      name: `Trigger ${index + 1}`,
      type: triggerTypes[Math.floor(Math.random() * triggerTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      workflowId: `workflow-${Math.floor(Math.random() * 24) + 1}`,
      condition: 'System event or time-based condition for workflow execution',
      lastTriggered: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      nextTrigger: Math.random() > 0.4 ? new Date(Date.now() + Math.random() * 86400000).toISOString() : null,
      triggerCount: Math.floor(Math.random() * 500) + 10,
      successRate: (Math.random() * 25 + 75).toFixed(1),
      failureCount: Math.floor(Math.random() * 50),
      averageDelay: (Math.random() * 1000 + 50).toFixed(0) + 'ms',
      reliability: Math.floor(Math.random() * 30) + 70,
      configuration: {
        retryAttempts: Math.floor(Math.random() * 5) + 1,
        timeout: Math.floor(Math.random() * 300) + 30,
        cooldownPeriod: Math.floor(Math.random() * 600) + 60
      }
    }));
  }, []);

  const generateSchedules = useCallback(() => {
    const scheduleTypes = ['cron', 'interval', 'one-time', 'recurring'];
    const frequencies = ['hourly', 'daily', 'weekly', 'monthly', 'custom'];
    
    return Array.from({ length: 15 }, (_, index) => ({
      id: `schedule-${index + 1}`,
      name: `Schedule ${index + 1}`,
      type: scheduleTypes[Math.floor(Math.random() * scheduleTypes.length)],
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      workflowId: `workflow-${Math.floor(Math.random() * 24) + 1}`,
      cronExpression: '0 */6 * * *', // Example cron
      nextExecution: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      lastExecution: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      executionCount: Math.floor(Math.random() * 200) + 5,
      missedExecutions: Math.floor(Math.random() * 5),
      enabled: Math.random() > 0.1,
      timezone: 'UTC',
      description: 'Automated schedule for workflow execution optimization',
      createdBy: ['System Admin', 'Workflow Manager', 'Operations Team'][Math.floor(Math.random() * 3)],
      modifiedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
  }, []);

  const generateProcesses = useCallback(() => {
    const processTypes = ['business-process', 'technical-process', 'compliance-process', 'operational-process'];
    
    return Array.from({ length: 20 }, (_, index) => ({
      id: `process-${index + 1}`,
      name: `Process ${index + 1}`,
      type: processTypes[Math.floor(Math.random() * processTypes.length)],
      efficiency: Math.floor(Math.random() * 40) + 60,
      optimizationScore: Math.floor(Math.random() * 50) + 50,
      bottleneckCount: Math.floor(Math.random() * 5),
      improvementPotential: Math.floor(Math.random() * 30) + 10,
      lastOptimized: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 2592000000).toISOString() : null,
      recommendedActions: Math.floor(Math.random() * 8) + 2,
      costSavings: '$' + (Math.random() * 5000 + 100).toFixed(2),
      timeReduction: (Math.random() * 50 + 5).toFixed(1) + '%',
      qualityImprovement: (Math.random() * 25 + 5).toFixed(1) + '%'
    }));
  }, []);

  const generateTemplates = useCallback(() => {
    const categories = ['business', 'technical', 'compliance', 'analytics', 'integration'];
    
    return Array.from({ length: 12 }, (_, index) => ({
      id: `template-${index + 1}`,
      name: `Template ${index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: 'Pre-configured workflow template for enterprise automation',
      usageCount: Math.floor(Math.random() * 100) + 5,
      successRate: (Math.random() * 20 + 80).toFixed(1),
      lastUsed: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      version: `v${Math.floor(Math.random() * 3) + 1}.0`,
      createdBy: ['Template Admin', 'Workflow Designer', 'Operations Team'][Math.floor(Math.random() * 3)],
      rating: (Math.random() * 2 + 3).toFixed(1),
      complexity: ['simple', 'moderate', 'complex'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  const generateAnalytics = useCallback(() => {
    return {
      overview: {
        totalWorkflows: 24,
        activeWorkflows: Math.floor(Math.random() * 15) + 10,
        completedToday: Math.floor(Math.random() * 20) + 5,
        failedToday: Math.floor(Math.random() * 3),
        avgExecutionTime: (Math.random() * 1800 + 300).toFixed(0) + 's',
        systemEfficiency: (Math.random() * 20 + 80).toFixed(1) + '%'
      },
      performance: {
        throughputTrend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 20),
        errorRateTrend: Array.from({ length: 24 }, () => (Math.random() * 5).toFixed(2)),
        efficiencyTrend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20) + 80),
        resourceUsageTrend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 60) + 20)
      },
      optimization: {
        totalOptimizations: Math.floor(Math.random() * 50) + 20,
        costSavings: '$' + (Math.random() * 50000 + 10000).toFixed(2),
        timeReduction: (Math.random() * 40 + 10).toFixed(1) + '%',
        qualityImprovement: (Math.random() * 30 + 15).toFixed(1) + '%'
      }
    };
  }, []);

  // Data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setWorkflows(generateWorkflows());
        setTriggers(generateTriggers());
        setSchedules(generateSchedules());
        setProcesses(generateProcesses());
        setTemplates(generateTemplates());
        setAnalytics(generateAnalytics());
        
      } catch (error) {
        console.error('Error loading management data:', error);
        setError('Failed to load management data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [generateWorkflows, generateTriggers, generateSchedules, generateProcesses, generateTemplates, generateAnalytics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflows(generateWorkflows());
      setTriggers(generateTriggers());
      setSchedules(generateSchedules());
      setProcesses(generateProcesses());
      setTemplates(generateTemplates());
      setAnalytics(generateAnalytics());
      
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and search logic
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesFilters = 
      (managementFilters.status === 'all' || workflow.status === managementFilters.status) &&
      (managementFilters.type === 'all' || workflow.type === managementFilters.type) &&
      (managementFilters.priority === 'all' || workflow.priority === managementFilters.priority) &&
      (managementFilters.department === 'all' || workflow.department === managementFilters.department);
    
    const matchesSearch = !searchQuery || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilters && matchesSearch;
  });

  const sortData = (data) => {
    return data.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'progress':
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortedWorkflows = sortData([...filteredWorkflows]);

  const getStatusColor = (status) => {
    const colors = {
      running: '#28a745',
      completed: '#17a2b8',
      failed: '#dc3545',
      paused: '#ffc107',
      queued: '#6c757d',
      scheduled: '#20c997',
      cancelled: '#fd7e14',
      active: '#28a745',
      inactive: '#6c757d',
      triggered: '#ffc107',
      pending: '#17a2b8'
    };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#666';
  };

  const renderOverviewView = () => (
    <div className="overview-content">
      <div className="management-overview">
        <div className="overview-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-project-diagram"></i>
            </div>
            <div className="metric-content">
              <h3>{workflows.length}</h3>
              <p>Total Workflows</p>
              <span className="metric-detail">
                {workflows.filter(w => w.status === 'running').length} running
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="metric-content">
              <h3>{analytics.overview?.activeWorkflows || 0}</h3>
              <p>Active Workflows</p>
              <span className="metric-detail">
                {analytics.overview?.avgExecutionTime || 'N/A'} avg time
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="metric-content">
              <h3>{analytics.overview?.completedToday || 0}</h3>
              <p>Completed Today</p>
              <span className="metric-detail">
                {analytics.overview?.systemEfficiency || '0%'} efficiency
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="metric-content">
              <h3>{analytics.overview?.failedToday || 0}</h3>
              <p>Failed Today</p>
              <span className="metric-detail">
                {triggers.filter(t => t.status === 'failed').length} trigger failures
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-status">
        <div className="status-section">
          <h3>Workflow Status Distribution</h3>
          <div className="status-chart">
            <div className="status-bars">
              {['running', 'completed', 'queued', 'failed', 'paused'].map(status => {
                const count = workflows.filter(w => w.status === status).length;
                const percentage = workflows.length > 0 ? (count / workflows.length) * 100 : 0;
                return (
                  <div key={status} className="status-bar">
                    <div className="bar-info">
                      <span className="status-name">{status}</span>
                      <span className="status-count">{count}</span>
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getStatusColor(status)
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="performance-section">
          <h3>System Performance</h3>
          <div className="performance-metrics">
            <div className="perf-metric">
              <span className="perf-label">Avg Success Rate:</span>
              <span className="perf-value">
                {(workflows.reduce((sum, w) => sum + parseFloat(w.successRate), 0) / workflows.length || 0).toFixed(1)}%
              </span>
            </div>
            <div className="perf-metric">
              <span className="perf-label">Optimization Score:</span>
              <span className="perf-value">
                {(processes.reduce((sum, p) => sum + p.optimizationScore, 0) / processes.length || 0).toFixed(0)}
              </span>
            </div>
            <div className="perf-metric">
              <span className="perf-label">Cost Savings:</span>
              <span className="perf-value">
                {analytics.optimization?.costSavings || '$0'}
              </span>
            </div>
            <div className="perf-metric">
              <span className="perf-label">Active Triggers:</span>
              <span className="perf-value">
                {triggers.filter(t => t.status === 'active').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Workflow Activity</h3>
        <div className="activity-feed">
          {workflows.slice(0, 8).map(workflow => (
            <div key={workflow.id} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-cog"></i>
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-name">{workflow.name}</span>
                  <span className="activity-time">
                    {workflow.startedAt ? new Date(workflow.startedAt).toLocaleTimeString() : 'Not started'}
                  </span>
                </div>
                <div className="activity-details">
                  <span className="department">{workflow.department}</span>
                  <span className="type">{workflow.type}</span>
                  <span className="owner">{workflow.owner}</span>
                </div>
                <div className="activity-status">
                  <span 
                    className="status-indicator" 
                    style={{ backgroundColor: getStatusColor(workflow.status) }}
                  ></span>
                  <span className="status-text">{workflow.status}</span>
                  <span className="progress-text">{workflow.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflowsView = () => (
    <div className="workflows-content">
      <div className="workflows-controls">
        <div className="search-section">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="progress">Sort by Progress</option>
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created</option>
            </select>
            <button 
              className="sort-order"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        <div className="filter-section">
          <select value={managementFilters.status} onChange={(e) => setManagementFilters({...managementFilters, status: e.target.value})}>
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="paused">Paused</option>
            <option value="queued">Queued</option>
          </select>
          <select value={managementFilters.type} onChange={(e) => setManagementFilters({...managementFilters, type: e.target.value})}>
            <option value="all">All Types</option>
            <option value="business-process">Business Process</option>
            <option value="data-pipeline">Data Pipeline</option>
            <option value="automation">Automation</option>
            <option value="integration">Integration</option>
            <option value="analysis">Analysis</option>
          </select>
          <select value={managementFilters.priority} onChange={(e) => setManagementFilters({...managementFilters, priority: e.target.value})}>
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={managementFilters.department} onChange={(e) => setManagementFilters({...managementFilters, department: e.target.value})}>
            <option value="all">All Departments</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="finance">Finance</option>
            <option value="operations">Operations</option>
            <option value="research">Research</option>
          </select>
        </div>
      </div>

      <div className="workflows-grid">
        {sortedWorkflows.map(workflow => (
          <div key={workflow.id} className="workflow-card" onClick={() => {setSelectedWorkflow(workflow); setWorkflowModal(true);}}>
            <div className="workflow-header">
              <div className="workflow-info">
                <h3>{workflow.name}</h3>
                <span className="workflow-version">{workflow.version}</span>
              </div>
              <div className="workflow-badges">
                <span className="status-badge" style={{ backgroundColor: getStatusColor(workflow.status) }}>
                  {workflow.status}
                </span>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(workflow.priority) }}>
                  {workflow.priority}
                </span>
              </div>
            </div>

            <div className="workflow-meta">
              <span className="workflow-type">{workflow.type}</span>
              <span className="workflow-department">{workflow.department}</span>
              <span className="workflow-owner">{workflow.owner}</span>
            </div>

            <div className="workflow-progress">
              <div className="progress-header">
                <span className="progress-label">Progress:</span>
                <span className="progress-value">{workflow.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${workflow.progress}%` }}></div>
              </div>
              <div className="progress-details">
                <span>{workflow.completedSteps}/{workflow.steps} steps</span>
                {workflow.failedSteps > 0 && (
                  <span className="failed-steps">{workflow.failedSteps} failed</span>
                )}
              </div>
            </div>

            <div className="workflow-metrics">
              <div className="metric-item">
                <span className="metric-label">Success Rate:</span>
                <span className="metric-value">{workflow.successRate}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Executions:</span>
                <span className="metric-value">{workflow.executionCount}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Avg Time:</span>
                <span className="metric-value">{workflow.averageExecutionTime}s</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Agents:</span>
                <span className="metric-value">{workflow.assignedAgents.length}</span>
              </div>
            </div>

            <div className="workflow-footer">
              <div className="workflow-timing">
                <i className="fas fa-clock"></i>
                <span>
                  {workflow.nextRun ? 
                    `Next: ${new Date(workflow.nextRun).toLocaleString()}` : 
                    'Manual trigger'
                  }
                </span>
              </div>
              <div className="workflow-performance">
                <i className="fas fa-chart-line"></i>
                <span>Efficiency: {workflow.performance.efficiency}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverviewView();
      case 'workflows':
        return renderWorkflowsView();
      case 'triggers':
        return <WorkflowTriggerMonitoring />;
      case 'schedules':
        return <AutomationScheduleManager />;
      case 'optimization':
        return <ProcessOptimizationTracking />;
      case 'active':
        return <ActiveWorkflowDisplay />;
      default:
        return renderOverviewView();
    }
  };

  if (loading) {
    return (
      <div className="management-dashboard loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading workflow management dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="management-dashboard error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="management-dashboard">
      <div className="management-header">
        <div className="header-left">
          <h1>Workflow Management Center</h1>
          <p>Comprehensive workflow orchestration and process optimization</p>
        </div>
        <div className="header-right">
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <i className="fas fa-sync-alt"></i>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="create-workflow-btn">
            <i className="fas fa-plus"></i>
            Create Workflow
          </button>
        </div>
      </div>

      <div className="management-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            Overview
          </button>
          <button 
            className={`nav-tab ${activeView === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveView('workflows')}
          >
            <i className="fas fa-project-diagram"></i>
            Workflows
            <span className="count">{workflows.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'active' ? 'active' : ''}`}
            onClick={() => setActiveView('active')}
          >
            <i className="fas fa-play-circle"></i>
            Active
            <span className="count">{workflows.filter(w => w.status === 'running').length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'triggers' ? 'active' : ''}`}
            onClick={() => setActiveView('triggers')}
          >
            <i className="fas fa-bolt"></i>
            Triggers
            <span className="count">{triggers.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveView('schedules')}
          >
            <i className="fas fa-calendar-alt"></i>
            Schedules
            <span className="count">{schedules.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'optimization' ? 'active' : ''}`}
            onClick={() => setActiveView('optimization')}
          >
            <i className="fas fa-chart-line"></i>
            Optimization
          </button>
        </div>
      </div>

      <div className="management-main">
        {renderContent()}
      </div>

      {/* Workflow Modal */}
      {workflowModal && selectedWorkflow && (
        <div className="modal-overlay" onClick={() => setWorkflowModal(false)}>
          <div className="workflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedWorkflow.name}</h3>
              <button 
                className="close-button" 
                onClick={() => setWorkflowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              {/* Detailed workflow modal content would go here */}
              <p>{selectedWorkflow.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementDashboard;
