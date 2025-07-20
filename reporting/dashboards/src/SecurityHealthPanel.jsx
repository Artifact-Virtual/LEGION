import React from 'react';

// Modern, React 19-compatible Security Health Panel
export default function SecurityHealthPanel() {
  // Placeholder data, replace with real security metrics as needed
  const securityStatus = [
    { label: 'Firewall', status: 'Active', color: 'bg-green-500' },
    { label: 'Intrusion Detection', status: 'Monitoring', color: 'bg-yellow-500' },
    { label: 'Vulnerabilities', status: '0 Critical', color: 'bg-green-500' },
    { label: 'Last Scan', status: '2 hours ago', color: 'bg-blue-500' },
    { label: 'Threats Blocked', status: '15', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Security Health Panel</h3>
      <ul className="space-y-3">
        {securityStatus.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="text-gray-300">{item.label}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color} text-white`}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
