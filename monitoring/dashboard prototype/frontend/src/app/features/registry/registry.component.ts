import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ApiEndpoint } from '../../shared/models';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {
  apis: ApiEndpoint[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApis();
  }

  private async loadApis(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      const response = await this.apiService.get<ApiEndpoint[]>('/registry/apis');
      if (response.success && response.data) {
        this.apis = response.data;
      } else {
        this.error = response.error || 'Failed to load APIs';
      }

    } catch (error) {
      this.error = 'Failed to load APIs';
      console.error('API registry load error:', error);
    } finally {
      this.loading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'green';
      case 'standby': return 'orange';
      case 'disabled': return 'gray';
      case 'error': return 'red';
      default: return 'gray';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'check_circle';
      case 'standby': return 'pause_circle';
      case 'disabled': return 'cancel';
      case 'error': return 'error';
      default: return 'help';
    }
  }

  refreshApis(): void {
    this.loadApis();
  }

  addNewApi(): void {
    // TODO: Implement add API dialog
    console.log('Add new API');
  }

  editApi(api: ApiEndpoint): void {
    // TODO: Implement edit API dialog
    console.log('Edit API:', api);
  }

  deleteApi(api: ApiEndpoint): void {
    // TODO: Implement delete API confirmation
    console.log('Delete API:', api);
  }

  testApi(api: ApiEndpoint): void {
    // TODO: Implement API test
    console.log('Test API:', api);
  }
}
