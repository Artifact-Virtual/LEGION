// Log-related models
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  source: string;
  tags?: { [key: string]: string };
  metadata?: any;
  stack?: string;
}

export interface LogQuery {
  source?: string;
  level?: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  search?: string;
  filters?: { [key: string]: any };
  limit?: number;
  offset?: number;
}

export interface LogStream {
  id: string;
  name: string;
  source: string;
  isActive: boolean;
  filters?: LogQuery;
  lastActivity?: Date;
}
