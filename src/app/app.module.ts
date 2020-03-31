import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainComponent } from './train/train.component';
import { CoachComponent } from './coach/coach.component';
import { WheelComponent } from './wheel/wheel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { DESC_PANEL_DATA } from './cutom-tokens';

@NgModule({
	declarations: [
		AppComponent,
		TrainComponent,
		CoachComponent,
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
		CoachComponent
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
