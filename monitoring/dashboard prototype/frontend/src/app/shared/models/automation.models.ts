// Automation-related models
export interface AutomationScript {
  id: string;
  name: string;
  description?: string;
  type: 'python' | 'bash' | 'powershell' | 'javascript' | 'custom';
  script: string;
  parameters?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'file';
    required: boolean;
    defaultValue?: any;
    description?: string;
  }>;
  triggers?: Array<{
    type: 'schedule' | 'webhook' | 'metric-threshold' | 'log-pattern';
    config: any;
  }>;
  status: 'active' | 'paused' | 'error';
  lastExecuted?: Date;
  tags?: string[];
}

export interface AutomationExecution {
  id: string;
  scriptId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input?: any;
  output?: any;
  logs?: string;
  error?: string;
  triggeredBy: 'manual' | 'schedule' | 'webhook' | 'threshold' | 'pattern';
}

export interface AutomationTrigger {
  id: string;
  scriptId: string;
  type: 'schedule' | 'webhook' | 'metric-threshold' | 'log-pattern';
  config: any;
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}
