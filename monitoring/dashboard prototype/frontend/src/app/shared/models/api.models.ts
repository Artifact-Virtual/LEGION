// API-related models
export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: { [key: string]: string };
  authentication?: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
  status: 'active' | 'standby' | 'disabled' | 'error';
  lastTested?: Date;
  responseTime?: number;
  tags?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  duration?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
