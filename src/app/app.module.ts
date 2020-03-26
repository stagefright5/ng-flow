import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainComponent } from './train/train.component';
import { CoachComponent } from './coach/coach.component';
import { WheelComponent } from './wheel/wheel.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { DescPanelComponent } from './desc-panel/desc-panel.component';

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
		DescPanelComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
