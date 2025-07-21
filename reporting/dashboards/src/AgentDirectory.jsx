import React, { useEffect, useState } from 'react';

export default function AgentDirectory() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Unable to fetch agent directory');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400">Loading agents...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Agent Directory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div key={agent.agent_id} className="bg-black border border-gray-800 rounded-lg p-4 flex flex-col gap-2">
            <div className="text-sm text-gray-400">{agent.department}</div>
            <div className="text-lg font-semibold text-white">{agent.agent_type.replace(/_/g, ' ')}</div>
            <div className={`text-xs px-2 py-1 rounded-full font-semibold ${agent.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-gray-800 text-gray-400'}`}>{agent.status}</div>
            {agent.current_task && (
              <div className="text-xs text-blue-400">Task: {agent.current_task}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
