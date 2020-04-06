import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescPanelComponent } from './components/desc-panel/desc-panel.component';
import { FlowModule } from './modules/flow-module/flow.module';

@NgModule({
	declarations: [],
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
