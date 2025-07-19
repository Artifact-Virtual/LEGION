// Metric-related models
export interface Metric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  timestamp: Date;
  source: string;
  tags?: { [key: string]: string };
  metadata?: any;
}

export interface MetricSeries {
  name: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
  metadata?: {
    unit?: string;
    color?: string;
    type?: 'line' | 'bar' | 'area';
  };
}

export interface MetricQuery {
  source?: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
  interval?: string; // '1m', '5m', '1h', etc.
  filters?: { [key: string]: any };
  groupBy?: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  layout?: any;
  isDefault?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'log' | 'table' | 'custom';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  config: any;
  dataSource?: string;
}
