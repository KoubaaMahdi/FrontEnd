import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import InterfaceComponent from './components/interface/interface.component';
import { InterfaceAdminComponent } from './components/interface-admin/interface-admin.component';

const routes: Routes = [ { path: '', component: LoginComponent },
{ path: 'chat', component: InterfaceComponent },
{ path: 'admin', component: InterfaceAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
