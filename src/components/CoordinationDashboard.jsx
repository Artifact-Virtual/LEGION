import React, { useState, useEffect, useCallback } from 'react';
import AgentDeploymentMatrix from './AgentDeploymentMatrix';
import InterAgentCommunication from './InterAgentCommunication';
import TaskDelegationTracking from './TaskDelegationTracking';
import AgentPerformanceScoreboard from './AgentPerformanceScoreboard';
import AgentWorkloadDistribution from './AgentWorkloadDistribution';
import AgentCommunicationNetwork from './AgentCommunicationNetwork';
import AgentCoordinationControls from './AgentCoordinationControls';
import './CoordinationDashboard.css';

const CoordinationDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [coordinationFilters, setCoordinationFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    department: 'all',
    performance: 'all',
    availability: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('performance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [agentModal, setAgentModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [communicationModal, setCommunicationModal] = useState(false);
  const [deploymentModal, setDeploymentModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data generators
  const generateAgents = useCallback(() => {
    const agentTypes = ['analytics', 'automation', 'communication', 'research', 'optimization', 'monitoring'];
    const statuses = ['active', 'idle', 'busy', 'maintenance', 'offline', 'error'];
    const departments = ['marketing', 'sales', 'finance', 'operations', 'research', 'strategy'];
    const performanceLevels = ['excellent', 'good', 'average', 'poor'];
    
    const agentNames = [
      'Analytics Agent Alpha', 'Research Agent Beta', 'Marketing Agent Gamma', 'Finance Agent Delta',
      'Operations Agent Epsilon', 'Strategy Agent Zeta', 'Customer Agent Eta', 'Data Agent Theta',
      'Communication Agent Iota', 'Automation Agent Kappa', 'Optimization Agent Lambda', 'Monitoring Agent Mu',
      'Business Agent Nu', 'Intelligence Agent Xi', 'Processing Agent Omicron', 'Coordination Agent Pi',
      'Integration Agent Rho', 'Analysis Agent Sigma', 'Workflow Agent Tau', 'Decision Agent Upsilon'
    ];

    return Array.from({ length: 20 }, (_, index) => ({
      id: `agent-${index + 1}`,
      name: agentNames[index] || `Agent ${index + 1}`,
      type: agentTypes[Math.floor(Math.random() * agentTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      performance: performanceLevels[Math.floor(Math.random() * performanceLevels.length)],
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      uptime: Math.floor(Math.random() * 100),
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      deployedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      cpuUsage: Math.floor(Math.random() * 80) + 10,
      memoryUsage: Math.floor(Math.random() * 70) + 20,
      networkUsage: Math.floor(Math.random() * 60) + 5,
      tasksCompleted: Math.floor(Math.random() * 500) + 50,
      tasksActive: Math.floor(Math.random() * 20) + 2,
      tasksPending: Math.floor(Math.random() * 15) + 1,
      successRate: Math.floor(Math.random() * 30) + 70,
      errorRate: (Math.random() * 5).toFixed(2),
      responseTime: (Math.random() * 500 + 50).toFixed(0) + 'ms',
      throughput: (Math.random() * 1000 + 100).toFixed(0) + '/hr',
      availability: Math.floor(Math.random() * 20) + 80,
      reliability: Math.floor(Math.random() * 25) + 75,
      efficiency: Math.floor(Math.random() * 30) + 70,
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      specializations: ['data-processing', 'machine-learning', 'natural-language', 'workflow-automation', 'real-time-analysis'].slice(0, Math.floor(Math.random() * 3) + 2),
      capabilities: [
        'Multi-threading support',
        'Real-time processing',
        'Machine learning integration',
        'Natural language processing',
        'Workflow automation',
        'Data visualization',
        'API integration',
        'Performance optimization'
      ].slice(0, Math.floor(Math.random() * 5) + 3),
      communications: Math.floor(Math.random() * 100) + 20,
      collaborations: Math.floor(Math.random() * 50) + 10,
      workloadCapacity: Math.floor(Math.random() * 100) + 50,
      currentWorkload: Math.floor(Math.random() * 80) + 10,
      queuedTasks: Math.floor(Math.random() * 25) + 5,
      averageTaskTime: (Math.random() * 300 + 60).toFixed(0) + 's',
      peakPerformance: Math.floor(Math.random() * 40) + 60,
      sustainedPerformance: Math.floor(Math.random() * 35) + 65,
      healthScore: Math.floor(Math.random() * 30) + 70,
      lastHealthCheck: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      alertsCount: Math.floor(Math.random() * 10),
      warningsCount: Math.floor(Math.random() * 5),
      location: ['Cloud-1', 'Cloud-2', 'Edge-1', 'Edge-2', 'Local-1'][Math.floor(Math.random() * 5)],
      region: ['us-east', 'us-west', 'eu-central', 'asia-pacific'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  const generateTasks = useCallback(() => {
    const taskTypes = ['analysis', 'processing', 'communication', 'optimization', 'monitoring', 'reporting'];
    const statuses = ['assigned', 'in-progress', 'completed', 'failed', 'paused', 'queued'];
    const priorities = ['urgent', 'high', 'medium', 'low'];
    
    const taskTitles = [
      'Market Data Analysis', 'Customer Behavior Processing', 'Financial Report Generation', 'System Optimization',
      'Real-time Monitoring Setup', 'Communication Protocol Update', 'Performance Analysis', 'Data Synchronization',
      'Workflow Automation', 'Quality Assurance Check', 'Security Audit', 'Resource Optimization',
      'Trend Analysis', 'Predictive Modeling', 'Integration Testing', 'Backup Verification'
    ];

    return Array.from({ length: 16 }, (_, index) => ({
      id: `task-${index + 1}`,
      title: taskTitles[index] || `Task ${index + 1}`,
      type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignedAgent: `agent-${Math.floor(Math.random() * 20) + 1}`,
      assignedBy: ['System Coordinator', 'User Admin', 'Workflow Manager', 'Task Scheduler'][Math.floor(Math.random() * 4)],
      description: `Automated task for ${taskTypes[Math.floor(Math.random() * taskTypes.length)]} processing with enterprise coordination requirements.`,
      createdAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      actualCompletion: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString() : null,
      progress: Math.floor(Math.random() * 100),
      complexity: ['simple', 'moderate', 'complex', 'advanced'][Math.floor(Math.random() * 4)],
      resourceRequirements: {
        cpu: Math.floor(Math.random() * 80) + 10,
        memory: Math.floor(Math.random() * 70) + 20,
        network: Math.floor(Math.random() * 50) + 5,
        storage: Math.floor(Math.random() * 100) + 10
      },
      dependencies: Math.floor(Math.random() * 5),
      dependents: Math.floor(Math.random() * 3),
      retryCount: Math.floor(Math.random() * 3),
      executionTime: (Math.random() * 1800 + 300).toFixed(0) + 's',
      waitingTime: (Math.random() * 600 + 60).toFixed(0) + 's',
      queuePosition: Math.floor(Math.random() * 10) + 1,
      successProbability: Math.floor(Math.random() * 30) + 70,
      errorCode: Math.random() > 0.8 ? `E${Math.floor(Math.random() * 1000) + 100}` : null,
      logs: Math.floor(Math.random() * 50) + 10,
      metrics: {
        throughput: (Math.random() * 100 + 10).toFixed(0) + '/min',
        accuracy: Math.floor(Math.random() * 20) + 80,
        efficiency: Math.floor(Math.random() * 25) + 75
      },
      tags: ['automated', 'priority', 'enterprise', 'coordination'].slice(0, Math.floor(Math.random() * 3) + 1),
      parentTask: Math.random() > 0.7 ? `task-${Math.floor(Math.random() * 16) + 1}` : null,
      subtasks: Math.floor(Math.random() * 5),
      notifications: Math.floor(Math.random() * 8) + 2
    }));
  }, []);

  const generateCommunications = useCallback(() => {
    const communicationTypes = ['inter-agent', 'system-notification', 'task-update', 'error-report', 'status-sync', 'coordination'];
    const protocols = ['http', 'websocket', 'message-queue', 'direct', 'broadcast'];
    const priorities = ['critical', 'high', 'normal', 'low'];
    
    return Array.from({ length: 24 }, (_, index) => ({
      id: `comm-${index + 1}`,
      type: communicationTypes[Math.floor(Math.random() * communicationTypes.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      sender: `agent-${Math.floor(Math.random() * 20) + 1}`,
      receiver: `agent-${Math.floor(Math.random() * 20) + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      message: `Agent coordination message for ${communicationTypes[Math.floor(Math.random() * communicationTypes.length)]} processing.`,
      status: ['sent', 'delivered', 'acknowledged', 'failed', 'pending'][Math.floor(Math.random() * 5)],
      responseTime: (Math.random() * 1000 + 10).toFixed(0) + 'ms',
      retries: Math.floor(Math.random() * 3),
      payloadSize: (Math.random() * 1000 + 100).toFixed(0) + 'B',
      encryption: Math.random() > 0.3,
      compressed: Math.random() > 0.4,
      acknowledged: Math.random() > 0.2,
      errorCode: Math.random() > 0.8 ? `C${Math.floor(Math.random() * 100) + 10}` : null,
      latency: (Math.random() * 50 + 5).toFixed(1) + 'ms',
      bandwidth: (Math.random() * 100 + 10).toFixed(0) + 'Kbps',
      route: Math.floor(Math.random() * 5) + 1,
      hops: Math.floor(Math.random() * 3) + 1,
      metadata: {
        correlationId: `corr-${Math.floor(Math.random() * 10000) + 1000}`,
        sessionId: `sess-${Math.floor(Math.random() * 1000) + 100}`,
        traceId: `trace-${Math.floor(Math.random() * 100000) + 10000}`
      }
    }));
  }, []);

  const generateDeployments = useCallback(() => {
    const deploymentTypes = ['new-deployment', 'update', 'rollback', 'scaling', 'migration', 'configuration'];
    const statuses = ['deploying', 'deployed', 'failed', 'rolled-back', 'pending', 'cancelled'];
    const environments = ['production', 'staging', 'development', 'testing'];
    
    return Array.from({ length: 12 }, (_, index) => ({
      id: `deploy-${index + 1}`,
      type: deploymentTypes[Math.floor(Math.random() * deploymentTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      environment: environments[Math.floor(Math.random() * environments.length)],
      agentId: `agent-${Math.floor(Math.random() * 20) + 1}`,
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      previousVersion: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      startedAt: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString(),
      completedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
      duration: (Math.random() * 1800 + 300).toFixed(0) + 's',
      progress: Math.floor(Math.random() * 100),
      deployedBy: ['DevOps Team', 'System Admin', 'Automated Deploy', 'Release Manager'][Math.floor(Math.random() * 4)],
      approvedBy: ['Technical Lead', 'Operations Manager', 'System Architect'][Math.floor(Math.random() * 3)],
      description: `${deploymentTypes[Math.floor(Math.random() * deploymentTypes.length)]} deployment for enterprise agent coordination system.`,
      changeLog: [
        'Performance improvements',
        'Bug fixes and stability updates',
        'New feature implementations',
        'Security enhancements',
        'Configuration optimizations'
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      rollbackPlan: Math.random() > 0.2,
      healthChecks: Math.floor(Math.random() * 10) + 5,
      healthStatus: ['healthy', 'warning', 'critical'][Math.floor(Math.random() * 3)],
      resourceUsage: {
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 50) + 30,
        network: Math.floor(Math.random() * 40) + 10,
        storage: Math.floor(Math.random() * 80) + 20
      },
      impactAssessment: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      testsPassed: Math.floor(Math.random() * 50) + 45,
      testsFailed: Math.floor(Math.random() * 5),
      notifications: Math.floor(Math.random() * 15) + 5,
      artifacts: Math.floor(Math.random() * 8) + 3
    }));
  }, []);

  const generatePerformanceMetrics = useCallback(() => {
    return Array.from({ length: 20 }, (_, index) => ({
      agentId: `agent-${index + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      metrics: {
        responseTime: (Math.random() * 500 + 50).toFixed(0),
        throughput: (Math.random() * 1000 + 100).toFixed(0),
        errorRate: (Math.random() * 5).toFixed(2),
        successRate: Math.floor(Math.random() * 30) + 70,
        cpuUtilization: Math.floor(Math.random() * 80) + 10,
        memoryUtilization: Math.floor(Math.random() * 70) + 20,
        networkUtilization: Math.floor(Math.random() * 60) + 5,
        diskUtilization: Math.floor(Math.random() * 50) + 10,
        queueLength: Math.floor(Math.random() * 20) + 2,
        activeConnections: Math.floor(Math.random() * 100) + 10,
        totalRequests: Math.floor(Math.random() * 10000) + 1000,
        failedRequests: Math.floor(Math.random() * 100) + 5,
        averageLatency: (Math.random() * 100 + 10).toFixed(1),
        maxLatency: (Math.random() * 500 + 100).toFixed(1),
        minLatency: (Math.random() * 50 + 5).toFixed(1)
      },
      trends: {
        responseTimeGrowth: (Math.random() * 20 - 10).toFixed(1),
        throughputGrowth: (Math.random() * 30 - 15).toFixed(1),
        errorRateChange: (Math.random() * 10 - 5).toFixed(1),
        resourceUsageChange: (Math.random() * 25 - 12.5).toFixed(1)
      },
      alerts: Math.floor(Math.random() * 5),
      warnings: Math.floor(Math.random() * 8) + 2,
      healthScore: Math.floor(Math.random() * 30) + 70,
      efficiency: Math.floor(Math.random() * 25) + 75,
      reliability: Math.floor(Math.random() * 20) + 80,
      availability: Math.floor(Math.random() * 15) + 85
    }));
  }, []);

  const generateWorkloads = useCallback(() => {
    return Array.from({ length: 20 }, (_, index) => ({
      agentId: `agent-${index + 1}`,
      currentLoad: Math.floor(Math.random() * 100),
      maxCapacity: Math.floor(Math.random() * 200) + 100,
      utilizationRate: Math.floor(Math.random() * 80) + 20,
      queuedTasks: Math.floor(Math.random() * 25) + 5,
      activeTasks: Math.floor(Math.random() * 15) + 2,
      completedTasks: Math.floor(Math.random() * 500) + 100,
      failedTasks: Math.floor(Math.random() * 20) + 2,
      averageTaskDuration: (Math.random() * 300 + 60).toFixed(0),
      peakLoad: Math.floor(Math.random() * 120) + 80,
      minLoad: Math.floor(Math.random() * 20) + 5,
      loadTrend: (Math.random() * 20 - 10).toFixed(1),
      predictedLoad: Math.floor(Math.random() * 100) + 50,
      recommendedCapacity: Math.floor(Math.random() * 150) + 120,
      balancingScore: Math.floor(Math.random() * 30) + 70,
      distributionEfficiency: Math.floor(Math.random() * 25) + 75,
      overloadRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      scalingRecommendation: ['scale-up', 'scale-down', 'maintain'][Math.floor(Math.random() * 3)],
      workloadTypes: {
        analytics: Math.floor(Math.random() * 30) + 10,
        processing: Math.floor(Math.random() * 25) + 15,
        communication: Math.floor(Math.random() * 20) + 5,
        monitoring: Math.floor(Math.random() * 15) + 5,
        automation: Math.floor(Math.random() * 10) + 5
      }
    }));
  }, []);

  const generateNetworks = useCallback(() => {
    return Array.from({ length: 15 }, (_, index) => ({
      id: `network-${index + 1}`,
      name: `Agent Network Cluster ${index + 1}`,
      nodes: Math.floor(Math.random() * 8) + 3,
      connections: Math.floor(Math.random() * 20) + 10,
      totalBandwidth: (Math.random() * 1000 + 500).toFixed(0) + 'Mbps',
      utilizedBandwidth: (Math.random() * 500 + 100).toFixed(0) + 'Mbps',
      latency: (Math.random() * 50 + 5).toFixed(1) + 'ms',
      packetLoss: (Math.random() * 2).toFixed(2) + '%',
      jitter: (Math.random() * 10 + 1).toFixed(1) + 'ms',
      reliability: Math.floor(Math.random() * 20) + 80,
      redundancy: ['single', 'dual', 'multiple'][Math.floor(Math.random() * 3)],
      topology: ['star', 'mesh', 'ring', 'hierarchical'][Math.floor(Math.random() * 4)],
      protocol: ['tcp', 'udp', 'http', 'websocket'][Math.floor(Math.random() * 4)],
      security: ['tls', 'vpn', 'encryption'][Math.floor(Math.random() * 3)],
      status: ['active', 'degraded', 'maintenance'][Math.floor(Math.random() * 3)],
      throughput: (Math.random() * 10000 + 1000).toFixed(0) + 'req/s',
      errorRate: (Math.random() * 3).toFixed(2) + '%',
      congestion: Math.floor(Math.random() * 60) + 10,
      qosLevel: ['premium', 'standard', 'basic'][Math.floor(Math.random() * 3)],
      loadBalancing: Math.random() > 0.3,
      failover: Math.random() > 0.2,
      monitoring: Math.random() > 0.1
    }));
  }, []);

  // Data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API calls with realistic delays
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setAgents(generateAgents());
        setTasks(generateTasks());
        setCommunications(generateCommunications());
        setDeployments(generateDeployments());
        setPerformance(generatePerformanceMetrics());
        setWorkloads(generateWorkloads());
        setNetworks(generateNetworks());
        
      } catch (error) {
        console.error('Error loading coordination data:', error);
        setError('Failed to load coordination data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [generateAgents, generateTasks, generateCommunications, generateDeployments, generatePerformanceMetrics, generateWorkloads, generateNetworks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAgents(generateAgents());
    setTasks(generateTasks());
    setCommunications(generateCommunications());
    setDeployments(generateDeployments());
    setPerformance(generatePerformanceMetrics());
    setWorkloads(generateWorkloads());
    setNetworks(generateNetworks());
    
    setRefreshing(false);
  };

  // Filter and search logic
  const filteredAgents = agents.filter(agent => {
    const matchesFilters = 
      (coordinationFilters.status === 'all' || agent.status === coordinationFilters.status) &&
      (coordinationFilters.type === 'all' || agent.type === coordinationFilters.type) &&
      (coordinationFilters.priority === 'all' || agent.priority === coordinationFilters.priority) &&
      (coordinationFilters.department === 'all' || agent.department === coordinationFilters.department) &&
      (coordinationFilters.performance === 'all' || agent.performance === coordinationFilters.performance) &&
      (coordinationFilters.availability === 'all' || 
        (coordinationFilters.availability === 'high' && agent.availability >= 90) ||
        (coordinationFilters.availability === 'medium' && agent.availability >= 70 && agent.availability < 90) ||
        (coordinationFilters.availability === 'low' && agent.availability < 70));
    
    const matchesSearch = !searchQuery || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilters && matchesSearch;
  });

  const sortData = (data) => {
    return data.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'performance':
          const perfOrder = { 'excellent': 4, 'good': 3, 'average': 2, 'poor': 1 };
          aValue = perfOrder[a.performance] || 0;
          bValue = perfOrder[b.performance] || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'uptime':
          aValue = a.uptime || 0;
          bValue = b.uptime || 0;
          break;
        case 'tasks':
          aValue = a.tasksCompleted || 0;
          bValue = b.tasksCompleted || 0;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
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

  const sortedAgents = sortData([...filteredAgents]);

  const getStatusColor = (status) => {
    const colors = {
      active: '#28a745',
      idle: '#17a2b8',
      busy: '#ffc107',
      maintenance: '#fd7e14',
      offline: '#6c757d',
      error: '#dc3545',
      assigned: '#17a2b8',
      'in-progress': '#ffc107',
      completed: '#28a745',
      failed: '#dc3545',
      paused: '#fd7e14',
      queued: '#6c757d',
      deploying: '#17a2b8',
      deployed: '#28a745',
      'rolled-back': '#fd7e14',
      pending: '#6c757d',
      cancelled: '#dc3545'
    };
    return colors[status] || '#666';
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      excellent: '#28a745',
      good: '#17a2b8',
      average: '#ffc107',
      poor: '#dc3545'
    };
    return colors[performance] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#dc3545',
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      normal: '#17a2b8',
      low: '#28a745'
    };
    return colors[priority] || '#666';
  };

  const renderOverviewView = () => (
    <div className="overview-content">
      <div className="coordination-overview">
        <div className="overview-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-robot"></i>
            </div>
            <div className="metric-content">
              <h3>{agents.length}</h3>
              <p>Active Agents</p>
              <span className="metric-detail">
                {agents.filter(a => a.status === 'active').length} online
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="metric-content">
              <h3>{tasks.length}</h3>
              <p>Coordinated Tasks</p>
              <span className="metric-detail">
                {tasks.filter(t => t.status === 'in-progress').length} active
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-comments"></i>
            </div>
            <div className="metric-content">
              <h3>{communications.length}</h3>
              <p>Communications</p>
              <span className="metric-detail">
                {communications.filter(c => c.status === 'delivered').length} successful
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-network-wired"></i>
            </div>
            <div className="metric-content">
              <h3>{networks.length}</h3>
              <p>Network Clusters</p>
              <span className="metric-detail">
                {networks.filter(n => n.status === 'active').length} healthy
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="coordination-status">
        <div className="status-section">
          <h3>Agent Status Distribution</h3>
          <div className="status-chart">
            <div className="status-bars">
              {['active', 'idle', 'busy', 'maintenance', 'offline'].map(status => {
                const count = agents.filter(a => a.status === status).length;
                const percentage = agents.length > 0 ? (count / agents.length) * 100 : 0;
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
          <h3>Performance Overview</h3>
          <div className="performance-chart">
            <div className="performance-metrics">
              <div className="perf-metric">
                <span className="perf-label">Avg Response Time:</span>
                <span className="perf-value">
                  {(agents.reduce((sum, a) => sum + parseInt(a.responseTime), 0) / agents.length || 0).toFixed(0)}ms
                </span>
              </div>
              <div className="perf-metric">
                <span className="perf-label">Success Rate:</span>
                <span className="perf-value">
                  {(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length || 0).toFixed(1)}%
                </span>
              </div>
              <div className="perf-metric">
                <span className="perf-label">Avg Throughput:</span>
                <span className="perf-value">
                  {(agents.reduce((sum, a) => sum + parseInt(a.throughput), 0) / agents.length || 0).toFixed(0)}/hr
                </span>
              </div>
              <div className="perf-metric">
                <span className="perf-label">System Uptime:</span>
                <span className="perf-value">
                  {(agents.reduce((sum, a) => sum + a.uptime, 0) / agents.length || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Coordination Activity</h3>
        <div className="activity-feed">
          {communications.slice(0, 8).map(comm => (
            <div key={comm.id} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-type">{comm.type}</span>
                  <span className="activity-time">{new Date(comm.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="activity-details">
                  <span className="sender">From: Agent {comm.sender.split('-')[1]}</span>
                  <span className="receiver">To: Agent {comm.receiver.split('-')[1]}</span>
                  <span className="protocol">{comm.protocol}</span>
                </div>
                <div className="activity-status">
                  <span 
                    className="status-indicator" 
                    style={{ backgroundColor: getStatusColor(comm.status) }}
                  ></span>
                  <span className="status-text">{comm.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAgentsView = () => (
    <div className="agents-content">
      <div className="agents-controls">
        <div className="search-section">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="performance">Sort by Performance</option>
              <option value="status">Sort by Status</option>
              <option value="uptime">Sort by Uptime</option>
              <option value="tasks">Sort by Tasks</option>
              <option value="name">Sort by Name</option>
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
          <select value={coordinationFilters.status} onChange={(e) => setCoordinationFilters({...coordinationFilters, status: e.target.value})}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="busy">Busy</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
          <select value={coordinationFilters.type} onChange={(e) => setCoordinationFilters({...coordinationFilters, type: e.target.value})}>
            <option value="all">All Types</option>
            <option value="analytics">Analytics</option>
            <option value="automation">Automation</option>
            <option value="communication">Communication</option>
            <option value="research">Research</option>
            <option value="optimization">Optimization</option>
          </select>
          <select value={coordinationFilters.performance} onChange={(e) => setCoordinationFilters({...coordinationFilters, performance: e.target.value})}>
            <option value="all">All Performance</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>
          <select value={coordinationFilters.availability} onChange={(e) => setCoordinationFilters({...coordinationFilters, availability: e.target.value})}>
            <option value="all">All Availability</option>
            <option value="high">High (90%+)</option>
            <option value="medium">Medium (70-90%)</option>
            <option value="low">Low (&lt;70%)</option>
          </select>
        </div>
      </div>

      <div className="agents-grid">
        {sortedAgents.map(agent => (
          <div key={agent.id} className="agent-card" onClick={() => {setSelectedAgent(agent); setAgentModal(true);}}>
            <div className="agent-header">
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <span className="agent-version">{agent.version}</span>
              </div>
              <div className="agent-badges">
                <span className="status-badge" style={{ backgroundColor: getStatusColor(agent.status) }}>
                  {agent.status}
                </span>
                <span className="performance-badge" style={{ backgroundColor: getPerformanceColor(agent.performance) }}>
                  {agent.performance}
                </span>
              </div>
            </div>

            <div className="agent-meta">
              <span className="agent-type">{agent.type}</span>
              <span className="agent-department">{agent.department}</span>
              <span className="agent-location">{agent.location}</span>
            </div>

            <div className="agent-metrics">
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">Uptime:</span>
                  <span className="metric-value">{agent.uptime}%</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${agent.uptime}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">CPU:</span>
                  <span className="metric-value">{agent.cpuUsage}%</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${agent.cpuUsage}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">Memory:</span>
                  <span className="metric-value">{agent.memoryUsage}%</span>
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: `${agent.memoryUsage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="agent-stats">
              <div className="stat-group">
                <div className="stat">
                  <span className="stat-value">{agent.tasksCompleted}</span>
                  <span className="stat-label">completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{agent.tasksActive}</span>
                  <span className="stat-label">active</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{agent.successRate}%</span>
                  <span className="stat-label">success</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{agent.responseTime}</span>
                  <span className="stat-label">response</span>
                </div>
              </div>
            </div>

            <div className="agent-footer">
              <div className="agent-activity">
                <i className="fas fa-clock"></i>
                <span>Last active: {new Date(agent.lastActivity).toLocaleTimeString()}</span>
              </div>
              <div className="agent-health">
                <i className="fas fa-heart"></i>
                <span>Health: {agent.healthScore}%</span>
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
      case 'agents':
        return renderAgentsView();
      case 'deployments':
        return <AgentDeploymentMatrix />;
      case 'communications':
        return <InterAgentCommunication />;
      case 'tasks':
        return <TaskDelegationTracking />;
      case 'performance':
        return <AgentPerformanceScoreboard />;
      case 'workloads':
        return <AgentWorkloadDistribution />;
      case 'networks':
        return <AgentCommunicationNetwork />;
      case 'controls':
        return <AgentCoordinationControls />;
      default:
        return renderOverviewView();
    }
  };

  if (loading) {
    return (
      <div className="coordination-dashboard loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading coordination dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coordination-dashboard error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="coordination-dashboard">
      <div className="coordination-header">
        <div className="header-left">
          <h1>Agent Coordination Center</h1>
          <p>Comprehensive agent management with real-time coordination and monitoring</p>
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
          <button className="deploy-agent-btn">
            <i className="fas fa-plus"></i>
            Deploy Agent
          </button>
        </div>
      </div>

      <div className="coordination-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            Overview
          </button>
          <button 
            className={`nav-tab ${activeView === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveView('agents')}
          >
            <i className="fas fa-robot"></i>
            Agents
            <span className="count">{agents.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'deployments' ? 'active' : ''}`}
            onClick={() => setActiveView('deployments')}
          >
            <i className="fas fa-server"></i>
            Deployments
            <span className="count">{deployments.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'communications' ? 'active' : ''}`}
            onClick={() => setActiveView('communications')}
          >
            <i className="fas fa-comments"></i>
            Communications
            <span className="count">{communications.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <i className="fas fa-share-alt"></i>
            Task Delegation
            <span className="count">{tasks.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveView('performance')}
          >
            <i className="fas fa-trophy"></i>
            Performance
            <span className="count">{agents.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'workloads' ? 'active' : ''}`}
            onClick={() => setActiveView('workloads')}
          >
            <i className="fas fa-tasks"></i>
            Workloads
            <span className="count">{workloads.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'networks' ? 'active' : ''}`}
            onClick={() => setActiveView('networks')}
          >
            <i className="fas fa-network-wired"></i>
            Networks
            <span className="count">{networks.length}</span>
          </button>
          <button 
            className={`nav-tab ${activeView === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveView('controls')}
          >
            <i className="fas fa-sliders-h"></i>
            Controls
            <span className="count">Active</span>
          </button>
        </div>
      </div>

      <div className="coordination-main">
        {renderContent()}
      </div>

      {/* Modals would be rendered here */}
      {agentModal && selectedAgent && (
        <div className="modal-overlay" onClick={() => setAgentModal(false)}>
          <div className="agent-modal" onClick={(e) => e.stopPropagation()}>
            {/* Detailed agent modal content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinationDashboard;
