import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 150 },
  { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 150 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, renderCell: (params) => {
      const status = params.value || '';
      let color = '#6b7280';
      let bg = '#f3f4f6';
      if (status.toLowerCase() === 'completed') { color = '#16a34a'; bg = '#dcfce7'; }
      else if (status.toLowerCase() === 'active' || status.toLowerCase() === 'in progress') { color = '#2563eb'; bg = '#dbeafe'; }
      else if (status.toLowerCase() === 'pending') { color = '#f59e0b'; bg = '#fef9c3'; }
      else if (status.toLowerCase() === 'error') { color = '#dc2626'; bg = '#fee2e2'; }
      return (
        <span style={{ color, background: bg, borderRadius: 8, padding: '2px 8px', fontWeight: 600, fontSize: 12 }}>
          {status}
        </span>
      );
    }
  },
  { field: 'duration', headerName: 'Duration', flex: 1, minWidth: 100 },
  { field: 'timestamp', headerName: 'Time', flex: 1, minWidth: 120, valueFormatter: (params) => new Date(params.value).toLocaleTimeString() },
];

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
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <div style={{ height: 400, width: '100%' }} className="px-6 py-4">
        <DataGrid
          rows={activities}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            fontFamily: 'inherit',
            border: 0,
            '& .MuiDataGrid-columnHeaders': { background: '#f3f4f6', color: '#374151', fontWeight: 700 },
            '& .MuiDataGrid-cell': { color: '#374151' },
            '& .MuiDataGrid-row:hover': { background: '#f9fafb' },
          }}
        />
      </div>
    </div>
  );
};

export default AgentActivityTable;
