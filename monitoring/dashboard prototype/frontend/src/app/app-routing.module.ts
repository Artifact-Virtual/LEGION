import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadChildren: () => import('./features/overview/overview.module').then(m => m.OverviewModule)
  },
  {
    path: 'metrics',
    loadChildren: () => import('./features/metrics/metrics.module').then(m => m.MetricsModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./features/logs/logs.module').then(m => m.LogsModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'automation',
    loadChildren: () => import('./features/automation/automation.module').then(m => m.AutomationModule)
  },
  {
    path: 'registry',
    loadChildren: () => import('./features/registry/registry.module').then(m => m.RegistryModule)
  },
  {
    path: 'adapters',
    loadChildren: () => import('./features/adapters/adapters.module').then(m => m.AdaptersModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
  },
  { path: '**', redirectTo: '/overview' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: undefined
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
