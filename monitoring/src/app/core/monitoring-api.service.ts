import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonitoringApiService {
  constructor(private http: HttpClient) {}

  getRealTimeMetrics(): Observable<any> {
    // Replace with your real API endpoint
    return interval(2000).pipe(
      switchMap(() => this.http.get('/api/monitoring/metrics')),
      shareReplay(1)
    );
  }

  getSystemHealth(): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.http.get('/api/monitoring/health')),
      shareReplay(1)
    );
  }

  getSecurityEvents(): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.http.get('/api/monitoring/security')),
      shareReplay(1)
    );
  }

  getReports(): Observable<any> {
    return this.http.get('/api/monitoring/reports');
  }
}
