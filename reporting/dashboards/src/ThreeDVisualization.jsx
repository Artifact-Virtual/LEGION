import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Line } from '@react-three/drei';
import * as THREE from 'three';

// 3D Agent Node Component
function AgentNode({ position, agent, isActive }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      }
    }
  });

  const color = isActive ? '#00ff00' : hovered ? '#0ea5e9' : '#4a5568';

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </Sphere>
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {agent.name}
      </Text>
    </group>
  );
}

// Connection Lines between agents
function AgentConnections({ agents }) {
  const lines = [];
  
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      if (Math.random() > 0.7) { // Random connections for demo
        lines.push({
          start: agents[i].position,
          end: agents[j].position,
          key: `${i}-${j}`
        });
      }
    }
  }

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.key}
          points={[line.start, line.end]}
          color="#0ea5e9"
          lineWidth={1}
          opacity={0.4}
        />
      ))}
    </>
  );
}

// Main 3D Visualization Component
export default function ThreeDVisualization({ agentData = [] }) {
  const [activeAgents, setActiveAgents] = useState(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgent = Math.floor(Math.random() * agentData.length);
      setActiveAgents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(randomAgent)) {
          newSet.delete(randomAgent);
        } else {
          newSet.add(randomAgent);
        }
        return newSet;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [agentData.length]);

  // Default agent data if none provided
  const defaultAgents = [
    { name: 'CEO Agent', position: [0, 2, 0], department: 'executive' },
    { name: 'Finance', position: [-3, 0, 0], department: 'finance' },
    { name: 'Marketing', position: [3, 0, 0], department: 'marketing' },
    { name: 'Operations', position: [0, -2, 0], department: 'operations' },
    { name: 'Compliance', position: [-2, -2, 2], department: 'compliance' },
    { name: 'Analytics', position: [2, 2, -2], department: 'analytics' },
  ];

  const agents = agentData.length > 0 ? agentData : defaultAgents;

  return (
    <div className="glass-card relative">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold gradient-text">3D Agent Network</h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="status-indicator status-active"></div>
            <span className="text-gray-300">{activeAgents.size} Active</span>
          </div>
        </div>
        
        <div className="h-[600px] rounded-xl overflow-hidden neon-glow">
          <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />
            
            {/* Agents */}
            {agents.map((agent, index) => (
              <AgentNode
                key={index}
                position={agent.position}
                agent={agent}
                isActive={activeAgents.has(index)}
              />
            ))}
            
            {/* Connections */}
            <AgentConnections agents={agents} />
            
            {/* Central Hub */}
            <Box position={[0, 0, 0]} args={[0.5, 0.5, 0.5]}>
              <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} />
            </Box>
            
            <OrbitControls enableZoom enablePan enableRotate />
          </Canvas>
          
          {/* 3D Controls Overlay */}
          <div className="absolute top-4 left-4 glass-card p-3 text-sm">
            <div className="flex items-center space-x-2 mb-2">
              <span className="neon-text">🎮</span>
              <span className="gradient-text font-semibold">Controls</span>
            </div>
            <div className="text-gray-300 space-y-1">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>✨ Active agents pulse</div>
            </div>
          </div>
        </div>
        
        {/* Agent Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {agents.map((agent, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={`status-indicator ${
                activeAgents.has(index) ? 'status-active' : 'status-inactive'
              }`}></div>
              <span className="text-gray-300 truncate">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
