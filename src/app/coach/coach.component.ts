import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Coach } from '../TypeDefs'
@Component({
	selector: 'coach',
	templateUrl: './coach.component.html',
	styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit, AfterViewInit {
	@Input() coachData: Coach.Data = {};
	@Output('promote') promoterWheelClickedEvtEmitter: EventEmitter<any> = new EventEmitter();
	@Output('coachAdded') coachAdded: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.coachAdded.emit(this.coachData);
	}

	emitPromoterWheelClickEvt(e) {
		if (!this.coachData.lastCoach) {
			this.promoterWheelClickedEvtEmitter.emit({
				...e,
				coachData: this.coachData
			});
		}
	}

}
