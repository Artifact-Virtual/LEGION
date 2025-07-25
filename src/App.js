// src/App.js
// LEGION Enterprise Dashboard - Main Application with 7-Tab Navigation Structure

import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import LoadingState from './components/shared/LoadingState.jsx';

// Import Navigation and Layout Systems
import { NavigationManager, useRouter, BreadcrumbNavigation } from './components/routing/RouterSystem';
import { ResponsiveLayoutProvider, useLayout, Container } from './components/layout/ResponsiveLayout';
import { EnhancedBreadcrumbNavigation, ContextualNavigation, NavigationHistorySidebar } from './components/navigation/BreadcrumbSystem';
import { MobileNavigation, MobileHeader, MobileMenu } from './components/navigation/MobileNavigation';

// Import Theme System
import { ThemeProvider } from './components/theming/ThemeManager';
import { ThemeCustomizerButton } from './components/theming/ThemeCustomizer';

// Import CSS
import './App.css';
import './components/routing/RouterSystem.css';
import './components/layout/ResponsiveLayout.css';
import './components/navigation/BreadcrumbSystem.css';
import './components/navigation/MobileNavigation.css';
import './components/theming/ThemeManager.css';
import './components/theming/ThemeCustomizer.css';

// Import Dashboard Components
import CommandDashboard from './components/CommandDashboard.jsx';
import OperationsDashboard from './components/OperationsDashboard.jsx';
import IntelligenceDashboard from './components/IntelligenceDashboard.jsx';
import CoordinationDashboard from './components/CoordinationDashboard.jsx';
import ManagementDashboard from './components/ManagementDashboard.jsx';
import OptimizationDashboard from './components/OptimizationDashboard.jsx';
import ApiMonitoringDashboard from './components/ApiMonitoringDashboard.jsx';

// Tab Configuration
const DASHBOARD_TABS = [
  {
    id: 'command',
    name: 'COMMAND',
    title: 'System Command Center',
    icon: 'fas fa-terminal',
    component: CommandDashboard,
    description: 'System overview, agent health, and emergency controls',
    shortcut: '1'
  },
  {
    id: 'operations',
    name: 'OPERATIONS',
    title: 'Business Operations Center',
    icon: 'fas fa-chart-line',
    component: OperationsDashboard,
    description: 'Business objectives, revenue tracking, and department status',
    shortcut: '2'
  },
  {
    id: 'intelligence',
    name: 'INTELLIGENCE',
    title: 'Research & Analysis Center',
    icon: 'fas fa-brain',
    component: IntelligenceDashboard,
    description: 'Market analysis, competitive intelligence, and research insights',
    shortcut: '3'
  },
  {
    id: 'coordination',
    name: 'COORDINATION',
    title: 'Agent Coordination Center',
    icon: 'fas fa-network-wired',
    component: CoordinationDashboard,
    description: 'Agent deployment, communication monitoring, and coordination controls',
    shortcut: '4'
  },
  {
    id: 'management',
    name: 'MANAGEMENT',
    title: 'Workflow & Process Management',
    icon: 'fas fa-cogs',
    component: ManagementDashboard,
    description: 'Workflow orchestration, automation, and process optimization',
    shortcut: '5'
  },
  {
    id: 'optimization',
    name: 'OPTIMIZATION',
    title: 'System Optimization Center',
    icon: 'fas fa-rocket',
    component: OptimizationDashboard,
    description: 'Performance analysis, efficiency tracking, and system improvements',
    shortcut: '6'
  },
  {
    id: 'api-monitoring',
    name: 'API MONITORING',
    title: 'External API Management',
    icon: 'fas fa-plug',
    component: ApiMonitoringDashboard,
    description: 'API health monitoring, performance metrics, and integration management',
    shortcut: '7'
  }
];

const App = () => {
  return (
    <ThemeProvider>
      <ResponsiveLayoutProvider>
        <NavigationManager>
          <AppContent />
        </NavigationManager>
      </ResponsiveLayoutProvider>
    </ThemeProvider>
  );
};

const AppContent = () => {
  // Use router and layout hooks
  const router = useRouter();
  const layout = useLayout();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    connected: false,
    agentsOnline: 0,
    systemHealth: 'unknown'
  });

  // Initialize application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Check system connectivity
        const healthCheck = await fetch('/api/health', { 
          method: 'GET',
          timeout: 5000 
        }).catch(() => null);
        
        if (healthCheck?.ok) {
          const status = await healthCheck.json();
          setSystemStatus({
            connected: true,
            agentsOnline: status.agents_online || 0,
            systemHealth: status.system_health || 'good'
          });
        } else {
          setSystemStatus({
            connected: false,
            agentsOnline: 0,
            systemHealth: 'offline'
          });
        }
        
        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err);
        setSystemStatus({
          connected: false,
          agentsOnline: 0,
          systemHealth: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tabId) => {
    router.navigateToTab(tabId.toUpperCase());
  }, [router]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    layout.setSidebarCollapsed(!layout.sidebarCollapsed);
  }, [layout]);

  // Mobile menu handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Get current tab configuration
  const currentTab = DASHBOARD_TABS.find(tab => tab.id === router.currentTab.toLowerCase()) || DASHBOARD_TABS[0];
  const CurrentComponent = currentTab.component;

  // Loading state
  if (loading) {
    return (
      <div className="app-loading">
        <LoadingState
          variant="default"
          size="large"
          message="Initializing LEGION Enterprise Dashboard..."
          showProgress={false}
          animated={true}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-error">
        <ErrorBoundary
          variant="detailed"
          size="large"
          title="Application Initialization Failed"
          message="Failed to initialize the LEGION Enterprise Dashboard"
          showDetails={true}
          showRetry={true}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary
      variant="detailed"
      title="LEGION Dashboard Error"
      message="An unexpected error occurred in the dashboard"
      showRetry={true}
      onRetry={() => window.location.reload()}
    >
      <div className={`app ${layout.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              title={layout.sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <i className={`fas fa-${layout.sidebarCollapsed ? 'bars' : 'times'}`} />
            </button>
            
            <div className="app-title">
              <h1>
                <i className="fas fa-shield-alt" />
                LEGION ENTERPRISE
              </h1>
              <span className="subtitle">Autonomous Research Organization Dashboard</span>
            </div>
          </div>

          <div className="header-center">
            <div className="current-tab-info">
              <i className={currentTab.icon} />
              <div className="tab-details">
                <h2>{currentTab.title}</h2>
                <p>{currentTab.description}</p>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="system-status">
              <div className={`status-indicator ${systemStatus.systemHealth}`}>
                <i className={`fas fa-${systemStatus.connected ? 'check-circle' : 'exclamation-triangle'}`} />
                <span>{systemStatus.connected ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
              <div className="agent-count">
                <i className="fas fa-users" />
                <span>{systemStatus.agentsOnline} Agents</span>
              </div>
            </div>

            <div className="header-actions">
              <ThemeCustomizerButton className="action-button" />
              <button className="action-button" title="System Settings">
                <i className="fas fa-cog" />
              </button>
              <button className="action-button" title="Notifications">
                <i className="fas fa-bell" />
              </button>
              <button className="action-button" title="Help">
                <i className="fas fa-question-circle" />
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar Navigation */}
        <nav className={`sidebar ${layout.sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-content">
            <div className="nav-tabs">
              {DASHBOARD_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-tab ${router.currentTab.toLowerCase() === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                  title={`${tab.title} (Ctrl+${tab.shortcut})`}
                  aria-label={tab.title}
                >
                  <div className="tab-icon">
                    <i className={tab.icon} />
                  </div>
                  {!layout.sidebarCollapsed && (
                    <div className="tab-content">
                      <span className="tab-name">{tab.name}</span>
                      <span className="tab-description">{tab.description}</span>
                      <kbd className="tab-shortcut">Ctrl+{tab.shortcut}</kbd>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {!layout.sidebarCollapsed && (
              <div className="sidebar-footer">
                <div className="connection-status">
                  <div className={`connection-indicator ${systemStatus.connected ? 'connected' : 'disconnected'}`}>
                    <i className="fas fa-circle" />
                    <span>{systemStatus.connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  <div className="system-info">
                    <small>System Health: {systemStatus.systemHealth}</small>
                    <small>{systemStatus.agentsOnline} agents online</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Container maxWidth="xlarge">
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation className="dashboard-breadcrumbs" />
            
            <div className="dashboard-container">
              <ErrorBoundary
                variant="card"
                title={`${currentTab.title} Error`}
                message={`An error occurred in the ${currentTab.name} dashboard`}
                showRetry={true}
              >
                <CurrentComponent />
              </ErrorBoundary>
            </div>
          </Container>
        </main>

        {/* Navigation Controls (for development/admin) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="nav-debug-controls" style={{ 
            position: 'fixed', 
            bottom: '10px', 
            left: '10px', 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '8px', 
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10000
          }}>
            <div>Current Tab: {router.currentTab}</div>
            <div>Screen: {layout.screenSize}</div>
            <div>Sidebar: {layout.sidebarCollapsed ? 'Collapsed' : 'Expanded'}</div>
            <button onClick={router.goBack} disabled={!router.canGoBack}>←</button>
            <button onClick={router.goForward} disabled={!router.canGoForward}>→</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
