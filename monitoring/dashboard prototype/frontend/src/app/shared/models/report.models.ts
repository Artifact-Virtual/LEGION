// Report-related models
export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'scheduled' | 'on-demand' | 'alert-based';
  format: 'pdf' | 'html' | 'csv' | 'json';
  template: string;
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  recipients?: string[];
  dataQuery: any;
  status: 'active' | 'paused' | 'error';
  lastGenerated?: Date;
  nextScheduled?: Date;
  tags?: string[];
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  outputUrl?: string;
  error?: string;
  metadata?: any;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  format: 'pdf' | 'html' | 'csv' | 'json';
  template: string;
  requiredParameters: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
    defaultValue?: any;
  }>;
  tags?: string[];
}
