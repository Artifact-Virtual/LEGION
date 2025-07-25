import React, { useState, useEffect } from 'react';
import './CommandDashboard.css';

// Import Phase 2 Enterprise Backend Services
import AgentStatusMonitoringService from '../services/AgentStatusMonitoringService';
import AgentPerformanceMonitoringService from '../services/AgentPerformanceMonitoringService';
import AgentTaskQueueMonitoringService from '../services/AgentTaskQueueMonitoringService';
import InterAgentMessageMonitoringService from '../services/InterAgentMessageMonitoringService';
import WorkflowTriggerStatusTrackingService from '../services/WorkflowTriggerStatusTrackingService';
import EnterpriseDatabase from '../services/EnterpriseDatabase';

// Import shared components
import SystemStatusPanel from './shared/SystemStatusPanel';
import AgentHealthMatrix from './shared/AgentHealthMatrix';
import WorkflowExecutionStatus from './shared/WorkflowExecutionStatus';
import SystemAlertsPanel from './shared/SystemAlertsPanel';
import DatabaseConnectionStatus from './shared/DatabaseConnectionStatus';
import SystemPerformanceMetrics from './shared/SystemPerformanceMetrics';
import EmergencyControls from './shared/EmergencyControls';

/**
 * COMMAND Dashboard - System Command Center
 * 
 * Primary interface for system oversight, agent coordination, and real-time monitoring.
 * Integrated with Phase 2 Enterprise Backend Services for comprehensive system visibility.
 */
const CommandDashboard = () => {
  const [systemStatus, setSystemStatus] = useState('loading');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState({});
  const [systemMetrics, setSystemMetrics] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 second default
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Enterprise service instances
  const [services, setServices] = useState({
    agentStatus: null,
    agentPerformance: null,
    taskQueue: null,
    messaging: null,
    workflowTriggers: null,
    database: null
  });

  // Initialize enterprise services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const agentStatusService = new AgentStatusMonitoringService();
        const agentPerformanceService = new AgentPerformanceMonitoringService();
        const taskQueueService = new AgentTaskQueueMonitoringService();
        const messagingService = new InterAgentMessageMonitoringService();
        const workflowService = new WorkflowTriggerStatusTrackingService();
        const databaseService = new EnterpriseDatabase();

        // Start all monitoring services
        await Promise.all([
          agentStatusService.startMonitoring(),
          agentPerformanceService.startMonitoring(),
          taskQueueService.startMonitoring(),
          messagingService.startMonitoring(),
          workflowService.startMonitoring()
        ]);

        setServices({
          agentStatus: agentStatusService,
          agentPerformance: agentPerformanceService,
          taskQueue: taskQueueService,
          messaging: messagingService,
          workflowTriggers: workflowService,
          database: databaseService
        });

        console.log('✅ All enterprise services initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize enterprise services:', error);
        setSystemStatus('error');
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      Object.values(services).forEach(service => {
        if (service && typeof service.stopMonitoring === 'function') {
          service.stopMonitoring();
        }
      });
    };
  }, []);

  // Real-time data fetching using Phase 2 backend services
  useEffect(() => {
    if (!services.agentStatus) return;

    const fetchSystemData = async () => {
      try {
        // Fetch comprehensive system status from enterprise services
        const [
          agentStatusData,
          performanceData,
          queueData,
          messagingData,
          workflowData
        ] = await Promise.all([
          services.agentStatus.getCurrentState(),
          services.agentPerformance.getCurrentState(),
          services.taskQueue.getCurrentState(),
          services.messaging.getCurrentState(),
          services.workflowTriggers.getCurrentState()
        ]);

        // Update system status based on enterprise data
        setSystemStatus(calculateSystemStatus(agentStatusData, performanceData));
        setAgentMetrics(agentStatusData);
        setSystemMetrics({
          performance: performanceData,
          queues: queueData,
          messaging: messagingData,
          workflows: workflowData
        });

        // Extract alerts from all services
        const allAlerts = [
          ...(agentStatusData.alerts || []),
          ...(performanceData.alerts || []),
          ...(queueData.alerts || []),
          ...(messagingData.alerts || []),
          ...(workflowData.alerts || [])
        ];
        setActiveAlerts(allAlerts);

      } catch (error) {
        console.error('❌ Failed to fetch enterprise system data:', error);
        setSystemStatus('error');
      }
    };

    // Initial fetch
    fetchSystemData();

    // Set up real-time updates
    const interval = setInterval(fetchSystemData, refreshInterval);
    return () => clearInterval(interval);
  }, [services, refreshInterval]);

  // Calculate system status based on enterprise data
  const calculateSystemStatus = (agentData, performanceData) => {
    if (!agentData || !performanceData) return 'loading';
    
    const agentHealth = agentData.overallHealth || 0;
    const performanceScore = performanceData.systemOverview?.averagePerformanceScore || 0;
    
    if (agentHealth > 90 && performanceScore > 90) return 'excellent';
    if (agentHealth > 80 && performanceScore > 80) return 'good';
    if (agentHealth > 70 && performanceScore > 70) return 'warning';
    return 'critical';
  };

  // Emergency mode handler
  const handleEmergencyToggle = (enabled) => {
    setIsEmergencyMode(enabled);
    if (enabled) {
      setRefreshInterval(1000); // 1 second updates in emergency mode
    } else {
      setRefreshInterval(5000); // Return to normal 5 second updates
    }
  };

  // System health calculation
  const getOverallSystemHealth = () => {
    if (systemStatus === 'loading' || systemStatus === 'error') {
      return systemStatus;
    }

    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical').length;
    const agentHealth = agentMetrics.overallHealth || 0;
    const systemPerformance = systemMetrics.overallScore || 0;

    if (criticalAlerts > 0) return 'critical';
    if (agentHealth < 70 || systemPerformance < 70) return 'warning';
    if (agentHealth > 90 && systemPerformance > 90) return 'excellent';
    return 'healthy';
  };

  return (
    <div className={`command-dashboard ${isEmergencyMode ? 'emergency-mode' : ''}`}>
      {/* Command Header */}
      <div className="command-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="title-icon">⚡</span>
            COMMAND CENTER
          </h1>
          <div className={`system-status-indicator ${getOverallSystemHealth()}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              System Status: {getOverallSystemHealth().toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="refresh-control">
            <label>Update Interval:</label>
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={isEmergencyMode}
            >
              <option value={1000}>1 second</option>
              <option value={5000}>5 seconds</option>
              <option value={10000}>10 seconds</option>
              <option value={30000}>30 seconds</option>
            </select>
          </div>
          
          <div className="last-update">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="command-grid">
        {/* Row 1: Critical Status Overview */}
        <div className="grid-row critical-overview">
          <div className="grid-section system-status">
            <SystemStatusPanel 
              status={systemStatus}
              metrics={systemMetrics}
              emergencyMode={isEmergencyMode}
            />
          </div>
          
          <div className="grid-section alerts-panel">
            <SystemAlertsPanel 
              alerts={activeAlerts}
              emergencyMode={isEmergencyMode}
              onAlertAction={(alert, action) => console.log('Alert action:', alert, action)}
            />
          </div>
          
          <div className="grid-section emergency-controls">
            <EmergencyControls 
              emergencyMode={isEmergencyMode}
              onEmergencyToggle={handleEmergencyToggle}
              systemHealth={getOverallSystemHealth()}
            />
          </div>
        </div>

        {/* Row 2: Agent & Workflow Monitoring */}
        <div className="grid-row operational-overview">
          <div className="grid-section agent-matrix">
            <AgentHealthMatrix 
              agents={agentMetrics.agents || []}
              overallHealth={agentMetrics.overallHealth}
              emergencyMode={isEmergencyMode}
            />
          </div>
          
          <div className="grid-section workflow-status">
            <WorkflowExecutionStatus 
              workflows={systemMetrics.activeWorkflows || []}
              executionHistory={systemMetrics.workflowHistory || []}
              emergencyMode={isEmergencyMode}
            />
          </div>
        </div>

        {/* Row 3: Infrastructure & Performance */}
        <div className="grid-row infrastructure-overview">
          <div className="grid-section database-status">
            <DatabaseConnectionStatus 
              connections={systemMetrics.databaseConnections || []}
              queryPerformance={systemMetrics.queryMetrics || {}}
              emergencyMode={isEmergencyMode}
            />
          </div>
          
          <div className="grid-section performance-metrics">
            <SystemPerformanceMetrics 
              metrics={systemMetrics}
              historicalData={systemMetrics.performanceHistory || []}
              emergencyMode={isEmergencyMode}
            />
          </div>
        </div>
      </div>

      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <div className="emergency-banner">
          <div className="emergency-content">
            <span className="emergency-icon">🚨</span>
            <span className="emergency-text">
              EMERGENCY MODE ACTIVE - Enhanced monitoring and controls enabled
            </span>
            <span className="emergency-icon">🚨</span>
          </div>
        </div>
      )}

      {/* Command Footer - Quick Actions */}
      <div className="command-footer">
        <div className="quick-actions">
          <button 
            className="action-btn system-restart"
            onClick={() => console.log('System restart initiated')}
            disabled={!isEmergencyMode}
          >
            🔄 System Restart
          </button>
          
          <button 
            className="action-btn agent-restart"
            onClick={() => console.log('All agents restart initiated')}
          >
            🤖 Restart All Agents
          </button>
          
          <button 
            className="action-btn database-maintenance"
            onClick={() => console.log('Database maintenance mode')}
          >
            🗄️ Database Maintenance
          </button>
          
          <button 
            className="action-btn export-logs"
            onClick={() => console.log('System logs export')}
          >
            📋 Export System Logs
          </button>
        </div>
        
        <div className="system-info">
          <span>Active Agents: {agentMetrics.activeCount || 0}/{agentMetrics.totalCount || 0}</span>
          <span>•</span>
          <span>Active Workflows: {systemMetrics.activeWorkflows?.length || 0}</span>
          <span>•</span>
          <span>System Uptime: {systemMetrics.uptime || 'Unknown'}</span>
          <span>•</span>
          <span>Memory Usage: {systemMetrics.memoryUsage || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandDashboard;
