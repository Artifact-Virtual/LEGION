import React, { useEffect, useState } from 'react';

export default function ApiRegistryPanel() {
  const [registry, setRegistry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5001/api/registry', { headers: { Authorization: 'Bearer admin-token-123' } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch API registry');
        return res.json();
      })
      .then(data => setRegistry(data.apis || data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = registry.filter(api => {
    const matchesSearch =
      api.name?.toLowerCase().includes(search.toLowerCase()) ||
      api.base_url?.toLowerCase().includes(search.toLowerCase()) ||
      api.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (api.status || "unknown") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="text-white">Loading API registry...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="text-red-400">Error: {error}</div>
    </div>
  );

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-white">API Registry</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search APIs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No APIs match your criteria.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-800 text-sm">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 border-b border-gray-800 text-left text-white font-semibold">Name</th>
                <th className="px-4 py-3 border-b border-gray-800 text-left text-white font-semibold">Base URL</th>
                <th className="px-4 py-3 border-b border-gray-800 text-left text-white font-semibold">Description</th>
                <th className="px-4 py-3 border-b border-gray-800 text-left text-white font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((api, i) => (
                <tr key={i} className="hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3 border-b border-gray-800 font-medium text-white">{api.name}</td>
                  <td className="px-4 py-3 border-b border-gray-800 text-blue-400 break-all">{api.base_url}</td>
                  <td className="px-4 py-3 border-b border-gray-800 max-w-xs truncate text-gray-300" title={api.description}>{api.description}</td>
                  <td className="px-4 py-3 border-b border-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      api.status === 'active' ? 'bg-green-900 text-green-300 border border-green-700' : 
                      api.status === 'inactive' ? 'bg-red-900 text-red-300 border border-red-700' : 
                      'bg-gray-800 text-gray-300 border border-gray-600'
                    }`}>
                      {api.status || 'unconfirmed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
