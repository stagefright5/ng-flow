import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../../utils/typings';
import { Selectors } from '../../utils/constants';

@Component({
	selector: Selectors.WHEEL,
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent {
	@Input() wheelData: Node.Wheel;
}
