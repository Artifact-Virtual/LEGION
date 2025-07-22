import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiRefreshCw, FiFilter, FiSearch, FiX } from 'react-icons/fi';

const SystemMessageFeed = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const messagesEndRef = useRef(null);

  // Message types for filtering
  const messageTypes = ['all', 'ping', 'pong', 'task_request', 'task_response', 'data_update', 'alert', 'status_update', 'error'];
  
  // Extract unique agents from messages
  const agents = ['all', ...new Set(messages.flatMap(msg => [msg.source_agent, msg.target_agent]).filter(Boolean))];

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enterprise/system-messages');
      if (!response.ok) {
        throw new Error('Failed to fetch system messages');
      }
      const data = await response.json();
      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching system messages:', err);
      setError(err.message);
      
      // Provide mock data for demonstration
      const mockMessages = generateMockMessages();
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock system messages for demonstration
  const generateMockMessages = () => {
    const mockMessages = [];
    const messageTypes = ['ping', 'pong', 'task_request', 'task_response', 'data_update', 'alert', 'status_update'];
    const agents = [
      'financial_analysis_agent', 'content_writing_agent', 'social_media_monitoring_agent',
      'task_scheduling_agent', 'workflow_orchestration_agent', 'resource_optimization_agent',
      'analytics_agent', 'market_analysis_agent', 'compliance_checker_agent'
    ];

    for (let i = 0; i < 50; i++) {
      const sourceAgent = agents[Math.floor(Math.random() * agents.length)];
      let targetAgent = agents[Math.floor(Math.random() * agents.length)];
      while (targetAgent === sourceAgent) {
        targetAgent = agents[Math.floor(Math.random() * agents.length)];
      }
      
      const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
      
      mockMessages.push({
        message_id: `msg_${Date.now()}_${i}`,
        source_agent: sourceAgent,
        target_agent: targetAgent,
        message_type: messageType,
        payload: generateMockPayload(messageType),
        priority: Math.floor(Math.random() * 5) + 1,
        created_at: timestamp.toISOString(),
        status: Math.random() > 0.1 ? 'delivered' : 'pending'
      });
    }

    return mockMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const generateMockPayload = (messageType) => {
    switch (messageType) {
      case 'task_request':
        return { task: 'analyze_market_data', parameters: { symbol: 'AAPL', timeframe: '1d' } };
      case 'task_response':
        return { status: 'completed', result: 'Market analysis complete', execution_time: '2.3s' };
      case 'data_update':
        return { type: 'market_data', updated_records: 1247, timestamp: new Date().toISOString() };
      case 'alert':
        return { level: 'medium', message: 'High CPU usage detected', threshold: '85%' };
      case 'status_update':
        return { status: 'active', cpu_usage: '67%', memory_usage: '42%' };
      default:
        return { response: messageType };
    }
  };

  // Filter messages based on search term, type, and agent
  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.source_agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.target_agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(msg.payload).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.message_type === filterType);
    }

    if (filterAgent !== 'all') {
      filtered = filtered.filter(msg => 
        msg.source_agent === filterAgent || msg.target_agent === filterAgent
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filterType, filterAgent]);

  // Auto-refresh messages
  useEffect(() => {
    fetchMessages();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour12: false });
  };

  const getMessageTypeColor = (messageType) => {
    const colors = {
      ping: 'text-blue-400',
      pong: 'text-green-400',
      task_request: 'text-purple-400',
      task_response: 'text-cyan-400',
      data_update: 'text-yellow-400',
      alert: 'text-red-400',
      status_update: 'text-gray-400',
      error: 'text-red-500'
    };
    return colors[messageType] || 'text-gray-300';
  };

  const getPriorityColor = (priority) => {
    if (priority <= 2) return 'text-red-400';
    if (priority <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterAgent('all');
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiMessageCircle className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">System Message Feed</h3>
          <div className="flex items-center gap-2">
            {!error && (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </>
            )}
            {error && (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-red-400">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh
          </label>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-blue-500"
        >
          {messageTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:border-blue-500"
        >
          {agents.map(agent => (
            <option key={agent} value={agent}>
              {agent === 'all' ? 'All Agents' : agent.replace('_', ' ')}
            </option>
          ))}
        </select>

        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          <FiX className="w-4 h-4" />
          Clear
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded">
          ⚠️ {error} - Showing mock data for demonstration
        </div>
      )}

      {/* Messages List */}
      <div className="bg-gray-800 rounded border border-gray-700 h-96 overflow-y-auto">
        {loading && filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages found
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredMessages.map((msg) => (
              <div
                key={msg.message_id}
                className="bg-gray-900/50 rounded p-3 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(msg.created_at)}
                    </span>
                    <div className={`w-1 h-1 rounded-full ${getPriorityColor(msg.priority)}`}></div>
                    <span className="text-xs text-gray-500">P{msg.priority}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      msg.status === 'delivered' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${getMessageTypeColor(msg.message_type)}`}>
                    {msg.message_type.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-300 font-mono">
                    {msg.source_agent}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="text-sm text-green-300 font-mono">
                    {msg.target_agent}
                  </span>
                </div>

                <div className="text-xs text-gray-400 bg-gray-800/50 rounded p-2 font-mono">
                  {JSON.stringify(msg.payload, null, 2)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <span>
          Showing {filteredMessages.length} of {messages.length} messages
        </span>
        <span>
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default SystemMessageFeed;
