import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdaptersComponent } from './adapters.component';

const routes: Routes = [
  { path: '', component: AdaptersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdaptersRoutingModule { }
