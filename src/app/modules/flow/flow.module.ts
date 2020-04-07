import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowComponent } from './components/flow/flow.component';
import { NodeComponent } from './components/node/node.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayService } from './services/overlay.service';
import { DynamicComponentService } from './services/dynamic-component.service';
import { LeaderLineService } from './services/leader-line.service';
import { PositionService } from './services/position.service';
import { DESC_PANEL_DATA } from './utils/constants';

declare global { var LeaderLine: any; };

@NgModule({
	declarations: [
		FlowComponent,
		NodeComponent,
		WheelComponent
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		OverlayModule
	],
	exports: [
		FlowComponent,
		NodeComponent,
		WheelComponent
	],
	entryComponents: [
		NodeComponent
	],
	providers: [
		OverlayService,
		DynamicComponentService,
		LeaderLineService,
		PositionService,
		{
			provide: DESC_PANEL_DATA,
			useValue: {}
		}
	],
})
export class FlowModule { }
