import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Enterprise Command Center - Professional agent network visualization
const EnterpriseCommandCenter = () => {
  const [agentData, setAgentData] = useState([]);
  const [workflowData, setWorkflowData] = useState([]);
  const [businessMetrics, setBusinessMetrics] = useState({});
  const [departmentActivities, setDepartmentActivities] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [apiData, setApiData] = useState({});
  const [viewMode, setViewMode] = useState('topology');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    totalEdges: 0,
    avgDegree: 0,
    density: 0,
    components: 0
  });

  const topologyRef = useRef();
  const simulationRef = useRef();

  // Real agent departments from your system
  const agentDepartments = {
    automation: ['TaskSchedulingAgent', 'WorkflowOrchestrationAgent', 'ResourceOptimizationAgent'],
    finance: ['FinancialAnalysisAgent', 'FinancialModelingAgent', 'QualityAssuranceAgent', 'ReportGenerationAgent'],
    communication: ['ContentWritingAgent', 'SocialMediaMonitoringAgent'],
    legal: ['ComplianceCheckerAgent'],
    organization: ['OrganizationStructureAgent'],
    business_intelligence: ['AnalyticsAgent', 'ComprehensiveAnalyticsAgent', 'MarketAnalysisAgent', 'ResearchAgent', 'StrategicPlanningAgent'],
    operations: ['OperationsAgent', 'MonitoringAgent']
  };

  // Fetch enterprise data
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
    const interval = setInterval(fetchEnterpriseData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize network topology visualization
  useEffect(() => {
    if (viewMode === 'topology' && topologyRef.current) {
      initializeTopology();
    }
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [viewMode, systemMessages]);

  const initializeTopology = () => {
    const container = topologyRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous visualization
    d3.select(container).selectAll("*").remove();

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#000000");

    // Create nodes and links from agent data
    const nodes = [];
    const links = [];

    // Create department nodes
    Object.entries(agentDepartments).forEach(([deptName, agents], deptIndex) => {
      const deptNode = {
        id: `dept-${deptName}`,
        type: 'department',
        name: deptName.toUpperCase(),
        x: (width / Object.keys(agentDepartments).length) * (deptIndex + 0.5),
        y: height / 3,
        radius: 15,
        color: getDepartmentColor(deptName)
      };
      nodes.push(deptNode);

      // Create agent nodes for each department
      agents.forEach((agentName, agentIndex) => {
        const agentNode = {
          id: `agent-${agentName}`,
          type: 'agent',
          name: agentName,
          department: deptName,
          x: deptNode.x + (agentIndex - agents.length/2) * 80,
          y: deptNode.y + 120,
          radius: 8,
          color: getAgentColor(agentName, systemMessages),
          activity: getAgentActivity(agentName, systemMessages)
        };
        nodes.push(agentNode);

        // Link agent to department
        links.push({
          source: deptNode.id,
          target: agentNode.id,
          type: 'hierarchy',
          strength: 1
        });
      });
    });

    // Add inter-agent communication links based on system messages
    systemMessages.forEach(msg => {
      const sourceAgent = nodes.find(n => n.id.includes(msg.source_agent));
      const targetAgent = nodes.find(n => n.id.includes(msg.target_agent));
      
      if (sourceAgent && targetAgent && sourceAgent.id !== targetAgent.id) {
        const existingLink = links.find(l => 
          (l.source === sourceAgent.id && l.target === targetAgent.id) ||
          (l.source === targetAgent.id && l.target === sourceAgent.id)
        );
        
        if (!existingLink) {
          links.push({
            source: sourceAgent.id,
            target: targetAgent.id,
            type: 'communication',
            strength: 0.5,
            activity: getRecentActivity(msg.created_at)
          });
        }
      }
    });

    // Update network statistics
    setNetworkStats({
      totalNodes: nodes.length,
      totalEdges: links.length,
      avgDegree: nodes.length > 0 ? (2 * links.length / nodes.length).toFixed(2) : 0,
      density: nodes.length > 1 ? (links.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(3) : 0,
      components: calculateConnectedComponents(nodes, links)
    });

    // Create D3 force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.type === 'hierarchy' ? 100 : 150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => d.radius + 5));

    simulationRef.current = simulation;

    // Create link elements
    const linkGroup = svg.append("g").attr("class", "links");
    const link = linkGroup.selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("class", d => `link ${d.type}`)
      .attr("stroke", d => d.type === 'hierarchy' ? '#333' : getConnectionColor(d))
      .attr("stroke-width", d => d.type === 'hierarchy' ? 1 : getConnectionWidth(d))
      .attr("stroke-opacity", d => d.type === 'hierarchy' ? 0.6 : getConnectionOpacity(d));

    // Create node elements
    const nodeGroup = svg.append("g").attr("class", "nodes");
    const node = nodeGroup.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("class", d => `node ${d.type}`)
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", d => d.type === 'department' ? 2 : 1)
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add node labels
    const labelGroup = svg.append("g").attr("class", "labels");
    const label = labelGroup.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === 'department' ? 5 : 3)
      .attr("font-size", d => d.type === 'department' ? "10px" : "8px")
      .attr("font-family", "monospace")
      .attr("fill", "#ffffff")
      .attr("pointer-events", "none")
      .text(d => d.type === 'department' ? d.name : d.name.replace('Agent', ''));

    // Add pulsing effect for active connections
    const activePulse = linkGroup.selectAll(".active-pulse")
      .data(links.filter(d => d.activity > 0.8))
      .enter().append("line")
      .attr("class", "active-pulse")
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 0)
      .style("animation", "pulse 2s infinite");

    // Simulation tick function
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      activePulse
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add CSS for pulsing animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { stroke-opacity: 0; }
        50% { stroke-opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  };

  const handleNodeClick = (node) => {
    setSelectedAgent(node);
  };

  const getDepartmentColor = (deptName) => {
    const colors = {
      automation: '#ff6b6b',
      finance: '#4ecdc4',
      communication: '#45b7d1',
      legal: '#f9ca24',
      organization: '#f0932b',
      business_intelligence: '#eb4d4b',
      operations: '#6c5ce7'
    };
    return colors[deptName] || '#95a5a6';
  };

  const getAgentColor = (agentName, messages) => {
    const recentMessage = messages.find(msg => 
      msg.target_agent.includes(agentName.toLowerCase()) ||
      msg.source_agent.includes(agentName.toLowerCase())
    );
    
    if (recentMessage) {
      const timeSince = new Date() - new Date(recentMessage.created_at);
      if (timeSince < 300000) return '#00ff00'; // Green - very recent
      if (timeSince < 3600000) return '#ffff00'; // Yellow - recent
    }
    return '#666666'; // Gray - inactive
  };

  const getAgentActivity = (agentName, messages) => {
    return messages.filter(msg => 
      msg.target_agent.includes(agentName.toLowerCase()) ||
      msg.source_agent.includes(agentName.toLowerCase())
    ).length;
  };

  const getRecentActivity = (timestamp) => {
    const timeSince = new Date() - new Date(timestamp);
    return Math.max(0, 1 - (timeSince / 3600000)); // Activity fades over 1 hour
  };

  const getConnectionColor = (link) => {
    if (link.activity > 0.8) return '#00ff00';
    if (link.activity > 0.5) return '#ffff00';
    if (link.activity > 0.2) return '#ff9500';
    return '#333333';
  };

  const getConnectionWidth = (link) => {
    return 1 + (link.activity * 3);
  };

  const getConnectionOpacity = (link) => {
    return 0.3 + (link.activity * 0.7);
  };

  const calculateConnectedComponents = (nodes, links) => {
    const visited = new Set();
    let components = 0;
    
    const dfs = (nodeId) => {
      visited.add(nodeId);
      links.forEach(link => {
        const neighbor = link.source === nodeId ? link.target : 
                        link.target === nodeId ? link.source : null;
        if (neighbor && !visited.has(neighbor)) {
          dfs(neighbor);
        }
      });
    };
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
        components++;
      }
    });
    
    return components;
  };

  return (
    <div className="enterprise-command-center h-screen bg-black text-white font-mono overflow-hidden">
      {/* Header */}
      <header className="bg-black/90 border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-light tracking-wider">
                ENTERPRISE LEGION • NODE-EDGE ARCHITECTURE
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
                  <span className="text-gray-400">DENSITY:</span>
                  <span className="text-white">{networkStats.density}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">COMPONENTS:</span>
                  <span className="text-white">{networkStats.components}</span>
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
                  
                  {selectedAgent.department && (
                    <div>
                      <div className="text-gray-400">DEPARTMENT</div>
                      <div className="text-white uppercase">{selectedAgent.department}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-gray-400">STATUS</div>
                    <div className={`${selectedAgent.activity > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      {selectedAgent.activity > 0 ? 'ACTIVE' : 'STANDBY'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400">ACTIVITY LEVEL</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-800 h-1">
                        <div 
                          className="h-1 bg-gradient-to-r from-green-400 to-blue-400"
                          style={{ width: `${Math.min(selectedAgent.activity * 20, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white">{selectedAgent.activity}</span>
                    </div>
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
              {/* Business Objectives */}
              <div className="col-span-8">
                <BusinessObjectivesPanel businessMetrics={businessMetrics} />
              </div>
              
              {/* Department Activities */}
              <div className="col-span-4">
                <DepartmentPanel departmentActivities={departmentActivities} />
              </div>
              
              {/* Workflow Status */}
              <div className="col-span-6">
                <WorkflowPanel workflowData={workflowData} />
              </div>
              
              {/* System Health */}
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
        <div className="w-80 bg-gray-900/30 border-l border-gray-800 overflow-y-auto">
          <SupportingDataPanel apiData={apiData} />
        </div>
      </div>
    </div>
  );
};

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

// Agent Grid View
const AgentGrid = ({ departments, systemMessages }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded p-6">
    <h3 className="text-lg font-light text-white mb-6 tracking-wide">AGENT DIRECTORY</h3>
    
    {Object.entries(departments).map(([deptName, agents]) => (
      <div key={deptName} className="mb-8">
        <h4 className="text-sm font-light text-blue-400 mb-4 uppercase tracking-wide">
          {deptName} DEPARTMENT ({agents.length} AGENTS)
        </h4>
        
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agentName) => {
            const recentActivity = systemMessages.find(msg => 
              msg.target_agent.includes(agentName.toLowerCase())
            );
            
            return (
              <div key={agentName} className="bg-gray-800/50 rounded p-4 cursor-pointer hover:bg-gray-800/70 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-light text-white">{agentName}</div>
                  <div className={`w-2 h-2 rounded-full ${
                    recentActivity ? 'bg-green-400' : 'bg-gray-500'
                  }`}></div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {recentActivity ? 'RECENTLY ACTIVE' : 'STANDBY'}
                </div>
                
                {recentActivity && (
                  <div className="text-xs text-gray-500 mt-2">
                    LAST: {new Date(recentActivity.created_at).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

// Supporting Data Panel
const SupportingDataPanel = ({ apiData }) => (
  <div className="p-4 h-full">
    <h3 className="text-sm font-light text-gray-300 mb-4 tracking-wide">SUPPORTING DATA</h3>
    
    {/* Market Data */}
    <div className="bg-gray-800/30 rounded p-3 mb-4">
      <div className="text-xs font-light text-green-400 mb-2">MARKET PULSE</div>
      <div className="text-xs space-y-1 font-mono">
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
    
    {/* Environment */}
    <div className="bg-gray-800/30 rounded p-3 mb-4">
      <div className="text-xs font-light text-blue-400 mb-2">ENVIRONMENT</div>
      <div className="text-xs font-mono">
        <div>WEATHER: SUNNY, 24°C</div>
        <div>AQI: GOOD (45)</div>
        <div>UV INDEX: MODERATE</div>
      </div>
    </div>
    
    {/* News Feed */}
    <div className="bg-gray-800/30 rounded p-3 mb-4">
      <div className="text-xs font-light text-purple-400 mb-2">NEWS PULSE</div>
      <div className="text-xs space-y-2">
        <div className="text-gray-300">AI MARKET GROWTH CONTINUES...</div>
        <div className="text-gray-300">ENTERPRISE AUTOMATION TRENDS...</div>
        <div className="text-gray-300">TECHNOLOGY INVESTMENT SURGE...</div>
      </div>
    </div>
    
    {/* System Status */}
    <div className="bg-gray-800/30 rounded p-3">
      <div className="text-xs font-light text-yellow-400 mb-2">SYSTEM STATUS</div>
      <div className="text-xs space-y-1 font-mono">
        <div className="flex justify-between">
          <span>API HEALTH</span>
          <span className="text-green-400">●</span>
        </div>
        <div className="flex justify-between">
          <span>DB STATUS</span>
          <span className="text-green-400">●</span>
        </div>
        <div className="flex justify-between">
          <span>LEGION CORE</span>
          <span className="text-green-400">●</span>
        </div>
      </div>
    </div>
  </div>
);

export default EnterpriseCommandCenter;
