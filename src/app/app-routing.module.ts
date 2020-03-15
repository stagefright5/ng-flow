import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainComponent } from './train/train.component';


const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'home', component: TrainComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
