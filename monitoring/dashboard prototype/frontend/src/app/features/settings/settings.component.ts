import { Component, OnInit } from '@angular/core';

interface DashboardSettings {
  dashboardTitle: string;
  refreshInterval: number;
  defaultTimeRange: string;
  theme: string;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  enableSoundAlerts: boolean;
  emailAddress: string;
  showGridLines: boolean;
  enableAnimations: boolean;
  compactMode: boolean;
  chartHeight: number;
  enableDebugMode: boolean;
  enableApiLogging: boolean;
  apiTimeout: number;
  maxLogEntries: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: DashboardSettings = {
    dashboardTitle: 'Enterprise Monitoring Dashboard',
    refreshInterval: 30,
    defaultTimeRange: '1h',
    theme: 'light',
    enableNotifications: true,
    enableEmailAlerts: false,
    enableSoundAlerts: true,
    emailAddress: '',
    showGridLines: true,
    enableAnimations: true,
    compactMode: false,
    chartHeight: 400,
    enableDebugMode: false,
    enableApiLogging: false,
    apiTimeout: 5000,
    maxLogEntries: 1000
  };

  constructor() { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('dashboard-settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings(): void {
    // Save settings to localStorage or API
    localStorage.setItem('dashboard-settings', JSON.stringify(this.settings));
    console.log('Settings saved:', this.settings);
  }

  resetSettings(): void {
    // Reset to default values
    this.settings = {
      dashboardTitle: 'Enterprise Monitoring Dashboard',
      refreshInterval: 30,
      defaultTimeRange: '1h',
      theme: 'light',
      enableNotifications: true,
      enableEmailAlerts: false,
      enableSoundAlerts: true,
      emailAddress: '',
      showGridLines: true,
      enableAnimations: true,
      compactMode: false,
      chartHeight: 400,
      enableDebugMode: false,
      enableApiLogging: false,
      apiTimeout: 5000,
      maxLogEntries: 1000
    };
    this.saveSettings();
  }

  exportSettings(): void {
    // Export settings as JSON file
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'dashboard-settings.json';
    link.click();
  }

  importSettings(): void {
    // Open file picker to import settings
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            this.settings = { ...this.settings, ...importedSettings };
            this.saveSettings();
            console.log('Settings imported successfully');
          } catch (error) {
            console.error('Error importing settings:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}
