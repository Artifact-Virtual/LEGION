// System-related models
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: number;
  version: string;
  timestamp: Date;
  components: SystemComponent[];
  metrics: {
    totalAdapters: number;
    activeAdapters: number;
    totalApis: number;
    activeApis: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
}

export interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  message?: string;
  lastCheck: Date;
  dependencies?: string[];
}

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network?: {
    bytesIn: number;
    bytesOut: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  acknowledged: boolean;
  resolvedAt?: Date;
  metadata?: any;
}

export interface SystemConfiguration {
  [key: string]: any;
}
