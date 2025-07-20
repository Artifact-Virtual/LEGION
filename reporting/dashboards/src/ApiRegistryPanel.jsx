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
    fetch('/api/registry', { headers: { Authorization: 'Bearer admin-token-123' } })
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

  if (loading) return <div>Loading API registry...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-900">API Registry</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search APIs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-artifact-400"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-artifact-400"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No APIs match your criteria.</div>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Base URL</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((api, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b font-medium">{api.name}</td>
                <td className="px-4 py-2 border-b text-blue-600 break-all">{api.base_url}</td>
                <td className="px-4 py-2 border-b max-w-xs truncate" title={api.description}>{api.description}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${api.status === 'active' ? 'bg-green-100 text-green-700' : api.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                    {api.status || 'unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
