import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 150 },
  { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 150 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, renderCell: (params) => {
      const status = params.value || '';
      let color = '#9ca3af';
      let bg = '#1f2937';
      if (status.toLowerCase() === 'completed') { color = '#10b981'; bg = '#064e3b'; }
      else if (status.toLowerCase() === 'active' || status.toLowerCase() === 'in progress') { color = '#3b82f6'; bg = '#1e3a8a'; }
      else if (status.toLowerCase() === 'pending') { color = '#f59e0b'; bg = '#78350f'; }
      else if (status.toLowerCase() === 'error') { color = '#ef4444'; bg = '#7f1d1d'; }
      return (
        <span style={{ 
          color, 
          background: bg, 
          borderRadius: 8, 
          padding: '4px 12px', 
          fontWeight: 600, 
          fontSize: 12,
          border: `1px solid ${color}40`
        }}>
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
        const response = await fetch('http://localhost:5001/api/agent-activities');
        if (!response.ok) {
          throw new Error('Failed to fetch agent activities');
        }
        const data = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Agent Activity</h3>
          <div className="flex items-center space-x-2">
            {!error && (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Real-time Data</span>
              </>
            )}
            {error && (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-red-400">Data Unavailable</span>
              </>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>
      <div style={{ height: 400, width: '100%' }} className="px-6 py-4 bg-black">
        <DataGrid
          rows={activities}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            fontFamily: 'inherit',
            border: 0,
            backgroundColor: '#000000',
            '& .MuiDataGrid-columnHeaders': { 
              background: '#111111', 
              color: '#ffffff', 
              fontWeight: 700,
              borderBottom: '1px solid #1f2937'
            },
            '& .MuiDataGrid-cell': { 
              color: '#e5e7eb',
              borderBottom: '1px solid #1f2937'
            },
            '& .MuiDataGrid-row:hover': { 
              background: '#1f2937' 
            },
            '& .MuiDataGrid-footerContainer': {
              background: '#111111',
              color: '#9ca3af',
              borderTop: '1px solid #1f2937'
            },
            '& .MuiTablePagination-root': {
              color: '#9ca3af'
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#000000'
            }
          }}
        />
      </div>
    </div>
  );
};

export default AgentActivityTable;
