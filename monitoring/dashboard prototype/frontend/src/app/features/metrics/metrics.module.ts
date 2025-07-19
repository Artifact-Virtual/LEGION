import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsComponent } from './metrics.component';

@NgModule({
  declarations: [
    MetricsComponent
  ],
  imports: [
    SharedModule,
    MetricsRoutingModule
  ]
})
export class MetricsModule { }
