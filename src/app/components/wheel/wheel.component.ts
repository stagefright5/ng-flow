import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../../utils/TypeDefs';
import { OverlayService } from '../../services/overlay.service';

@Component({
	selector: 'wheel',
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements OnInit {

	@Input() wheelData: Node.Wheel;
	@Output('promote') newNodeAdderWheelEvtEmitter = new EventEmitter();
	constructor(private overlayService: OverlayService) { }

	ngOnInit(): void {
	}

	// TODO: Might have to be removed. No one is invoking this;
	// onWheelClick(event: MouseEvent) {
	// 	if (this.wheelData.descriptionPanel) {
	// 		this.overlayService.open(<HTMLElement>event.target, this.wheelData.descriptionPanel, this.wheelData);
	// 	} else {
	// 		if (this.wheelData.promoter) {
	// 			this.newNodeAdderWheelEvtEmitter.emit({
	// 				wheelData: this.wheelData
	// 			});
	// 		}
	// 	}
	// }

}
