import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, interval, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Metric, MetricSeries, MetricQuery, AdapterStatus } from '../../shared/models';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  metrics: Metric[] = [];
  metricSeries: MetricSeries[] = [];
  adapters: AdapterStatus[] = [];
  
  filterForm: FormGroup;
  loading = false;
  error: string | null = null;
  autoRefresh = false;

  // Chart options
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'System Metrics'
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM DD'
          }
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      source: [''],
      timeRange: ['1h'],
      aggregation: ['avg'],
      interval: ['5m'],
      autoRefresh: [false]
    });
  }

  ngOnInit(): void {
    this.loadAdapters();
    this.loadMetrics();
    
    // Subscribe to form changes
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadMetrics());

    // Handle auto-refresh
    this.filterForm.get('autoRefresh')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(autoRefresh => {
        this.autoRefresh = autoRefresh;
        if (autoRefresh) {
          interval(30000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.loadMetrics());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadAdapters(): Promise<void> {
    try {
      const response = await this.apiService.get<AdapterStatus[]>('/adapters');
      if (response.success && response.data) {
        this.adapters = response.data.filter(a => a.status === 'connected');
      }
    } catch (error) {
      console.error('Failed to load adapters:', error);
    }
  }

  private async loadMetrics(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      const formValue = this.filterForm.value;
      const query: MetricQuery = {
        source: formValue.source || undefined,
        timeRange: this.getTimeRange(formValue.timeRange),
        aggregation: formValue.aggregation,
        interval: formValue.interval
      };

      const response = await this.apiService.post<Metric[]>('/metrics/query', query);
      if (response.success && response.data) {
        this.metrics = response.data;
        this.processMetricsForChart();
      } else {
        this.error = response.error || 'Failed to load metrics';
      }

    } catch (error) {
      this.error = 'Failed to load metrics';
      console.error('Metrics load error:', error);
    } finally {
      this.loading = false;
    }
  }

  private getTimeRange(range: string): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    
    switch (range) {
      case '15m':
        start.setMinutes(now.getMinutes() - 15);
        break;
      case '1h':
        start.setHours(now.getHours() - 1);
        break;
      case '6h':
        start.setHours(now.getHours() - 6);
        break;
      case '24h':
        start.setHours(now.getHours() - 24);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      default:
        start.setHours(now.getHours() - 1);
    }
    
    return { start, end: now };
  }

  private processMetricsForChart(): void {
    // Group metrics by name for chart display
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push({
        timestamp: metric.timestamp,
        value: metric.value
      });
      return acc;
    }, {} as { [key: string]: Array<{ timestamp: Date; value: number }> });

    this.metricSeries = Object.entries(grouped).map(([name, data]) => ({
      name,
      data: data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
      metadata: {
        unit: this.metrics.find(m => m.name === name)?.unit,
        type: 'line' as const
      }
    }));
  }

  refreshMetrics(): void {
    this.loadMetrics();
  }

  exportMetrics(): void {
    // TODO: Implement metrics export
    console.log('Exporting metrics...');
  }

  createAlert(): void {
    // TODO: Implement alert creation
    console.log('Creating alert...');
  }
}
