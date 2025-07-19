import React, { useState, useEffect } from 'react';

const AgentActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/agent-activities');
        if (!response.ok) {
          throw new Error('Failed to fetch agent activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
        // Fallback mock data
        setActivities([
          {
            id: 1,
            agentName: 'Marketing Agent',
            activity: 'Campaign Analysis',
            status: 'Completed',
            timestamp: new Date().toISOString(),
            duration: '2m 34s'
          },
          {
            id: 2,
            agentName: 'Finance Agent',
            activity: 'Budget Review',
            status: 'In Progress',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            duration: '5m 12s'
          },
          {
            id: 3,
            agentName: 'Operations Agent',
            activity: 'System Health Check',
            status: 'Completed',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            duration: '1m 45s'
          },
          {
            id: 4,
            agentName: 'Security Agent',
            activity: 'Threat Monitoring',
            status: 'Active',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            duration: '15m 20s'
          },
          {
            id: 5,
            agentName: 'HR Agent',
            activity: 'Employee Onboarding',
            status: 'Pending',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            duration: '3m 08s'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': 
      case 'in progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Activity</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Agent Activity</h3>
        {error && (
          <p className="text-sm text-red-600 mt-1">
            Using mock data - API unavailable
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.agentName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{activity.activity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {activities.length === 0 && !loading && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No agent activities found</p>
        </div>
      )}
    </div>
  );
};

export default AgentActivityTable;
