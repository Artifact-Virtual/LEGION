import { Component, OnInit } from '@angular/core';
import { MonitoringApiService } from '../core/monitoring-api.service';

@Component({
  selector: 'monitoring-dashboard',
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
          <mat-icon color="primary">speed</mat-icon> Real-Time Metrics
        </h2>
        <ng-container *ngIf="metrics$ | async as metrics; else loadingMetrics">
          <div class="text-2xl font-mono text-blue-700">CPU: {{metrics.cpu}}%</div>
          <div class="text-2xl font-mono text-green-700">RAM: {{metrics.ram}}%</div>
          <div class="text-2xl font-mono text-purple-700">Agents: {{metrics.agentsOnline}} online</div>
        </ng-container>
        <ng-template #loadingMetrics>
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </ng-template>
      </section>
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
          <mat-icon color="primary">health_and_safety</mat-icon> System Health
        </h2>
        <ng-container *ngIf="health$ | async as health; else loadingHealth">
          <div class="text-lg">Status: <span [ngClass]="{'text-green-600': health.status === 'Healthy', 'text-red-600': health.status !== 'Healthy'}">{{health.status}}</span></div>
          <div class="text-gray-500">Uptime: {{health.uptime}}</div>
        </ng-container>
        <ng-template #loadingHealth>
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </ng-template>
      </section>
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
          <mat-icon color="primary">security</mat-icon> Security
        </h2>
        <ng-container *ngIf="security$ | async as security; else loadingSecurity">
          <ul class="list-disc ml-6">
            <li *ngFor="let event of security.events">{{event}}</li>
          </ul>
        </ng-container>
        <ng-template #loadingSecurity>
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </ng-template>
      </section>
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
          <mat-icon color="primary">insights</mat-icon> Reporting & Insights
        </h2>
        <ng-container *ngIf="reports$ | async as reports; else loadingReports">
          <ul class="list-disc ml-6">
            <li *ngFor="let report of reports">{{report.title}}</li>
          </ul>
        </ng-container>
        <ng-template #loadingReports>
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </ng-template>
      </section>
    </div>
  `,
  styles: [``]
})
export class MonitoringDashboardComponent implements OnInit {
  metrics$;
  health$;
  security$;
  reports$;
  constructor(private api: MonitoringApiService) {}
  ngOnInit() {
    this.metrics$ = this.api.getRealTimeMetrics();
    this.health$ = this.api.getSystemHealth();
    this.security$ = this.api.getSecurityEvents();
    this.reports$ = this.api.getReports();
  }
}
