import { NgModule } from '@angular/core';
import { FlowComponent } from './components/flow/flow.component';
import { NodeComponent } from './components/node/node.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
	declarations: [FlowComponent, NodeComponent, WheelComponent],
	imports: [OverlayModule, CommonModule, FlexLayoutModule],
	exports: [FlowComponent, NodeComponent, WheelComponent],
	entryComponents: [NodeComponent],
	providers: [],
})
export class FlowModule {}
