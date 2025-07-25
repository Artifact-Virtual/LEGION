import React, { useState, useEffect, useCallback } from 'react';
import './AgentCoordinationControls.css';

const AgentCoordinationControls = () => {
  const [activeView, setActiveView] = useState('controls');
  const [controlPanels, setControlPanels] = useState([]);
  const [overrideRules, setOverrideRules] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [emergencyControls, setEmergencyControls] = useState({});
  const [coordinationSettings, setCoordinationSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [controlModal, setControlModal] = useState(false);
  const [overrideModal, setOverrideModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [bulkActions, setBulkActions] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);

  // Mock data generators
  const generateControlPanels = useCallback(() => {
    const controlTypes = ['agent-management', 'task-coordination', 'resource-allocation', 'performance-tuning', 'emergency-response'];
    const scopes = ['global', 'department', 'cluster', 'individual'];
    const priorities = ['critical', 'high', 'normal', 'low'];
    
    return Array.from({ length: 12 }, (_, index) => ({
      id: `control-${index + 1}`,
      name: `Control Panel ${index + 1}`,
      type: controlTypes[Math.floor(Math.random() * controlTypes.length)],
      scope: scopes[Math.floor(Math.random() * scopes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: ['active', 'inactive', 'pending', 'error'][Math.floor(Math.random() * 4)],
      targetAgents: Math.floor(Math.random() * 15) + 1,
      affectedSystems: Math.floor(Math.random() * 8) + 2,
      lastExecuted: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      executionCount: Math.floor(Math.random() * 100) + 10,
      successRate: (Math.random() * 20 + 80).toFixed(1),
      averageExecutionTime: (Math.random() * 5000 + 500).toFixed(0),
      permissions: ['read', 'write', 'execute', 'override'].slice(0, Math.floor(Math.random() * 3) + 1),
      automationLevel: ['manual', 'semi-automatic', 'automatic'][Math.floor(Math.random() * 3)],
      description: `Coordination control for ${controlTypes[Math.floor(Math.random() * controlTypes.length)]} operations`,
      controls: {
        start: Math.random() > 0.3,
        stop: Math.random() > 0.2,
        pause: Math.random() > 0.4,
        restart: Math.random() > 0.3,
        configure: Math.random() > 0.1,
        monitor: Math.random() > 0.05
      },
      thresholds: {
        cpuLimit: Math.floor(Math.random() * 40) + 60,
        memoryLimit: Math.floor(Math.random() * 30) + 70,
        responseTimeLimit: Math.floor(Math.random() * 1000) + 500,
        errorRateLimit: Math.floor(Math.random() * 5) + 1
      },
      notifications: {
        onSuccess: Math.random() > 0.3,
        onFailure: Math.random() > 0.1,
        onThreshold: Math.random() > 0.2,
        onEmergency: Math.random() > 0.05
      }
    }));
  }, []);

  const generateOverrideRules = useCallback(() => {
    const ruleTypes = ['performance-override', 'resource-limit', 'task-priority', 'emergency-action', 'load-balancing'];
    const conditions = ['cpu-threshold', 'memory-limit', 'response-time', 'error-rate', 'queue-length'];
    const actions = ['throttle', 'redirect', 'restart', 'scale-up', 'alert', 'shutdown'];
    
    return Array.from({ length: 18 }, (_, index) => ({
      id: `override-${index + 1}`,
      name: `Override Rule ${index + 1}`,
      type: ruleTypes[Math.floor(Math.random() * ruleTypes.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      priority: Math.floor(Math.random() * 100) + 1,
      status: ['active', 'inactive', 'triggered', 'disabled'][Math.floor(Math.random() * 4)],
      scope: ['global', 'department', 'cluster', 'agent'][Math.floor(Math.random() * 4)],
      targetAgents: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `agent-${Math.floor(Math.random() * 20) + 1}`),
      createdBy: ['System Admin', 'Operations Manager', 'Senior Engineer', 'Automation System'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(), // 30 days
      lastTriggered: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      triggerCount: Math.floor(Math.random() * 50),
      successCount: Math.floor(Math.random() * 45),
      failureCount: Math.floor(Math.random() * 5),
      description: `Automatic override rule for ${ruleTypes[Math.floor(Math.random() * ruleTypes.length)]} management`,
      conditions: {
        threshold: Math.floor(Math.random() * 50) + 50,
        duration: Math.floor(Math.random() * 300) + 60, // seconds
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]
      },
      actions: {
        immediate: actions.slice(0, Math.floor(Math.random() * 2) + 1),
        delayed: actions.slice(2, Math.floor(Math.random() * 2) + 3),
        escalation: actions.slice(4)
      },
      rollback: {
        enabled: Math.random() > 0.2,
        timeout: Math.floor(Math.random() * 3600) + 300, // seconds
        conditions: ['manual', 'automatic', 'time-based'][Math.floor(Math.random() * 3)]
      },
      impact: {
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        affectedSystems: Math.floor(Math.random() * 10) + 1,
        estimatedDowntime: Math.floor(Math.random() * 600) + 30 // seconds
      }
    }));
  }, []);

  const generateAutomationRules = useCallback(() => {
    const triggers = ['schedule', 'event', 'threshold', 'manual', 'cascade'];
    const frequencies = ['continuous', 'hourly', 'daily', 'weekly', 'on-demand'];
    
    return Array.from({ length: 15 }, (_, index) => ({
      id: `automation-${index + 1}`,
      name: `Automation Rule ${index + 1}`,
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      status: ['enabled', 'disabled', 'paused', 'error'][Math.floor(Math.random() * 4)],
      nextExecution: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      lastExecution: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      executionCount: Math.floor(Math.random() * 500) + 50,
      successRate: (Math.random() * 20 + 80).toFixed(1),
      averageDuration: (Math.random() * 30000 + 5000).toFixed(0), // milliseconds
      targetScope: ['global', 'department', 'cluster', 'specific'][Math.floor(Math.random() * 4)],
      conditions: {
        timeWindow: Math.floor(Math.random() * 3600) + 300,
        retryAttempts: Math.floor(Math.random() * 5) + 1,
        timeout: Math.floor(Math.random() * 1800) + 300
      },
      actions: [
        'agent-restart',
        'load-balance',
        'scale-resources',
        'update-configuration',
        'send-notification',
        'generate-report'
      ].slice(0, Math.floor(Math.random() * 4) + 2),
      dependencies: Array.from({ length: Math.floor(Math.random() * 3) }, () => `automation-${Math.floor(Math.random() * 15) + 1}`),
      notifications: {
        onStart: Math.random() > 0.4,
        onComplete: Math.random() > 0.3,
        onError: Math.random() > 0.1
      }
    }));
  }, []);

  const generateEmergencyControls = useCallback(() => {
    return {
      status: 'ready',
      lastActivation: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      activationCount: Math.floor(Math.random() * 10),
      responseTime: (Math.random() * 5000 + 1000).toFixed(0), // milliseconds
      procedures: [
        {
          id: 'emergency-shutdown',
          name: 'Emergency Shutdown',
          description: 'Immediate shutdown of all non-critical agents',
          estimatedTime: '30 seconds',
          riskLevel: 'high',
          enabled: true,
          lastUsed: new Date(Date.now() - Math.random() * 5184000000).toISOString()
        },
        {
          id: 'failsafe-mode',
          name: 'Failsafe Mode',
          description: 'Switch all agents to minimal operation mode',
          estimatedTime: '60 seconds',
          riskLevel: 'medium',
          enabled: true,
          lastUsed: new Date(Date.now() - Math.random() * 2592000000).toISOString()
        },
        {
          id: 'load-shed',
          name: 'Load Shedding',
          description: 'Reduce system load by disabling non-essential processes',
          estimatedTime: '15 seconds',
          riskLevel: 'low',
          enabled: true,
          lastUsed: new Date(Date.now() - Math.random() * 1296000000).toISOString()
        },
        {
          id: 'resource-isolation',
          name: 'Resource Isolation',
          description: 'Isolate problematic agents from the network',
          estimatedTime: '45 seconds',
          riskLevel: 'medium',
          enabled: true,
          lastUsed: null
        }
      ],
      contacts: [
        { role: 'System Administrator', name: 'John Smith', phone: '+1-555-0101', email: 'admin@enterprise.com' },
        { role: 'Operations Manager', name: 'Sarah Johnson', phone: '+1-555-0102', email: 'ops@enterprise.com' },
        { role: 'Technical Lead', name: 'Mike Chen', phone: '+1-555-0103', email: 'tech@enterprise.com' }
      ]
    };
  }, []);

  const generateCoordinationSettings = useCallback(() => {
    return {
      globalSettings: {
        maxConcurrentOperations: Math.floor(Math.random() * 50) + 20,
        defaultTimeout: Math.floor(Math.random() * 1800) + 300, // seconds
        retryAttempts: Math.floor(Math.random() * 5) + 2,
        emergencyThreshold: Math.floor(Math.random() * 20) + 80, // percentage
        loggingLevel: ['debug', 'info', 'warn', 'error'][Math.floor(Math.random() * 4)],
        metricsRetention: Math.floor(Math.random() * 60) + 30 // days
      },
      coordinationPolicies: {
        loadBalancing: ['round-robin', 'least-connections', 'weighted', 'resource-based'][Math.floor(Math.random() * 4)],
        failoverStrategy: ['immediate', 'graceful', 'manual'][Math.floor(Math.random() * 3)],
        scalingPolicy: ['reactive', 'predictive', 'scheduled'][Math.floor(Math.random() * 3)],
        priorityHandling: ['strict', 'weighted', 'adaptive'][Math.floor(Math.random() * 3)]
      },
      resourceLimits: {
        cpuThreshold: Math.floor(Math.random() * 30) + 70,
        memoryThreshold: Math.floor(Math.random() * 25) + 75,
        networkThreshold: Math.floor(Math.random() * 40) + 60,
        diskThreshold: Math.floor(Math.random() * 20) + 80
      },
      alerting: {
        emailNotifications: Math.random() > 0.3,
        smsNotifications: Math.random() > 0.7,
        slackIntegration: Math.random() > 0.4,
        webhookEndpoints: Math.floor(Math.random() * 5) + 1
      }
    };
  }, []);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setControlPanels(generateControlPanels());
        setOverrideRules(generateOverrideRules());
        setAutomationRules(generateAutomationRules());
        setEmergencyControls(generateEmergencyControls());
        setCoordinationSettings(generateCoordinationSettings());
        setError(null);
      } catch (err) {
        setError('Failed to load coordination controls');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [generateControlPanels, generateOverrideRules, generateAutomationRules, generateEmergencyControls, generateCoordinationSettings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setControlPanels(generateControlPanels());
      setOverrideRules(generateOverrideRules());
      setAutomationRules(generateAutomationRules());
      setEmergencyControls(generateEmergencyControls());
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEmergencyAction = (procedureId) => {
    setConfirmAction({
      type: 'emergency',
      procedure: emergencyControls.procedures.find(p => p.id === procedureId),
      message: 'This will trigger an emergency procedure. Are you sure you want to continue?'
    });
  };

  const handleControlAction = (controlId, action) => {
    const control = controlPanels.find(c => c.id === controlId);
    setConfirmAction({
      type: 'control',
      control,
      action,
      message: `This will ${action} the control panel "${control.name}". Continue?`
    });
  };

  const executeAction = () => {
    // Simulate action execution
    setTimeout(() => {
      setConfirmAction(null);
      // Update status or trigger refresh
      if (confirmAction.type === 'emergency') {
        setEmergencyMode(true);
        setTimeout(() => setEmergencyMode(false), 10000);
      }
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'enabled': case 'ready': return '#28a745';
      case 'inactive': case 'disabled': case 'paused': return '#6c757d';
      case 'pending': return '#ffc107';
      case 'error': case 'triggered': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'normal': case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const renderControlsView = () => (
    <div className="controls-content">
      <div className="controls-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-sliders-h"></i>
            </div>
            <div className="stat-content">
              <h3>{controlPanels.length}</h3>
              <p>Control Panels</p>
              <span className="stat-detail">
                {controlPanels.filter(c => c.status === 'active').length} active
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-cogs"></i>
            </div>
            <div className="stat-content">
              <h3>{automationRules.filter(r => r.status === 'enabled').length}</h3>
              <p>Active Automations</p>
              <span className="stat-detail">
                {automationRules.length} total rules
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{overrideRules.filter(r => r.status === 'active').length}</h3>
              <p>Override Rules</p>
              <span className="stat-detail">
                {overrideRules.filter(r => r.status === 'triggered').length} triggered
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>{emergencyControls.status}</h3>
              <p>Emergency Status</p>
              <span className="stat-detail">
                {emergencyControls.activationCount} total activations
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="control-panels">
        <div className="section-header">
          <h3>Control Panels</h3>
          <div className="section-actions">
            <button className="create-btn">
              <i className="fas fa-plus"></i>
              Create Panel
            </button>
          </div>
        </div>

        <div className="panels-grid">
          {controlPanels.map(panel => (
            <div key={panel.id} className="control-panel-card">
              <div className="panel-header">
                <div className="panel-info">
                  <h4>{panel.name}</h4>
                  <span className="panel-type">{panel.type}</span>
                </div>
                <div className="panel-status">
                  <span 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(panel.status) }}
                  ></span>
                  <span className="status-text">{panel.status}</span>
                </div>
              </div>

              <div className="panel-details">
                <div className="detail-row">
                  <span className="label">Scope:</span>
                  <span className="value">{panel.scope}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Target Agents:</span>
                  <span className="value">{panel.targetAgents}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Success Rate:</span>
                  <span className="value">{panel.successRate}%</span>
                </div>
                <div className="detail-row">
                  <span className="label">Automation:</span>
                  <span className="value">{panel.automationLevel}</span>
                </div>
              </div>

              <div className="panel-controls">
                {Object.entries(panel.controls).map(([control, enabled]) => 
                  enabled && (
                    <button 
                      key={control}
                      className={`control-btn ${control}`}
                      onClick={() => handleControlAction(panel.id, control)}
                    >
                      <i className={`fas fa-${
                        control === 'start' ? 'play' :
                        control === 'stop' ? 'stop' :
                        control === 'pause' ? 'pause' :
                        control === 'restart' ? 'redo' :
                        control === 'configure' ? 'cog' : 'eye'
                      }`}></i>
                      {control}
                    </button>
                  )
                )}
              </div>

              <div className="panel-metrics">
                <div className="metric-item">
                  <span className="metric-label">Executions:</span>
                  <span className="metric-value">{panel.executionCount}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Time:</span>
                  <span className="metric-value">{panel.averageExecutionTime}ms</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Last Run:</span>
                  <span className="metric-value">
                    {new Date(panel.lastExecuted).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOverridesView = () => (
    <div className="overrides-content">
      <div className="overrides-header">
        <h3>Override Rules & Policies</h3>
        <div className="header-actions">
          <button className="create-btn">
            <i className="fas fa-plus"></i>
            Create Rule
          </button>
          <button className="import-btn">
            <i className="fas fa-upload"></i>
            Import Rules
          </button>
        </div>
      </div>

      <div className="overrides-table">
        <div className="table-header">
          <div className="header-cell">Rule Name</div>
          <div className="header-cell">Type</div>
          <div className="header-cell">Condition</div>
          <div className="header-cell">Action</div>
          <div className="header-cell">Priority</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Triggers</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {overrideRules.map(rule => (
            <div key={rule.id} className="table-row">
              <div className="table-cell">
                <div className="rule-info">
                  <strong>{rule.name}</strong>
                  <small>{rule.scope}</small>
                </div>
              </div>

              <div className="table-cell">
                <span className="rule-type">{rule.type}</span>
              </div>

              <div className="table-cell">
                <span className="condition">{rule.condition}</span>
                <small className="threshold">Threshold: {rule.conditions.threshold}</small>
              </div>

              <div className="table-cell">
                <span className="action">{rule.action}</span>
              </div>

              <div className="table-cell">
                <span className="priority-badge" style={{backgroundColor: getPriorityColor(rule.conditions.severity)}}>
                  {rule.priority}
                </span>
              </div>

              <div className="table-cell">
                <span className={`status-badge ${rule.status}`} style={{backgroundColor: getStatusColor(rule.status)}}>
                  {rule.status}
                </span>
              </div>

              <div className="table-cell">
                <div className="trigger-stats">
                  <span className="trigger-count">{rule.triggerCount} total</span>
                  <span className="success-rate">{((rule.successCount / Math.max(rule.triggerCount, 1)) * 100).toFixed(1)}% success</span>
                </div>
              </div>

              <div className="table-cell">
                <div className="action-buttons">
                  <button className="action-btn edit" onClick={() => {setSelectedRule(rule); setOverrideModal(true);}}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="action-btn toggle">
                    <i className={`fas fa-${rule.status === 'active' ? 'pause' : 'play'}`}></i>
                  </button>
                  <button className="action-btn delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergencyView = () => (
    <div className="emergency-content">
      <div className="emergency-header">
        <div className="emergency-status">
          <div className={`emergency-indicator ${emergencyMode ? 'active' : 'ready'}`}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>Emergency Status: {emergencyMode ? 'ACTIVE' : 'READY'}</span>
          </div>
          <div className="emergency-info">
            <span>Last Activation: {new Date(emergencyControls.lastActivation).toLocaleString()}</span>
            <span>Response Time: {emergencyControls.responseTime}ms</span>
          </div>
        </div>
      </div>

      <div className="emergency-procedures">
        <h3>Emergency Procedures</h3>
        <div className="procedures-grid">
          {emergencyControls.procedures.map(procedure => (
            <div key={procedure.id} className="emergency-procedure">
              <div className="procedure-header">
                <h4>{procedure.name}</h4>
                <span className={`risk-level ${procedure.riskLevel}`}>
                  {procedure.riskLevel} risk
                </span>
              </div>

              <div className="procedure-details">
                <p>{procedure.description}</p>
                <div className="procedure-meta">
                  <span><i className="fas fa-clock"></i> {procedure.estimatedTime}</span>
                  <span><i className="fas fa-history"></i> 
                    {procedure.lastUsed ? 
                      `Last used: ${new Date(procedure.lastUsed).toLocaleDateString()}` : 
                      'Never used'
                    }
                  </span>
                </div>
              </div>

              <div className="procedure-actions">
                <button 
                  className={`emergency-btn ${procedure.riskLevel}`}
                  onClick={() => handleEmergencyAction(procedure.id)}
                  disabled={!procedure.enabled || emergencyMode}
                >
                  <i className="fas fa-bolt"></i>
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        <div className="contacts-list">
          {emergencyControls.contacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.role}</p>
              </div>
              <div className="contact-methods">
                <a href={`tel:${contact.phone}`} className="contact-btn phone">
                  <i className="fas fa-phone"></i>
                  {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`} className="contact-btn email">
                  <i className="fas fa-envelope"></i>
                  {contact.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="settings-content">
      <div className="settings-sections">
        <div className="settings-section">
          <h3>Global Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Max Concurrent Operations</label>
              <input 
                type="number" 
                value={coordinationSettings.globalSettings?.maxConcurrentOperations || 0}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  globalSettings: {
                    ...coordinationSettings.globalSettings,
                    maxConcurrentOperations: parseInt(e.target.value)
                  }
                })}
              />
            </div>

            <div className="setting-item">
              <label>Default Timeout (seconds)</label>
              <input 
                type="number" 
                value={coordinationSettings.globalSettings?.defaultTimeout || 0}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  globalSettings: {
                    ...coordinationSettings.globalSettings,
                    defaultTimeout: parseInt(e.target.value)
                  }
                })}
              />
            </div>

            <div className="setting-item">
              <label>Retry Attempts</label>
              <input 
                type="number" 
                value={coordinationSettings.globalSettings?.retryAttempts || 0}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  globalSettings: {
                    ...coordinationSettings.globalSettings,
                    retryAttempts: parseInt(e.target.value)
                  }
                })}
              />
            </div>

            <div className="setting-item">
              <label>Logging Level</label>
              <select 
                value={coordinationSettings.globalSettings?.loggingLevel || 'info'}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  globalSettings: {
                    ...coordinationSettings.globalSettings,
                    loggingLevel: e.target.value
                  }
                })}
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Coordination Policies</h3>
          <div className="policies-grid">
            <div className="policy-item">
              <label>Load Balancing Strategy</label>
              <select 
                value={coordinationSettings.coordinationPolicies?.loadBalancing || 'round-robin'}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  coordinationPolicies: {
                    ...coordinationSettings.coordinationPolicies,
                    loadBalancing: e.target.value
                  }
                })}
              >
                <option value="round-robin">Round Robin</option>
                <option value="least-connections">Least Connections</option>
                <option value="weighted">Weighted</option>
                <option value="resource-based">Resource Based</option>
              </select>
            </div>

            <div className="policy-item">
              <label>Failover Strategy</label>
              <select 
                value={coordinationSettings.coordinationPolicies?.failoverStrategy || 'graceful'}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  coordinationPolicies: {
                    ...coordinationSettings.coordinationPolicies,
                    failoverStrategy: e.target.value
                  }
                })}
              >
                <option value="immediate">Immediate</option>
                <option value="graceful">Graceful</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="policy-item">
              <label>Scaling Policy</label>
              <select 
                value={coordinationSettings.coordinationPolicies?.scalingPolicy || 'reactive'}
                onChange={(e) => setCoordinationSettings({
                  ...coordinationSettings,
                  coordinationPolicies: {
                    ...coordinationSettings.coordinationPolicies,
                    scalingPolicy: e.target.value
                  }
                })}
              >
                <option value="reactive">Reactive</option>
                <option value="predictive">Predictive</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Resource Thresholds</h3>
          <div className="thresholds-grid">
            {Object.entries(coordinationSettings.resourceLimits || {}).map(([resource, threshold]) => (
              <div key={resource} className="threshold-item">
                <label>{resource.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <div className="threshold-control">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={threshold}
                    onChange={(e) => setCoordinationSettings({
                      ...coordinationSettings,
                      resourceLimits: {
                        ...coordinationSettings.resourceLimits,
                        [resource]: parseInt(e.target.value)
                      }
                    })}
                  />
                  <span className="threshold-value">{threshold}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Alerting Configuration</h3>
          <div className="alerting-grid">
            {Object.entries(coordinationSettings.alerting || {}).map(([setting, value]) => (
              <div key={setting} className="alerting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={typeof value === 'boolean' ? value : false}
                    onChange={(e) => setCoordinationSettings({
                      ...coordinationSettings,
                      alerting: {
                        ...coordinationSettings.alerting,
                        [setting]: e.target.checked
                      }
                    })}
                  />
                  {setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn">
          <i className="fas fa-save"></i>
          Save Settings
        </button>
        <button className="reset-btn">
          <i className="fas fa-undo"></i>
          Reset to Defaults
        </button>
        <button className="export-btn">
          <i className="fas fa-download"></i>
          Export Configuration
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'controls':
        return renderControlsView();
      case 'overrides':
        return renderOverridesView();
      case 'emergency':
        return renderEmergencyView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderControlsView();
    }
  };

  if (loading) {
    return (
      <div className="agent-coordination-controls loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading coordination controls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-coordination-controls error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-coordination-controls">
      <div className="controls-header">
        <div className="header-left">
          <h2>Agent Coordination Controls</h2>
          <p>Advanced controls and overrides for enterprise agent coordination</p>
        </div>
        <button 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <i className="fas fa-sync-alt"></i>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="controls-navigation">
        <div className="nav-buttons">
          <button 
            className={`nav-button ${activeView === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveView('controls')}
          >
            <i className="fas fa-sliders-h"></i>
            Control Panels
          </button>
          <button 
            className={`nav-button ${activeView === 'overrides' ? 'active' : ''}`}
            onClick={() => setActiveView('overrides')}
          >
            <i className="fas fa-shield-alt"></i>
            Override Rules
          </button>
          <button 
            className={`nav-button ${activeView === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveView('emergency')}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Emergency
          </button>
          <button 
            className={`nav-button ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>

      <div className="controls-main">
        {renderContent()}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <div className="modal-content">
              <p>{confirmAction.message}</p>
              {confirmAction.type === 'emergency' && (
                <div className="emergency-warning">
                  <strong>WARNING:</strong> This is an emergency procedure with {confirmAction.procedure.riskLevel} risk level.
                  Estimated execution time: {confirmAction.procedure.estimatedTime}.
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={executeAction}>
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Rule Modal */}
      {overrideModal && selectedRule && (
        <div className="modal-overlay" onClick={() => setOverrideModal(false)}>
          <div className="override-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedRule.name}</h3>
              <button 
                className="close-button" 
                onClick={() => setOverrideModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="rule-details">
                <div className="detail-section">
                  <h4>Rule Configuration</h4>
                  <div className="config-grid">
                    <div className="config-item">
                      <span className="label">Type:</span>
                      <span className="value">{selectedRule.type}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Condition:</span>
                      <span className="value">{selectedRule.condition}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Action:</span>
                      <span className="value">{selectedRule.action}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Priority:</span>
                      <span className="value">{selectedRule.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Execution History</h4>
                  <div className="history-stats">
                    <div className="stat-item">
                      <span className="label">Total Triggers:</span>
                      <span className="value">{selectedRule.triggerCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Successful:</span>
                      <span className="value">{selectedRule.successCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Failed:</span>
                      <span className="value">{selectedRule.failureCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Last Triggered:</span>
                      <span className="value">
                        {selectedRule.lastTriggered ? 
                          new Date(selectedRule.lastTriggered).toLocaleString() : 
                          'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Target Agents</h4>
                  <div className="target-agents">
                    {selectedRule.targetAgents.map(agentId => (
                      <span key={agentId} className="agent-tag">
                        {agentId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCoordinationControls;
