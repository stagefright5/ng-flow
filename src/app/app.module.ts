import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlowComponent } from './components/flow/flow.component';
import { NodeComponent } from './components/node/node.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DescPanelComponent } from './components/desc-panel/desc-panel.component';
import { DESC_PANEL_DATA } from './utils/cutom-tokens';

@NgModule({
	declarations: [
		AppComponent,
		FlowComponent,
		NodeComponent,
		WheelComponent,
		DescPanelComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		OverlayModule
	],
	entryComponents: [
		DescPanelComponent,
		NodeComponent
	],
	schemas: [
		NO_ERRORS_SCHEMA
	],
	providers: [
		{
			provide: DESC_PANEL_DATA,
			useValue: DESC_PANEL_DATA
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
