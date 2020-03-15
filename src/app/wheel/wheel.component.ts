import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Coach } from '../TypeDefs';
import { OverlayService } from '../overlay.service';

@Component({
	selector: 'wheel',
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements OnInit {

	@Input() wheel: Coach.Wheel;
	@Output('promote') newCoachAdderWheelEvtEmitter = new EventEmitter();
	constructor(private overlayService: OverlayService) { }

	ngOnInit(): void {
	}

	onWheelClick(wheelData: Coach.Wheel, event: MouseEvent) {
		if (wheelData.descriptionPanel) {
			this.overlayService.createAndAttachPanel(<HTMLElement>event.target, wheelData.descriptionPanel);
		} else {
			if (wheelData.promoter) {
				this.newCoachAdderWheelEvtEmitter.emit({
					wheelData: this.wheel
				});
			}
		}
	}

}
