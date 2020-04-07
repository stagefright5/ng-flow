import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescPanelComponent } from './components/desc-panel/desc-panel.component';
import { FlowModule } from './modules/flow/flow.module';

@NgModule({
	declarations: [
		AppComponent,
		DescPanelComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FlowModule
	],
	entryComponents: [
		DescPanelComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
