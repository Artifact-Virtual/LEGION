import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';

// Business Objectives Panel
const BusinessObjectivesPanel = ({ businessMetrics }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
    <h3 className="text-sm font-light text-gray-300 mb-4 tracking-wide">BUSINESS OBJECTIVES</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800/50 rounded p-4">
        <div className="text-xs text-gray-400">REVENUE TARGET</div>
        <div className="text-xl font-light text-green-400">$50,000</div>
        <div className="text-xs text-gray-500">YEAR 1 GOAL</div>
      </div>
      <div className="bg-gray-800/50 rounded p-4">
        <div className="text-xs text-gray-400">DOMAIN STATUS</div>
        <div className="text-sm font-light text-yellow-400">artifactvirtual.com</div>
        <div className="text-xs text-gray-500">REGISTERED</div>
      </div>
      <div className="bg-gray-800/50 rounded p-4">
        <div className="text-xs text-gray-400">WEBSITE LAUNCH</div>
        <div className="text-sm font-light text-orange-400">JULY 30TH</div>
        <div className="text-xs text-gray-500">TARGET DATE</div>
      </div>
      <div className="bg-gray-800/50 rounded p-4">
        <div className="text-xs text-gray-400">LINKEDIN PRESENCE</div>
        <div className="text-sm font-light text-blue-400">JULY 10TH</div>
        <div className="text-xs text-gray-500">ESTABLISHED</div>
      </div>
    </div>
  </div>
);

// Department Activities Panel
const DepartmentPanel = ({ departmentActivities }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
    <h3 className="text-sm font-light text-gray-300 mb-4 tracking-wide">DEPARTMENT ACTIVITIES</h3>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {departmentActivities.slice(0, 10).map((activity, index) => (
        <div key={index} className="bg-gray-800/50 rounded p-3 cursor-pointer hover:bg-gray-800/70 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-light uppercase text-white">{activity.department}</div>
              <div className="text-xs text-gray-400">{activity.activity_type}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              activity.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              {activity.status.toUpperCase()}
            </div>
          </div>
          <div className="text-xs text-gray-300 mt-2">{activity.description}</div>
        </div>
      ))}
    </div>
  </div>
);

// Workflow Panel
const WorkflowPanel = ({ workflowData }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
    <h3 className="text-sm font-light text-gray-300 mb-4 tracking-wide">ACTIVE WORKFLOWS</h3>
    <div className="space-y-3">
      {workflowData.slice(0, 5).map((workflow, index) => (
        <div key={index} className="bg-gray-800/50 rounded p-3 cursor-pointer hover:bg-gray-800/70 transition-colors">
          <div className="flex justify-between items-center">
            <div className="text-xs font-light text-white">{workflow.workflow_name}</div>
            <div className={`px-2 py-1 rounded text-xs ${
              workflow.status === 'completed' ? 'bg-green-600' : 
              workflow.status === 'running' ? 'bg-blue-600' : 'bg-yellow-600'
            } text-white`}>
              {workflow.status.toUpperCase()}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            STARTED: {new Date(workflow.started_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// System Health Panel
const SystemHealthPanel = ({ systemMessages, agentDepartments }) => {
  const totalAgents = Object.values(agentDepartments).flat().length;
  const activeAgents = new Set(systemMessages.map(msg => msg.target_agent)).size;
  
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
      <h3 className="text-sm font-light text-gray-300 mb-4 tracking-wide">SYSTEM HEALTH</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded p-4 text-center">
          <div className="text-2xl font-light text-green-400">{activeAgents}</div>
          <div className="text-xs text-gray-400">ACTIVE AGENTS</div>
          <div className="text-xs text-gray-500">OF {totalAgents} TOTAL</div>
        </div>
        <div className="bg-gray-800/50 rounded p-4 text-center">
          <div className="text-2xl font-light text-blue-400">{systemMessages.length}</div>
          <div className="text-xs text-gray-400">MESSAGES</div>
          <div className="text-xs text-gray-500">RECENT ACTIVITY</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-xs text-gray-400 mb-2">RECENT MESSAGES</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {systemMessages.slice(0, 3).map((msg, index) => (
            <div key={index} className="bg-gray-800/30 rounded p-2 text-xs cursor-pointer hover:bg-gray-800/50 transition-colors">
              <div className="text-blue-400">{msg.source_agent} → {msg.target_agent}</div>
              <div className="text-gray-300">{msg.message_type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Agent Grid View with clickable agents
const AgentGrid = ({ departments, systemMessages }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const getAgentDetails = (agentName) => {
    const allMessages = systemMessages.filter(msg =>
      msg.target_agent === agentName.toLowerCase().replace('agent', '_agent') ||
      msg.source_agent === agentName.toLowerCase().replace('agent', '_agent')
    );
    const isActive = allMessages.length > 0;
    const messageCount = allMessages.length;
    const recentActivity = allMessages.length > 0 ? allMessages[0] : null;
    return {
      name: agentName,
      isActive,
      messageCount,
      recentActivity,
      allMessages
    };
  };
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-white">Agent Directory</h3>
      
      {Object.entries(departments).map(([deptName, agents]) => (
        <div key={deptName} className="mb-8">
          <h4 className="text-lg font-bold mb-4 text-blue-400 capitalize">
            {deptName} Department ({agents.length} agents)
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            {agents.map((agentName) => (
              <div
                key={agentName}
                className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => setSelectedAgent(getAgentDetails(agentName))}
              >
                <div className="font-semibold text-white">{agentName}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {getAgentDetails(agentName).isActive ? 'Active' : 'Standby'}
                </div>
                <div className="text-xs text-gray-400">
                  Messages: {getAgentDetails(agentName).messageCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {selectedAgent && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-blue-400">Agent Details</h4>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Agent Name</div>
                  <div className="font-semibold text-lg">{selectedAgent.name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400">Status</div>
                  <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded text-sm ${
                    selectedAgent.isActive ? 'bg-green-600' : 'bg-gray-600'
                  } text-white`}>
                    <div className={`w-2 h-2 rounded-full ${
                      selectedAgent.isActive ? 'bg-green-300' : 'bg-gray-300'
                    }`}></div>
                    <span>{selectedAgent.isActive ? 'Active' : 'Standby'}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400">Total Messages</div>
                  <div className="text-lg font-bold">{selectedAgent.messageCount}</div>
                </div>
                
                {selectedAgent.recentActivity && (
                  <div>
                    <div className="text-sm text-gray-400">Last Activity</div>
                    <div>{new Date(selectedAgent.recentActivity.created_at).toLocaleString()}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-gray-400">Capabilities</div>
                  <div className="text-sm text-gray-300">
                    {selectedAgent.name.includes('Financial') ? 'Financial analysis, modeling, reporting' :
                     selectedAgent.name.includes('Task') ? 'Task scheduling, execution, coordination' :
                     selectedAgent.name.includes('Workflow') ? 'Workflow orchestration, automation' :
                     selectedAgent.name.includes('Resource') ? 'Resource optimization, allocation' :
                     selectedAgent.name.includes('Content') ? 'Content creation, writing, management' :
                     selectedAgent.name.includes('Social') ? 'Social media monitoring, engagement' :
                     selectedAgent.name.includes('Compliance') ? 'Legal compliance, regulatory checks' :
                     selectedAgent.name.includes('Analytics') ? 'Data analysis, business intelligence' :
                     selectedAgent.name.includes('Market') ? 'Market research, competitive analysis' :
                     selectedAgent.name.includes('Strategic') ? 'Strategic planning, business development' :
                     'Task execution, data processing, decision making'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// Supporting Data Panel
const SupportingDataPanel = ({ apiData }) => (
  <div className="p-4 h-full overflow-y-auto">
    <h3 className="text-lg font-bold mb-4 text-gray-300">Supporting Data</h3>
    
    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
      <div className="text-sm font-semibold text-green-400 mb-2">Market Pulse</div>
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>AAPL</span>
          <span className="text-green-400">+2.1%</span>
        </div>
        <div className="flex justify-between">
          <span>TSLA</span>
          <span className="text-red-400">-1.3%</span>
        </div>
        <div className="flex justify-between">
          <span>NVDA</span>
          <span className="text-green-400">+3.5%</span>
        </div>
      </div>
    </div>
    
    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
      <div className="text-sm font-semibold text-blue-400 mb-2">Environment</div>
      <div className="text-xs">
        <div>Weather: Sunny, 24°C</div>
        <div>AQI: Good (45)</div>
        <div>UV Index: Moderate</div>
      </div>
    </div>
    
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="text-sm font-semibold text-yellow-400 mb-2">System Status</div>
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>API Health</span>
          <span className="text-green-400">●</span>
        </div>
        <div className="flex justify-between">
          <span>DB Status</span>
          <span className="text-green-400">●</span>
        </div>
        <div className="flex justify-between">
          <span>Legion Core</span>
          <span className="text-green-400">●</span>
        </div>
      </div>
    </div>
  </div>
);

function CommandCenter() {
  // State
  const [agentData, setAgentData] = useState([]);
  const [workflowData, setWorkflowData] = useState([]);
  const [businessMetrics, setBusinessMetrics] = useState({});
  const [departmentActivities, setDepartmentActivities] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [apiData, setApiData] = useState({});
  const [viewMode, setViewMode] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [networkStats, setNetworkStats] = useState({ 
    totalNodes: 0, totalEdges: 0, avgDegree: 0, density: 0, components: 0 
  });
  
  const topologyRef = useRef();

  const agentDepartments = {
    automation: ['TaskSchedulingAgent', 'WorkflowOrchestrationAgent', 'ResourceOptimizationAgent'],
    finance: ['FinancialAnalysisAgent', 'FinancialModelingAgent', 'QualityAssuranceAgent', 'ReportGenerationAgent'],
    communication: ['ContentWritingAgent', 'SocialMediaMonitoringAgent'],
    legal: ['ComplianceCheckerAgent'],
    organization: ['OrganizationStructureAgent'],
    business_intelligence: ['AnalyticsAgent', 'ComprehensiveAnalyticsAgent', 'MarketAnalysisAgent', 'ResearchAgent', 'StrategicPlanningAgent'],
    operations: ['OperationsAgent', 'MonitoringAgent'],
  };

  // Data fetching
  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        const [agentResp, workflowResp, businessResp, deptResp, messagesResp] = await Promise.all([
          fetch('/api/enterprise/agent-activities'),
          fetch('/api/enterprise/workflow-executions'),
          fetch('/api/enterprise/business-metrics'),
          fetch('/api/enterprise/department-activities'),
          fetch('/api/enterprise/system-messages')
        ]);
        
        if (agentResp.ok) setAgentData(await agentResp.json());
        if (workflowResp.ok) setWorkflowData(await workflowResp.json());
        if (businessResp.ok) setBusinessMetrics(await businessResp.json());
        if (deptResp.ok) setDepartmentActivities(await deptResp.json());
        if (messagesResp.ok) setSystemMessages(await messagesResp.json());
        
        const apiResp = await fetch('/api/supporting-data');
        if (apiResp.ok) setApiData(await apiResp.json());
      } catch (error) {
        console.error('Error fetching enterprise data:', error);
      }
    };

    fetchEnterpriseData();
    const interval = setInterval(fetchEnterpriseData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getAgentActivity = (agentName) => {
    return systemMessages.filter(msg => 
      msg.target_agent.includes(agentName.toLowerCase()) ||
      msg.source_agent.includes(agentName.toLowerCase())
    ).length;
  };

  // Network topology generation with real-time workflow visualization
  const generateNetworkTopology = () => {
    if (!topologyRef.current) return;
    
    d3.select(topologyRef.current).selectAll("*").remove();
    
    const width = topologyRef.current.clientWidth;
    const height = topologyRef.current.clientHeight;
    
    const svg = d3.select(topologyRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#000000');

    // Add gradient definitions for flowing animations
    const defs = svg.append('defs');
    
    // Gradient for workflow flows
    const gradient = defs.append('linearGradient')
      .attr('id', 'workflowGradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00ff88')
      .attr('stop-opacity', 0);
      
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#00ff88')
      .attr('stop-opacity', 1);
      
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00ff88')
      .attr('stop-opacity', 0);

    // Pulsing gradient for active agents
    const pulseGradient = defs.append('radialGradient')
      .attr('id', 'pulseGradient');
      
    pulseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00ff88')
      .attr('stop-opacity', 0.8);
      
    pulseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00ff88')
      .attr('stop-opacity', 0.2);

    const nodes = [];
    const links = [];
    const workflowConnections = [];
    let nodeId = 0;

    // Create department nodes (core neural hubs)
    const deptNodes = Object.keys(agentDepartments).map((dept, i) => {
      const angle = (i / Object.keys(agentDepartments).length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3;
      return {
        id: nodeId++,
        name: dept,
        type: 'department',
        x: width/2 + Math.cos(angle) * radius,
        y: height/2 + Math.sin(angle) * radius,
        fx: width/2 + Math.cos(angle) * radius,
        fy: height/2 + Math.sin(angle) * radius,
        agents: agentDepartments[dept],
        activity: systemMessages.filter(msg => 
          agentDepartments[dept].some(agent => 
            msg.target_agent.includes(agent.toLowerCase()) || 
            msg.source_agent.includes(agent.toLowerCase())
          )
        ).length
      };
    });
    
    nodes.push(...deptNodes);

    // Create agent nodes (neural processors)
    deptNodes.forEach(deptNode => {
      deptNode.agents.forEach((agent, i) => {
        const angle = (i / deptNode.agents.length) * 2 * Math.PI + Date.now() * 0.0001; // Subtle rotation
        const radius = 100 + Math.sin(Date.now() * 0.001 + i) * 10; // Dynamic radius
        const activity = getAgentActivity(agent);
        const agentNode = {
          id: nodeId++,
          name: agent,
          type: 'agent',
          department: deptNode.name,
          x: deptNode.x + Math.cos(angle) * radius,
          y: deptNode.y + Math.sin(angle) * radius,
          activity: activity,
          isActive: activity > 0,
          lastActivity: Date.now() - (Math.random() * 60000), // Simulated last activity
          pulsePhase: Math.random() * Math.PI * 2
        };
        
        nodes.push(agentNode);
        links.push({
          source: deptNode.id,
          target: agentNode.id,
          type: 'hierarchy',
          strength: activity > 0 ? 1 : 0.3
        });
      });
    });

    // Create workflow connections (neural pathways)
    workflowData.forEach((workflow, index) => {
      if (workflow.status === 'running' || workflow.status === 'active') {
        const sourceAgent = nodes.find(n => n.name.toLowerCase().includes(workflow.source_agent?.toLowerCase() || 'task'));
        const targetAgent = nodes.find(n => n.name.toLowerCase().includes(workflow.target_agent?.toLowerCase() || 'workflow'));
        
        if (sourceAgent && targetAgent) {
          workflowConnections.push({
            source: sourceAgent,
            target: targetAgent,
            workflow: workflow,
            flowPhase: Math.random() * Math.PI * 2,
            intensity: workflow.status === 'running' ? 1 : 0.6
          });
        }
      }
    });

    // Create force simulation (neural network physics)
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.type === 'hierarchy' ? 60 : 100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width/2, height/2))
      .force('collision', d3.forceCollide().radius(20));

    // Create hierarchy links (structural connections)
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => d.strength > 0.5 ? '#444444' : '#222222')
      .attr('stroke-width', d => d.strength > 0.5 ? 2 : 1)
      .attr('stroke-opacity', d => d.strength);

    // Create workflow flow paths (dynamic neural pathways)
    const flowPaths = svg.append('g')
      .attr('class', 'workflow-flows')
      .selectAll('path')
      .data(workflowConnections)
      .enter().append('path')
      .attr('stroke', 'url(#workflowGradient)')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('stroke-dasharray', '10,5')
      .style('opacity', d => d.intensity);

    // Create department nodes (central hubs)
    const deptNode = svg.append('g')
      .attr('class', 'department-nodes')
      .selectAll('circle')
      .data(deptNodes)
      .enter().append('circle')
      .attr('r', d => 20 + d.activity * 2)
      .attr('fill', d => {
        const intensity = d.activity / 10;
        return d3.interpolateRgb('#0080ff', '#00ff88')(Math.min(intensity, 1));
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('filter', d => d.activity > 5 ? 'url(#pulseGradient)' : 'none');

    // Create agent nodes (processors)
    const agentNode = svg.append('g')
      .attr('class', 'agent-nodes')
      .selectAll('circle')
      .data(nodes.filter(n => n.type === 'agent'))
      .enter().append('circle')
      .attr('r', d => d.isActive ? 12 : 8)
      .attr('fill', d => {
        if (d.isActive) {
          const pulse = Math.sin(Date.now() * 0.005 + d.pulsePhase) * 0.3 + 0.7;
          return d3.interpolateRgb('#00ff88', '#ffaa00')(pulse);
        }
        return '#666666';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => d.isActive ? 2 : 1)
      .style('cursor', 'pointer')
      .style('filter', d => d.isActive ? `brightness(${1 + Math.sin(Date.now() * 0.01 + d.pulsePhase) * 0.3})` : 'brightness(0.7)')
      .on('click', (event, d) => {
        setSelectedAgent({
          name: d.name,
          department: d.department,
          activity: d.activity,
          type: d.type,
          isActive: d.isActive,
          lastActivity: d.lastActivity
        });
      });

    // Add labels with dynamic positioning
    const labels = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.type === 'department' ? d.name.toUpperCase() : d.name.replace('Agent', ''))
      .attr('font-size', d => d.type === 'department' ? '10px' : '8px')
      .attr('fill', d => d.isActive ? '#ffffff' : '#cccccc')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'department' ? 30 : 25)
      .style('font-family', 'monospace')
      .style('font-weight', d => d.isActive ? 'bold' : 'normal');

    // Animation loop for real-time updates
    const animate = () => {
      // Update workflow flow animations
      flowPaths
        .attr('stroke-dashoffset', () => (Date.now() * 0.1) % 15)
        .attr('d', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 0.3;
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

      // Update agent node pulsing
      agentNode
        .attr('r', d => {
          if (d.isActive) {
            const pulse = Math.sin(Date.now() * 0.008 + d.pulsePhase) * 3 + 12;
            return Math.max(pulse, 8);
          }
          return 8;
        })
        .attr('fill', d => {
          if (d.isActive) {
            const pulse = Math.sin(Date.now() * 0.005 + d.pulsePhase) * 0.3 + 0.7;
            return d3.interpolateRgb('#00ff88', '#ffaa00')(pulse);
          }
          return '#666666';
        });

      // Update department nodes
      deptNode
        .attr('r', d => {
          const basePulse = 20 + d.activity * 2;
          const pulse = Math.sin(Date.now() * 0.003) * 3;
          return basePulse + pulse;
        });

      requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Physics simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      deptNode
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      agentNode
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      // Update workflow paths in real-time
      flowPaths.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.3;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
    });

    // Update network statistics
    setNetworkStats({
      totalNodes: nodes.length,
      totalEdges: links.length + workflowConnections.length,
      avgDegree: ((links.length + workflowConnections.length) * 2 / nodes.length).toFixed(1),
      density: ((links.length + workflowConnections.length) / (nodes.length * (nodes.length - 1) / 2)).toFixed(3),
      components: 1,
      activeWorkflows: workflowConnections.length
    });
  };

  // Generate topology when view changes and update frequently for real-time visualization
  useEffect(() => {
    if (viewMode === 'topology' && topologyRef.current) {
      generateNetworkTopology();
      
      // Set up real-time refresh for 4D visualization
      const topologyInterval = setInterval(() => {
        if (viewMode === 'topology' && topologyRef.current) {
          // Only regenerate if there are new messages or workflows
          generateNetworkTopology();
        }
      }, 5000); // Update every 5 seconds for real-time feel
      
      return () => clearInterval(topologyInterval);
    }
  }, [viewMode, systemMessages, workflowData]);

  return (
    <div className="enterprise-command-center h-screen bg-black text-white font-mono overflow-hidden">
      {/* Header */}
      <header className="bg-black/90 border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-light tracking-wider">
                ENTERPRISE LEGION • NODE-EDGE ARCHITECTURE • 4D TEMPORAL
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {Object.values(agentDepartments).flat().length} AUTONOMOUS AGENTS
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400">
              WORKFLOWS: <span className="text-green-400">{workflowData.length}</span>
            </div>
            <div className="text-xs text-gray-400">
              MESSAGES: <span className="text-blue-400">{systemMessages.length}</span>
            </div>
            {/* View Mode Toggle */}
            <div className="flex bg-gray-900 rounded">
              {['topology', 'overview', 'agents'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs font-light tracking-wide transition-all ${
                    viewMode === mode 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Network Topology View */}
        {viewMode === 'topology' && (
          <div className="flex-1 relative">
            <div 
              ref={topologyRef}
              className="w-full h-full bg-black"
              style={{ height: 'calc(100vh - 80px)' }}
            />
            {/* Network Stats Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 rounded border border-gray-800 p-4 w-64">
              <h3 className="text-xs font-light text-gray-300 mb-3">NETWORK ANALYTICS</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">NODES:</span>
                  <span className="text-white">{networkStats.totalNodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">EDGES:</span>
                  <span className="text-white">{networkStats.totalEdges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AVG DEGREE:</span>
                  <span className="text-white">{networkStats.avgDegree}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">WORKFLOWS:</span>
                  <span className="text-green-300">{networkStats.activeWorkflows || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">AUTONOMY:</span>
                  <span className="text-yellow-300">24/7</span>
                </div>
              </div>
            </div>
            {/* Agent Details Overlay */}
            {selectedAgent && (
              <div className="absolute top-4 right-4 bg-black/90 rounded border border-gray-800 p-4 w-80">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-light text-white">{selectedAgent.name}</h4>
                  <button 
                    onClick={() => setSelectedAgent(null)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-gray-400">TYPE</div>
                    <div className="text-white capitalize">{selectedAgent.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">DEPARTMENT</div>
                    <div className="text-white uppercase">{selectedAgent.department}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">STATUS</div>
                    <div className={`flex items-center space-x-2 ${selectedAgent.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${selectedAgent.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span>{selectedAgent.isActive ? 'ACTIVE' : 'STANDBY'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">ACTIVITY LEVEL</div>
                    <div className="text-white">{selectedAgent.activity || 0} operations</div>
                  </div>
                  {selectedAgent.lastActivity && (
                    <div>
                      <div className="text-gray-400">LAST ACTIVITY</div>
                      <div className="text-blue-400">{Math.floor((Date.now() - selectedAgent.lastActivity) / 1000)}s ago</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-400">NEURAL STATE</div>
                    <div className="text-cyan-400">{selectedAgent.isActive ? 'Processing' : 'Idle'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="flex-1 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <BusinessObjectivesPanel businessMetrics={businessMetrics} />
              </div>
              <div className="col-span-4">
                <DepartmentPanel departmentActivities={departmentActivities} />
              </div>
              <div className="col-span-6">
                <WorkflowPanel workflowData={workflowData} />
              </div>
              <div className="col-span-6">
                <SystemHealthPanel systemMessages={systemMessages} agentDepartments={agentDepartments} />
              </div>
            </div>
          </div>
        )}

        {/* Agent Mode */}
        {viewMode === 'agents' && (
          <div className="flex-1 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            <AgentGrid departments={agentDepartments} systemMessages={systemMessages} />
          </div>
        )}

        {/* Supporting Data Sidebar */}
        <div className={`bg-gray-900/30 border-l border-gray-800 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'w-12' : 'w-80'
        }`}>
          <div className="flex items-center justify-between p-2 border-b border-gray-800">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
            {!sidebarCollapsed && (
              <h3 className="text-sm font-light text-gray-300">SUPPORTING DATA</h3>
            )}
          </div>
          {!sidebarCollapsed && <SupportingDataPanel apiData={apiData} />}
        </div>
      </div>
    </div>
  );
}

export default CommandCenter;
