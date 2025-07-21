import React, { useEffect, useState } from 'react';
import AgentHealthDashboard from './AgentHealthDashboard';
import WeatherDashboard from './components/WeatherDashboard';
import ThreeDVisualization from './ThreeDVisualization';
import SecurityHealthPanel from './SecurityHealthPanel';

export default function ApiSidebar() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/registry')
      .then(res => res.json())
      .then(data => {
        setApis(data.apis || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Unable to fetch API registry');
        setLoading(false);
      });
  }, []);

  return (
    <aside className={`min-h-screen bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-200 ${collapsed ? 'w-16 p-2' : 'w-80 p-4'} overflow-y-auto`} style={{ maxWidth: collapsed ? '4rem' : '20rem', minWidth: collapsed ? '4rem' : '16rem' }}>
      <button
        className="text-gray-400 hover:text-white mb-2 focus:outline-none"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
        )}
      </button>
      {!collapsed && (
        <div className="flex flex-col gap-4" style={{ maxWidth: '18rem' }}>
          <h2 className="text-base font-semibold text-white mb-2">System Overview</h2>
          <div className="mb-4"><AgentHealthDashboard /></div>
          <div className="mb-4"><WeatherDashboard /></div>
          <div className="mb-4"><ThreeDVisualization /></div>
          <div className="mb-4"><SecurityHealthPanel /></div>
          <h2 className="text-base font-semibold text-white mb-2">API Registry</h2>
          {loading && <div className="text-gray-400">Loading APIs...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !error && apis.length === 0 && (
            <div className="text-gray-500">No APIs found.</div>
          )}
          <ul className="overflow-y-auto max-h-96 pr-2">
            {apis.map((api, i) => (
              <li key={i} className="mb-3">
                <div className="text-sm text-white font-medium">{api.name}</div>
                <div className="text-xs text-blue-400 break-all">{api.base_url}</div>
                <div className="text-xs text-gray-400">{api.description}</div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${api.status === 'active' ? 'bg-green-900 text-green-300 border border-green-700' : api.status === 'inactive' ? 'bg-red-900 text-red-300 border border-red-700' : 'bg-gray-800 text-gray-300 border border-gray-600'}`}>{api.status || 'unconfirmed'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
