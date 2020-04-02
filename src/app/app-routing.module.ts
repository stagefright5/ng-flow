import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowComponent } from './components/flow/flow.component';


const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'home', component: FlowComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
