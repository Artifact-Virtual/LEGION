import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

// Custom hook for WebSocket real-time data
export function useWebSocket(url = 'ws://localhost:8080', options = {}) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;

  const connect = useCallback(() => {
    try {
      const newSocket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        ...options
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected to', url);
      });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', reason);
        
        // Auto-reconnect logic
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect
          return;
        }
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
            connect();
          }, delay);
        }
      });

      newSocket.on('connect_error', (err) => {
        setError(err.message);
        setIsConnected(false);
      });

      // Listen for data updates
      newSocket.on('data', (data) => {
        setLastMessage({ type: 'data', payload: data, timestamp: Date.now() });
      });

      newSocket.on('metrics', (metrics) => {
        setLastMessage({ type: 'metrics', payload: metrics, timestamp: Date.now() });
      });

      newSocket.on('alerts', (alerts) => {
        setLastMessage({ type: 'alerts', payload: alerts, timestamp: Date.now() });
      });

      newSocket.on('agent_status', (status) => {
        setLastMessage({ type: 'agent_status', payload: status, timestamp: Date.now() });
      });

      setSocket(newSocket);
    } catch (err) {
      setError(err.message);
    }
  }, [url, options, maxReconnectAttempts]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connect]);

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    lastMessage,
    error,
    emit,
    reconnectAttempts: reconnectAttempts.current
  };
}

// Real-time data context
import React, { createContext, useContext, useReducer } from 'react';

const RealTimeContext = createContext();

const initialState = {
  metrics: {
    cpu: 0,
    memory: 0,
    network: 0,
    agents_online: 0
  },
  alerts: [],
  agentStatus: {},
  systemHealth: {},
  lastUpdated: null
};

function realTimeReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
        lastUpdated: Date.now()
      };
    
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts.slice(0, 9)], // Keep last 10
        lastUpdated: Date.now()
      };
    
    case 'UPDATE_AGENT_STATUS':
      return {
        ...state,
        agentStatus: { ...state.agentStatus, ...action.payload },
        lastUpdated: Date.now()
      };
    
    case 'UPDATE_SYSTEM_HEALTH':
      return {
        ...state,
        systemHealth: { ...state.systemHealth, ...action.payload },
        lastUpdated: Date.now()
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function RealTimeProvider({ children, wsUrl = 'ws://localhost:8080' }) {
  const [state, dispatch] = useReducer(realTimeReducer, initialState);
  const { lastMessage, isConnected, error } = useWebSocket(wsUrl);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'metrics':
          dispatch({ type: 'UPDATE_METRICS', payload: lastMessage.payload });
          break;
        case 'alerts':
          dispatch({ type: 'ADD_ALERT', payload: lastMessage.payload });
          break;
        case 'agent_status':
          dispatch({ type: 'UPDATE_AGENT_STATUS', payload: lastMessage.payload });
          break;
        case 'data':
          // Handle general data updates
          if (lastMessage.payload.systemHealth) {
            dispatch({ type: 'UPDATE_SYSTEM_HEALTH', payload: lastMessage.payload.systemHealth });
          }
          break;
      }
    }
  }, [lastMessage]);

  const value = {
    ...state,
    isConnected,
    error,
    dispatch
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTimeData() {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeProvider');
  }
  return context;
}

// Connection status indicator component
export function ConnectionStatus() {
  const { isConnected, error } = useRealTimeData();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
      }`} />
      <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
        {isConnected ? 'Live' : error ? 'Disconnected' : 'Connecting...'}
      </span>
      {error && (
        <span className="text-xs text-gray-400" title={error}>
          ({error.substring(0, 20)}...)
        </span>
      )}
    </div>
  );
}

// Fallback simulator for when WebSocket is not available
export function useSimulatedData(interval = 3000) {
  const [data, setData] = useState({
    metrics: {
      cpu: Math.floor(Math.random() * 30 + 20),
      memory: Math.floor(Math.random() * 40 + 30),
      network: Math.floor(Math.random() * 1000 + 500),
      agents_online: Math.floor(Math.random() * 3 + 16)
    },
    lastUpdated: Date.now()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => ({
        metrics: {
          cpu: Math.max(0, Math.min(100, prev.metrics.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, prev.metrics.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(0, prev.metrics.network + (Math.random() - 0.5) * 200),
          agents_online: Math.max(14, Math.min(18, prev.metrics.agents_online + Math.floor((Math.random() - 0.5) * 3)))
        },
        lastUpdated: Date.now()
      }));
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return data;
}
