import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Legion Monitoring Dashboard</span>
    </mat-toolbar>
    <main class="p-8 bg-gray-50 min-h-screen">
      <monitoring-dashboard></monitoring-dashboard>
    </main>
  `,
  styles: [``]
})
export class AppComponent {}
