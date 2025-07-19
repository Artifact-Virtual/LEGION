import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AdapterConfig } from '../../shared/models/adapter.models';

@Component({
  selector: 'app-adapters',
  templateUrl: './adapters.component.html',
  styleUrls: ['./adapters.component.scss']
})
export class AdaptersComponent implements OnInit {
  adapters: AdapterConfig[] = [];
  newAdapterName: string = '';
  selectedAdapterType: string = 'sqlite';
  connectionString: string = '';
  displayedColumns: string[] = ['name', 'type', 'status', 'lastCheck', 'actions'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAdapters();
  }

  async loadAdapters(): Promise<void> {
    try {
      const response = await this.apiService.getAdapters();
      this.adapters = response.data || [];
    } catch (error) {
      console.error('Error loading adapters:', error);
      this.adapters = [];
    }
  }

  async addAdapter(): Promise<void> {
    if (!this.newAdapterName.trim() || !this.connectionString.trim()) {
      return;
    }

    try {
      const adapterData = {
        name: this.newAdapterName,
        type: this.selectedAdapterType,
        connection_string: this.connectionString,
        enabled: true
      };
      
      const response = await this.apiService.registerAdapter(adapterData);
      if (response.success) {
        this.newAdapterName = '';
        this.connectionString = '';
        await this.loadAdapters(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding adapter:', error);
    }
  }

  async testConnection(adapter: AdapterConfig): Promise<void> {
    try {
      // Update status to testing
      adapter.status = 'testing';
      
      const response = await this.apiService.testAdapterConnection(adapter.id);
      if (response.success) {
        await this.loadAdapters(); // Refresh to get updated status
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      adapter.status = 'error';
    }
  }

  async toggleAdapter(adapter: AdapterConfig): Promise<void> {
    try {
      // Toggle between connected and disconnected status
      const newStatus = adapter.status === 'connected' ? 'disconnected' : 'connected';
      console.log('Toggling adapter status to:', newStatus);
      // Note: You might need to add an update adapter endpoint to the API
      await this.loadAdapters(); // Refresh the list
    } catch (error) {
      console.error('Error toggling adapter:', error);
    }
  }

  editAdapter(adapter: AdapterConfig): void {
    // Open edit dialog/modal
    console.log('Editing adapter:', adapter);
  }

  async removeAdapter(adapter: AdapterConfig): Promise<void> {
    try {
      const response = await this.apiService.removeAdapter(adapter.id);
      if (response.success) {
        await this.loadAdapters(); // Refresh the list
      }
    } catch (error) {
      console.error('Error removing adapter:', error);
    }
  }
}
