import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Enterprise Monitoring Dashboard';
  sidenavOpened = true;

  menuItems = [
    { name: 'System Overview', icon: 'dashboard', route: '/overview' },
    { name: 'Metrics', icon: 'show_chart', route: '/metrics' },
    { name: 'Logs', icon: 'receipt_long', route: '/logs' },
    { name: 'Reports', icon: 'assessment', route: '/reports' },
    { name: 'Automation', icon: 'smart_toy', route: '/automation' },
    { name: 'API Registry', icon: 'api', route: '/registry' },
    { name: 'Data Sources', icon: 'storage', route: '/adapters' },
    { name: 'Settings', icon: 'settings', route: '/settings' }
  ];

  ngOnInit(): void {
    // Initialize any startup logic here
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
