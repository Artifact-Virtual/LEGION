import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AutomationScript } from '../../shared/models/automation.models';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {
  automations: AutomationScript[] = [];
  newAutomationName: string = '';
  selectedTriggerType: string = 'schedule';
  selectedActionType: string = 'email';
  displayedColumns: string[] = ['name', 'trigger', 'action', 'status', 'lastRun', 'actions'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAutomations();
  }

  async loadAutomations(): Promise<void> {
    try {
      const response = await this.apiService.getAutomations();
      this.automations = response.data || [];
    } catch (error) {
      console.error('Error loading automations:', error);
      this.automations = [];
    }
  }

  async createAutomation(): Promise<void> {
    if (!this.newAutomationName.trim()) {
      return;
    }

    try {
      const automationData = {
        name: this.newAutomationName,
        trigger_type: this.selectedTriggerType,
        action_type: this.selectedActionType,
        status: 'active'
      };
      
      const response = await this.apiService.createAutomation(automationData);
      if (response.success) {
        this.newAutomationName = '';
        await this.loadAutomations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating automation:', error);
    }
  }

  async toggleAutomation(automation: AutomationScript): Promise<void> {
    try {
      const newStatus = automation.status === 'active' ? 'paused' : 'active';
      const response = await this.apiService.updateAutomation(automation.id, { 
        ...automation, 
        status: newStatus 
      });
      if (response.success) {
        await this.loadAutomations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  }

  editAutomation(automation: AutomationScript): void {
    // Open edit dialog/modal
    console.log('Editing automation:', automation);
  }

  async deleteAutomation(automation: AutomationScript): Promise<void> {
    try {
      const response = await this.apiService.deleteAutomation(automation.id);
      if (response.success) {
        await this.loadAutomations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  }
}
