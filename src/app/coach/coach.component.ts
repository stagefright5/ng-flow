import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Coach } from '../TypeDefs'
@Component({
	selector: 'coach',
	templateUrl: './coach.component.html',
	styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {
	@Input() coachData: Coach.Data = {};
	@Output('promote') promoterWheelClickedEmitter: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	emitPromoterWheelClicked(e) {
		if (!this.coachData.lastCoach) {
			this.promoterWheelClickedEmitter.emit({
				...e,
				coachData: this.coachData
			});
		}
	}

}
