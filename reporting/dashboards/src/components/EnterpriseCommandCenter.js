import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// Enterprise Command Center - The main dashboard showcasing the 26-agent autonomous system
const EnterpriseCommandCenter = () => {
  const [agentData, setAgentData] = useState([]);
  const [workflowData, setWorkflowData] = useState([]);
  const [businessMetrics, setBusinessMetrics] = useState({});
  const [departmentActivities, setDepartmentActivities] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [apiData, setApiData] = useState({}); // Supporting data
  const [viewMode, setViewMode] = useState('3d'); // 3d, overview, agents
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Agent departments and their 26 agents
  const agentDepartments = {
    automation: ['TaskSchedulingAgent', 'WorkflowOrchestrationAgent', 'ResourceOptimizationAgent'],
    finance: ['FinancialAnalysisAgent', 'FinancialModelingAgent', 'QualityAssuranceAgent', 'ReportGenerationAgent'],
    communication: ['ContentWritingAgent', 'SocialMediaMonitoringAgent'],
    legal: ['ComplianceCheckerAgent'],
    organization: ['OrganizationStructureAgent'],
    business_intelligence: ['AnalyticsAgent', 'ComprehensiveAnalyticsAgent', 'MarketAnalysisAgent', 'ResearchAgent', 'StrategicPlanningAgent'],
    operations: ['OperationsAgent', 'MonitoringAgent'],
    // Add more as they're discovered
  };

  // Fetch enterprise data
  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        // Agent activities and business data
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

        // Supporting API data (compact)
        const apiResp = await fetch('/api/supporting-data');
        if (apiResp.ok) setApiData(await apiResp.json());

      } catch (error) {
        console.error('Error fetching enterprise data:', error);
      }
    };

    fetchEnterpriseData();
    const interval = setInterval(fetchEnterpriseData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="enterprise-command-center h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-md p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xl font-bold text-white">
                ENTERPRISE LEGION
              </span>
            </div>
            <div className="text-sm text-gray-400">
              26 Autonomous Agents • Node-Edge Architecture
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm">
              <div className="text-gray-300">Active Workflows</div>
              <div className="text-green-400 font-bold">{workflowData.length}</div>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-300">System Messages</div>
              <div className="text-blue-400 font-bold">{systemMessages.length}</div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['3d', 'overview', 'agents'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
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
      <div className="flex h-full overflow-hidden">{/* Prevent overflow issues */}
        {/* 3D Visualization */}
        {viewMode === '3d' && (
          <div className="flex-1 relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              
              <AgentNetwork 
                departments={agentDepartments}
                systemMessages={systemMessages}
                workflowData={workflowData}
                onAgentSelect={setSelectedAgent}
              />
            </Canvas>
            
            {/* Agent Details Overlay */}
            <AnimatePresence>
              {selectedAgent && (
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 w-80"
                >
                  <AgentDetails agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 grid grid-cols-12 gap-6 min-h-full">
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
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AgentGrid departments={agentDepartments} systemMessages={systemMessages} />
            </div>
          </div>
        )}

        {/* Supporting Data Sidebar (Compact) */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-md">
          <SupportingDataPanel apiData={apiData} />
        </div>
      </div>

      {/* AbuseIPDB Sponsor Badge */}
      <div className="absolute bottom-4 right-4">
        <a
          href="https://www.abuseipdb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-500 hover:to-orange-500"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs">Powered by</span>
            <span className="font-bold">AbuseIPDB</span>
          </div>
        </a>
      </div>
    </div>
  );
};

// 3D Agent Network Visualization
const AgentNetwork = ({ departments, systemMessages, workflowData, onAgentSelect }) => {
  const meshRef = useRef();
  const [nodes, setNodes] = useState([]);
  
  useEffect(() => {
    // Create nodes for each department and agent
    const newNodes = [];
    let index = 0;
    
    Object.entries(departments).forEach(([deptName, agents], deptIndex) => {
      // Department node (center)
      const deptAngle = (deptIndex / Object.keys(departments).length) * Math.PI * 2;
      const deptRadius = 5;
      
      newNodes.push({
        id: `dept-${deptName}`,
        type: 'department',
        name: deptName,
        position: [
          Math.cos(deptAngle) * deptRadius,
          Math.sin(deptAngle) * deptRadius,
          0
        ],
        color: '#3B82F6', // Blue for departments
        scale: 1.5
      });
      
      // Agent nodes (around department)
      agents.forEach((agentName, agentIndex) => {
        const agentAngle = deptAngle + (agentIndex / agents.length) * Math.PI * 0.5 - Math.PI * 0.25;
        const agentRadius = deptRadius + 2;
        
        newNodes.push({
          id: `agent-${agentName}`,
          type: 'agent',
          name: agentName,
          department: deptName,
          position: [
            Math.cos(agentAngle) * agentRadius,
            Math.sin(agentAngle) * agentRadius,
            (Math.random() - 0.5) * 2
          ],
          color: getAgentColor(agentName, systemMessages),
          scale: 1.0,
          activity: getAgentActivity(agentName, systemMessages)
        });
      });
    });
    
    setNodes(newNodes);
  }, [departments, systemMessages]);
  
  const getAgentColor = (agentName, messages) => {
    const recentMessage = messages.find(msg => 
      msg.target_agent === agentName.toLowerCase().replace('agent', '_agent') ||
      msg.source_agent === agentName.toLowerCase().replace('agent', '_agent')
    );
    
    if (recentMessage) {
      const timeSince = new Date() - new Date(recentMessage.created_at);
      if (timeSince < 300000) return '#10B981'; // Green - very recent
      if (timeSince < 3600000) return '#F59E0B'; // Yellow - recent
    }
    return '#6B7280'; // Gray - inactive
  };
  
  const getAgentActivity = (agentName, messages) => {
    return messages.filter(msg => 
      msg.target_agent === agentName.toLowerCase().replace('agent', '_agent') ||
      msg.source_agent === agentName.toLowerCase().replace('agent', '_agent')
    ).length;
  };

  return (
    <group ref={meshRef}>
      {nodes.map((node) => (
        <AgentNode
          key={node.id}
          node={node}
          onClick={() => onAgentSelect(node)}
        />
      ))}
      
      {/* Connection lines between departments */}
      {nodes.filter(n => n.type === 'department').map((dept1, i) =>
        nodes.filter(n => n.type === 'department').slice(i + 1).map((dept2) => (
          <ConnectionLine
            key={`${dept1.id}-${dept2.id}`}
            start={dept1.position}
            end={dept2.position}
            opacity={0.3}
          />
        ))
      )}
    </group>
  );
};

// Individual Agent Node Component
const AgentNode = ({ node, onClick }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      // Gentle floating animation
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={onClick}
      onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
      onPointerOut={(e) => (document.body.style.cursor = 'auto')}
      scale={node.scale}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
      
      {/* Agent label */}
      <Html distanceFactor={10}>
        <div className="bg-black/70 px-2 py-1 rounded text-xs whitespace-nowrap text-white">
          {node.name}
          {node.activity > 0 && <span className="ml-1 text-green-400">●</span>}
        </div>
      </Html>
    </mesh>
  );
};

// Connection Line Component
const ConnectionLine = ({ start, end, opacity }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#3B82F6" opacity={opacity} transparent />
    </line>
  );
};

// Business Objectives Panel
const BusinessObjectivesPanel = ({ businessMetrics }) => (
  <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4 text-blue-400">Business Objectives</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-sm text-gray-400">Revenue Target</div>
        <div className="text-2xl font-bold text-green-400">$50,000</div>
        <div className="text-xs text-gray-500">Year 1 Goal</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-sm text-gray-400">Domain Status</div>
        <div className="text-lg font-bold text-blue-400">artifactvirtual.com</div>
        <div className="text-xs text-gray-500">Registered & Active</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-sm text-gray-400">Website Launch</div>
        <div className="text-lg font-bold text-orange-400">July 30th</div>
        <div className="text-xs text-gray-500">Target Date</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-sm text-gray-400">LinkedIn Presence</div>
        <div className="text-lg font-bold text-blue-400">July 10th</div>
        <div className="text-xs text-gray-500">Establishment Date</div>
      </div>
    </div>
  </div>
);

// Department Activities Panel
const DepartmentPanel = ({ departmentActivities }) => (
  <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4 text-purple-400">Department Activities</h3>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {departmentActivities.slice(0, 10).map((activity, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-sm capitalize">{activity.department}</div>
              <div className="text-xs text-gray-400">{activity.activity_type}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              activity.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              {activity.status}
            </div>
          </div>
          <div className="text-sm text-gray-300 mt-2">{activity.description}</div>
        </div>
      ))}
    </div>
  </div>
);

// Workflow Panel with clickable workflows
const WorkflowPanel = ({ workflowData }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-green-400">Active Workflows</h3>
      <div className="space-y-3">
        {workflowData.slice(0, 5).map((workflow, index) => (
          <div 
            key={index} 
            className="bg-gray-800/50 rounded-lg p-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold">{workflow.workflow_name}</div>
              <div className={`px-2 py-1 rounded text-xs ${
                workflow.status === 'completed' ? 'bg-green-600' : 
                workflow.status === 'running' ? 'bg-blue-600' : 'bg-yellow-600'
              } text-white`}>
                {workflow.status}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Started: {new Date(workflow.started_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Workflow Details Modal */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedWorkflow(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-lg w-full m-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-green-400">Workflow Details</h4>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Name</div>
                  <div className="font-semibold">{selectedWorkflow.workflow_name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400">Status</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs ${
                    selectedWorkflow.status === 'completed' ? 'bg-green-600' : 
                    selectedWorkflow.status === 'running' ? 'bg-blue-600' : 'bg-yellow-600'
                  } text-white`}>
                    {selectedWorkflow.status}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400">Started</div>
                  <div>{new Date(selectedWorkflow.started_at).toLocaleString()}</div>
                </div>
                
                {selectedWorkflow.completed_at && (
                  <div>
                    <div className="text-sm text-gray-400">Completed</div>
                    <div>{new Date(selectedWorkflow.completed_at).toLocaleString()}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-gray-400">Source</div>
                  <div className="capitalize">{selectedWorkflow.source || 'Enterprise'}</div>
                </div>
                
                {selectedWorkflow.result && (
                  <div>
                    <div className="text-sm text-gray-400">Result</div>
                    <div className="text-sm bg-gray-800 rounded p-2 mt-1">
                      {selectedWorkflow.result}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-gray-400">ID</div>
                  <div className="text-xs font-mono">{selectedWorkflow.id}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// System Health Panel
const SystemHealthPanel = ({ systemMessages, agentDepartments }) => {
  const totalAgents = Object.values(agentDepartments).flat().length;
  const activeAgents = new Set(systemMessages.map(msg => msg.target_agent)).size;
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-red-400">System Health</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{activeAgents}</div>
          <div className="text-sm text-gray-400">Active Agents</div>
          <div className="text-xs text-gray-500">of {totalAgents} total</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{systemMessages.length}</div>
          <div className="text-sm text-gray-400">Messages</div>
          <div className="text-xs text-gray-500">Recent Activity</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Recent Messages</div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {systemMessages.slice(0, 3).map((msg, index) => (
            <div key={index} className="bg-gray-800/30 rounded p-2 text-xs">
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
    const recentActivity = systemMessages.find(msg => 
      msg.target_agent === agentName.toLowerCase().replace('agent', '_agent') ||
      msg.source_agent === agentName.toLowerCase().replace('agent', '_agent')
    );
    
    const allMessages = systemMessages.filter(msg => 
      msg.target_agent === agentName.toLowerCase().replace('agent', '_agent') ||
      msg.source_agent === agentName.toLowerCase().replace('agent', '_agent')
    );
    
    return {
      name: agentName,
      recentActivity,
      allMessages,
      messageCount: allMessages.length,
      isActive: !!recentActivity
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
            {agents.map((agentName) => {
              const agentDetails = getAgentDetails(agentName);
              
              return (
                <div 
                  key={agentName} 
                  className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  onClick={() => setSelectedAgent(agentDetails)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{agentName}</div>
                    <div className={`w-3 h-3 rounded-full ${
                      agentDetails.isActive ? 'bg-green-400' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {agentDetails.isActive ? 'Recently Active' : 'Standby'}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Messages: {agentDetails.messageCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Agent Details Modal */}
      <AnimatePresence>
        {selectedAgent && (
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
                
                {selectedAgent.allMessages.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Recent Messages</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedAgent.allMessages.slice(0, 5).map((msg, index) => (
                        <div key={index} className="bg-gray-800 rounded p-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{msg.source_agent} → {msg.target_agent}</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-sm">{msg.message_type}</div>
                          {msg.payload && (
                            <div className="text-xs text-gray-500 mt-1">
                              {JSON.stringify(JSON.parse(msg.payload), null, 2).slice(0, 100)}...
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
        )}
      </AnimatePresence>
    </div>
  );
};

// Supporting Data Panel (Compact API Data)
const SupportingDataPanel = ({ apiData }) => (
  <div className="p-4 h-full overflow-y-auto">
    <h3 className="text-lg font-bold mb-4 text-gray-300">Supporting Data</h3>
    
    {/* Market Data (Compact) */}
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
    
    {/* Weather (Compact) */}
    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
      <div className="text-sm font-semibold text-blue-400 mb-2">Environment</div>
      <div className="text-xs">
        <div>Weather: Sunny, 24°C</div>
        <div>AQI: Good (45)</div>
        <div>UV Index: Moderate</div>
      </div>
    </div>
    
    {/* News Feed (Compact) */}
    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
      <div className="text-sm font-semibold text-purple-400 mb-2">News Pulse</div>
      <div className="text-xs space-y-2">
        <div className="text-gray-300">AI Market Growth Continues...</div>
        <div className="text-gray-300">Enterprise Automation Trends...</div>
        <div className="text-gray-300">Technology Investment Surge...</div>
      </div>
    </div>
    
    {/* System Status */}
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

// Agent Details Component
const AgentDetails = ({ agent, onClose }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-bold">{agent.name}</h4>
      <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
    </div>
    
    <div className="space-y-3">
      <div>
        <div className="text-sm text-gray-400">Department</div>
        <div className="capitalize">{agent.department}</div>
      </div>
      
      <div>
        <div className="text-sm text-gray-400">Status</div>
        <div className={`${agent.activity > 0 ? 'text-green-400' : 'text-gray-400'}`}>
          {agent.activity > 0 ? 'Active' : 'Standby'}
        </div>
      </div>
      
      <div>
        <div className="text-sm text-gray-400">Activity Level</div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
              style={{ width: `${Math.min(agent.activity * 20, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs">{agent.activity}</span>
        </div>
      </div>
      
      <div>
        <div className="text-sm text-gray-400">Capabilities</div>
        <div className="text-xs text-gray-300">
          {agent.type === 'department' ? 'Meta-coordination, Resource allocation' : 
           'Task execution, Data processing, Decision making'}
        </div>
      </div>
    </div>
  </div>
);

export default EnterpriseCommandCenter;
