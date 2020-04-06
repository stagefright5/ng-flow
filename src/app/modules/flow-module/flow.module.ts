import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
import { FlowComponent } from './components/flow/flow.component';
import { NodeComponent } from './components/node/node.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { DescPanelComponent } from 'src/app/components/desc-panel/desc-panel.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DESC_PANEL_DATA } from './utils/cutom-tokens';
import { OverlayModule } from '@angular/cdk/overlay';



@NgModule({
	declarations: [
		AppComponent,
		FlowComponent,
		NodeComponent,
		WheelComponent,
		DescPanelComponent
	],
	imports: [
		CommonModule,
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
})
export class FlowModule { }
