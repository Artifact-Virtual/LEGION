import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RegistryRoutingModule } from './registry-routing.module';
import { RegistryComponent } from './registry.component';

@NgModule({
  declarations: [
    RegistryComponent
  ],
  imports: [
    SharedModule,
    RegistryRoutingModule
  ]
})
export class RegistryModule { }
