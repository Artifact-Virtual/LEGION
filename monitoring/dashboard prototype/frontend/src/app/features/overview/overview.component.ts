import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { SystemStatus, AdapterStatus, SystemAlert } from '../../shared/models';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  systemStatus: SystemStatus | null = null;
  adapters: AdapterStatus[] = [];
  alerts: SystemAlert[] = [];
  loading = true;
  error: string | null = null;

  // Quick stats
  totalMetrics = 0;
  totalLogs = 0;
  activeAlerts = 0;
  systemHealth = 'unknown';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Refresh data every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadDashboardData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      // Load system status
      const statusResponse = await this.apiService.get<SystemStatus>('/system/status');
      if (statusResponse.success && statusResponse.data) {
        this.systemStatus = statusResponse.data;
        this.systemHealth = statusResponse.data.status;
      }

      // Load adapters
      const adaptersResponse = await this.apiService.get<AdapterStatus[]>('/adapters');
      if (adaptersResponse.success && adaptersResponse.data) {
        this.adapters = adaptersResponse.data;
      }

      // Load recent alerts
      const alertsResponse = await this.apiService.get<SystemAlert[]>('/system/alerts?limit=5');
      if (alertsResponse.success && alertsResponse.data) {
        this.alerts = alertsResponse.data;
        this.activeAlerts = alertsResponse.data.filter(a => !a.acknowledged).length;
      }

      // Calculate quick stats
      this.calculateQuickStats();

    } catch (error) {
      this.error = 'Failed to load dashboard data';
      console.error('Dashboard load error:', error);
    } finally {
      this.loading = false;
    }
  }

  private calculateQuickStats(): void {
    // These would be calculated based on actual data
    this.totalMetrics = this.adapters.reduce((sum, adapter) => 
      sum + (adapter.metrics?.dataPoints || 0), 0);
    
    // Placeholder calculations - would integrate with actual metrics/logs APIs
    this.totalLogs = 0; // Would be calculated from logs API
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'orange';
      case 'critical': case 'error': return 'red';
      default: return 'gray';
    }
  }

  getAdapterStatusIcon(status: string): string {
    switch (status) {
      case 'connected': return 'check_circle';
      case 'disconnected': return 'cancel';
      case 'error': return 'error';
      case 'testing': return 'hourglass_empty';
      default: return 'help';
    }
  }

  acknowledgeAlert(alert: SystemAlert): void {
    // TODO: Implement alert acknowledgment
    console.log('Acknowledging alert:', alert.id);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Template helper methods
  getConnectedAdaptersCount(): number {
    return this.adapters.filter(a => a.status === 'connected').length;
  }

  getAdaptersCount(): number {
    return this.adapters.length;
  }

  getErrorAdaptersCount(): number {
    return this.adapters.filter(a => a.status === 'error').length;
  }

  getWarningAlertsCount(): number {
    return this.alerts.filter(a => a.type === 'warning').length;
  }

  getErrorAlertsCount(): number {
    return this.alerts.filter(a => a.type === 'error').length;
  }

  getCriticalAlertsCount(): number {
    return this.alerts.filter(a => a.type === 'critical').length;
  }

  getActiveAlertsCount(): number {
    return this.alerts.filter(a => !a.acknowledged).length;
  }

  getRecentMetrics(): any[] {
    // Return mock data for now
    return [];
  }

  getRecentLogs(): any[] {
    // Return mock data for now  
    return [];
  }

  getSystemUptimePercent(): number {
    return this.systemStatus?.uptime || 0;
  }

  getCpuUsagePercent(): number {
    return this.systemStatus?.metrics?.cpuUsage || 0;
  }

  getMemoryUsagePercent(): number {
    return this.systemStatus?.metrics?.memoryUsage || 0;
  }

  getDiskUsagePercent(): number {
    // Return 0 for now since disk usage is not in the current SystemStatus model
    return 0;
  }
}
