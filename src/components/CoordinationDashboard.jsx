import React, { useState, useEffect } from 'react';
import RealTimeAPIService from '../services/RealTimeAPIService';

/**
 * COORDINATION Dashboard Component
 * Agent coordination, task distribution, and team workflows
 */
const CoordinationDashboard = () => {
  const [coordinationData, setCoordinationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchCoordinationData = async () => {
      try {
        setIsLoading(true);
        const [agentHealth, workflowStatus, systemStatus] = await Promise.allSettled([
          RealTimeAPIService.makeRequest('/api/enterprise/agent-health'),
          RealTimeAPIService.makeRequest('/api/enterprise/workflow-status'),
          RealTimeAPIService.makeRequest('/api/enterprise/system-status')
        ]);

        const data = {
          agents: agentHealth.value || null,
          workflows: workflowStatus.value || null,
          system: systemStatus.value || null
        };

        setCoordinationData(data);
        setConnectionStatus('connected');
        setLastUpdate(new Date().toISOString());
      } catch (error) {
        console.error('Failed to fetch coordination data:', error);
        setConnectionStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinationData();
    const interval = setInterval(fetchCoordinationData, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [agentHealth, workflowStatus, systemStatus] = await Promise.allSettled([
        RealTimeAPIService.makeRequest('/api/enterprise/agent-health'),
        RealTimeAPIService.makeRequest('/api/enterprise/workflow-status'),
        RealTimeAPIService.makeRequest('/api/enterprise/system-status')
      ]);

      const data = {
        agents: agentHealth.value || null,
        workflows: workflowStatus.value || null,
        system: systemStatus.value || null
      };

      setCoordinationData(data);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="theme-dashboard-container">
        <div className="theme-dashboard-content">
          <div className="theme-card theme-text-center">
            <div className="theme-loading"></div>
            <h2>Loading Coordination Dashboard...</h2>
            <p className="theme-text-secondary">Connecting to backend services...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group agents by department
  const agentsByDepartment = coordinationData?.agents?.agents?.reduce((acc, agent) => {
    const dept = agent.department || 'unknown';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(agent);
    return acc;
  }, {}) || {};

  const activeWorkflows = coordinationData?.workflows?.filter(w => w.status === 'running') || [];
  const totalAgents = coordinationData?.agents?.agents?.length || 0;
  const operationalAgents = coordinationData?.agents?.agents?.filter(a => a.status === 'operational').length || 0;

  return (
    <div className="theme-dashboard-container">
      <div className="theme-dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            🤝 Coordination Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Agent coordination, task distribution, and team workflows
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`theme-status-${connectionStatus === 'connected' ? 'operational' : 'error'}`}>
            ● {connectionStatus === 'connected' ? 'Live' : 'Offline'}
          </span>
          <button 
            onClick={handleRefresh} 
            className="theme-button-secondary"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          {lastUpdate && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Last: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="theme-dashboard-content">
        {/* Coordination Overview */}
        <div className="theme-grid theme-grid-cols-4 theme-mb-lg">
          <div className="theme-metric-card">
            <div className="theme-metric-value">
              {totalAgents}
            </div>
            <div className="theme-metric-label">Total Agents</div>
          </div>
          
          <div className="theme-metric-card">
            <div className="theme-metric-value theme-status-operational">
              {operationalAgents}
            </div>
            <div className="theme-metric-label">Active Agents</div>
          </div>
          
          <div className="theme-metric-card">
            <div className="theme-metric-value">
              {activeWorkflows.length}
            </div>
            <div className="theme-metric-label">Active Workflows</div>
          </div>
          
          <div className="theme-metric-card">
            <div className="theme-metric-value">
              {Object.keys(agentsByDepartment).length}
            </div>
            <div className="theme-metric-label">Departments</div>
          </div>
        </div>

        {/* Department Coordination */}
        <div className="theme-card theme-mb-lg">
          <h3 className="theme-mb-md">🏢 Department Coordination</h3>
          {Object.keys(agentsByDepartment).length > 0 ? (
            <div className="theme-grid theme-grid-cols-3">
              {Object.entries(agentsByDepartment).map(([department, agents]) => (
                <div key={department} className="theme-metric-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                      {department.replace(/_/g, ' ')}
                    </span>
                    <span className="theme-status-operational">
                      {agents.filter(a => a.status === 'operational').length}/{agents.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Agents: {agents.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Tasks: {agents.reduce((sum, agent) => sum + (agent.tasks_completed || 0), 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="theme-text-secondary">No department data available</div>
          )}
        </div>

        {/* Active Workflows */}
        <div className="theme-card theme-mb-lg">
          <h3 className="theme-mb-md">🔄 Active Workflows</h3>
          {activeWorkflows.length > 0 ? (
            <div className="theme-grid theme-grid-cols-2">
              {activeWorkflows.slice(0, 6).map((workflow, index) => (
                <div key={workflow.id || index} className="theme-metric-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>
                      {workflow.name || `Workflow ${index + 1}`}
                    </span>
                    <span className={`theme-status-${workflow.status === 'running' ? 'operational' : 
                      workflow.status === 'pending' ? 'warning' : 'error'}`}>
                      ● {workflow.status || 'unknown'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Progress: {workflow.progress || 0}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Source: {workflow.source || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="theme-text-secondary">No active workflows</div>
          )}
        </div>

        {/* Agent Status Grid */}
        <div className="theme-grid theme-grid-cols-2">
          <div className="theme-card">
            <h3 className="theme-mb-md">🤖 Agent Status</h3>
            {coordinationData?.agents?.agents?.length > 0 ? (
              <div className="theme-grid theme-grid-cols-2">
                {coordinationData.agents.agents.slice(0, 8).map((agent, index) => (
                  <div key={agent.id || index} className="theme-metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {agent.name || agent.id || `Agent ${index + 1}`}
                      </span>
                      <span className={`theme-status-${agent.status === 'operational' ? 'operational' : 
                        agent.status === 'warning' ? 'warning' : 'error'}`}>
                        ●
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      {agent.department || 'Unknown'} | {agent.avg_response_time || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Tasks: {agent.tasks_completed || 0} | Health: {agent.health_score || 0}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="theme-text-secondary">No agent data available</div>
            )}
          </div>

          <div className="theme-card">
            <h3 className="theme-mb-md">📊 Coordination Metrics</h3>
            <div className="theme-grid theme-grid-cols-2">
              <div className="theme-metric-card">
                <div className="theme-metric-value">
                  {coordinationData?.system?.performance?.cpu_usage || 0}%
                </div>
                <div className="theme-metric-label">System Load</div>
              </div>
              <div className="theme-metric-card">
                <div className="theme-metric-value">
                  {totalAgents > 0 ? Math.round((operationalAgents / totalAgents) * 100) : 0}%
                </div>
                <div className="theme-metric-label">Agent Uptime</div>
              </div>
              <div className="theme-metric-card">
                <div className="theme-metric-value">
                  {coordinationData?.workflows?.length || 0}
                </div>
                <div className="theme-metric-label">Total Workflows</div>
              </div>
              <div className="theme-metric-card">
                <div className="theme-metric-value">
                  {coordinationData?.agents?.agents?.reduce((sum, agent) => 
                    sum + (agent.tasks_completed || 0), 0) || 0}
                </div>
                <div className="theme-metric-label">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinationDashboard;
