import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl || 'http://localhost:8000';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request - returns Promise<ApiResponse<T>> for easier async/await usage
   */
  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        retry(1),
        map(data => ({
          success: true,
          data,
          timestamp: new Date()
        } as ApiResponse<T>)),
        catchError(error => {
          const apiError: ApiResponse<T> = {
            success: false,
            error: this.getErrorMessage(error),
            timestamp: new Date()
          };
          return Promise.resolve(apiError);
        })
      ).toPromise() as Promise<ApiResponse<T>>;
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        map(responseData => ({
          success: true,
          data: responseData,
          timestamp: new Date()
        } as ApiResponse<T>)),
        catchError(error => {
          const apiError: ApiResponse<T> = {
            success: false,
            error: this.getErrorMessage(error),
            timestamp: new Date()
          };
          return Promise.resolve(apiError);
        })
      ).toPromise() as Promise<ApiResponse<T>>;
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        map(responseData => ({
          success: true,
          data: responseData,
          timestamp: new Date()
        } as ApiResponse<T>)),
        catchError(error => {
          const apiError: ApiResponse<T> = {
            success: false,
            error: this.getErrorMessage(error),
            timestamp: new Date()
          };
          return Promise.resolve(apiError);
        })
      ).toPromise() as Promise<ApiResponse<T>>;
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        retry(1),
        map(responseData => ({
          success: true,
          data: responseData,
          timestamp: new Date()
        } as ApiResponse<T>)),
        catchError(error => {
          const apiError: ApiResponse<T> = {
            success: false,
            error: this.getErrorMessage(error),
            timestamp: new Date()
          };
          return Promise.resolve(apiError);
        })
      ).toPromise() as Promise<ApiResponse<T>>;
  }

  /**
   * Get error message from HTTP error
   */
  private getErrorMessage(error: any): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    } else {
      // Server-side error
      return `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }

  /**
   * Error handling (legacy for Observable-based methods)
   */
  private handleError(error: any) {
    const errorMessage = this.getErrorMessage(error);
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  /**
   * Check if API is healthy
   */
  async healthCheck(): Promise<ApiResponse<{status: string}>> {
    return this.get<{status: string}>('/api/health');
  }

  // Logs API methods
  async getLogs(params: {level?: string, search?: string, limit?: number} = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params.level) queryParams.append('level', params.level);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const endpoint = `/api/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.get<any[]>(endpoint);
  }

  // Metrics API methods
  async getMetrics(params: {timeRange?: string, source?: string} = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params.timeRange) queryParams.append('time_range', params.timeRange);
    if (params.source) queryParams.append('source', params.source);
    
    const endpoint = `/api/metrics${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.get<any[]>(endpoint);
  }

  // Reports API methods
  async getReports(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/reports');
  }

  async generateReport(reportData: {name: string, type: string, timeRange: string}): Promise<ApiResponse<any>> {
    return this.post<any>('/api/reports', reportData);
  }

  async deleteReport(reportId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/api/reports/${reportId}`);
  }

  // Automation API methods
  async getAutomations(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/automation');
  }

  async createAutomation(automationData: any): Promise<ApiResponse<any>> {
    return this.post<any>('/api/automation', automationData);
  }

  async updateAutomation(automationId: string, automationData: any): Promise<ApiResponse<any>> {
    return this.put<any>(`/api/automation/${automationId}`, automationData);
  }

  async deleteAutomation(automationId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/api/automation/${automationId}`);
  }

  // Adapters API methods
  async getAdapters(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/adapters');
  }

  async registerAdapter(adapterData: any): Promise<ApiResponse<any>> {
    return this.post<any>('/api/adapters/register', adapterData);
  }

  async testAdapterConnection(adapterId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/adapters/${adapterId}/test`, {});
  }

  async removeAdapter(adapterId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/api/adapters/${adapterId}`);
  }

  // Registry API methods
  async getRegisteredApis(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/api/registry');
  }

  async registerApi(apiData: any): Promise<ApiResponse<any>> {
    return this.post<any>('/api/registry', apiData);
  }

  async updateApiStatus(apiId: string, status: string): Promise<ApiResponse<any>> {
    return this.put<any>(`/api/registry/${apiId}/status`, { status });
  }

  async removeApi(apiId: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`/api/registry/${apiId}`);
  }

  // System API methods
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.get<any>('/api/system/status');
  }

  async getSystemInfo(): Promise<ApiResponse<any>> {
    return this.get<any>('/api/system/info');
  }
}
