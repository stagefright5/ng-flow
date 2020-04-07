import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../../utils/TypeDefs';
import { CONST_SELECTORS } from '../../utils/constants';

@Component({
	selector: CONST_SELECTORS.WHEEL,
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss']
})
export class WheelComponent {
	@Input() wheelData: Node.Wheel;
}
