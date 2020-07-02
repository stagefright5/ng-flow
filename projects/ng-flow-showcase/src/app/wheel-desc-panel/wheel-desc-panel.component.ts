import { Component, OnInit, Inject } from '@angular/core';
import { WHEEL_DATA } from 'ng-flow-lib';

@Component({
	selector: 'lib-wheel-desc-panel',
	templateUrl: './wheel-desc-panel.component.html',
	styleUrls: ['./wheel-desc-panel.component.css']
})
export class WheelDescPanelComponent implements OnInit {
	constructor(@Inject(WHEEL_DATA) public data: any) {
		console.log('wheel data::', this.data);
	}

	ngOnInit() {}
}
