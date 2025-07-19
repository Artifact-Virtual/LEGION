// Adapter-related models
export interface AdapterConfig {
  id: string;
  name: string;
  type: 'sqlite' | 'rest-api' | 'log-file' | 'mysql' | 'postgresql' | 'mongodb' | 'custom';
  connection: { [key: string]: any };
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastConnected?: Date;
  tags?: string[];
  description?: string;
}

export interface AdapterStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastHeartbeat?: Date;
  connectionTime?: number;
  errorMessage?: string;
  metrics?: {
    queries: number;
    dataPoints: number;
    errors: number;
  };
}

export interface ConnectionTestResult {
  success: boolean;
  responseTime?: number;
  error?: string;
  details?: any;
}
