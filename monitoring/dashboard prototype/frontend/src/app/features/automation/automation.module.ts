import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';

@NgModule({
  declarations: [AutomationComponent],
  imports: [SharedModule, AutomationRoutingModule]
})
export class AutomationModule { }
