import { Component, Input } from '@angular/core';
import { Selectors } from '../../utils/constants';
import { Node } from '../../utils/typings';

@Component({
	selector: Selectors.WHEEL,
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent {
	@Input() wheelData: Node.Wheel;
}
