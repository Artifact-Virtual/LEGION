import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdaptersRoutingModule } from './adapters-routing.module';
import { AdaptersComponent } from './adapters.component';

@NgModule({
  declarations: [AdaptersComponent],
  imports: [SharedModule, AdaptersRoutingModule]
})
export class AdaptersModule { }
