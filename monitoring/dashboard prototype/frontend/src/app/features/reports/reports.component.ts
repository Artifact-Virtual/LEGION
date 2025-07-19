import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Report } from '../../shared/models/report.models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  selectedReportType: string = 'system_health';
  selectedTimeRange: string = '24h';
  displayedColumns: string[] = ['name', 'type', 'created', 'status', 'actions'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    try {
      const response = await this.apiService.getReports();
      this.reports = response.data || [];
    } catch (error) {
      console.error('Error loading reports:', error);
      this.reports = [];
    }
  }

  async generateReport(): Promise<void> {
    try {
      const reportData = {
        name: `${this.selectedReportType}_${Date.now()}`,
        type: this.selectedReportType,
        timeRange: this.selectedTimeRange
      };
      
      const response = await this.apiService.generateReport(reportData);
      if (response.success) {
        await this.loadReports(); // Refresh the list
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  }

  viewReport(report: Report): void {
    // Open report in new tab or modal
    console.log('Viewing report:', report);
  }

  downloadReport(report: Report): void {
    // Trigger download
    console.log('Downloading report:', report);
  }

  async deleteReport(report: Report): Promise<void> {
    try {
      const response = await this.apiService.deleteReport(report.id);
      if (response.success) {
        await this.loadReports(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  }
}
