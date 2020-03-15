import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Coach } from '../TypeDefs'
@Component({
	selector: 'coach',
	templateUrl: './coach.component.html',
	styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {

	@Input() trainName: string;
	@Input() wheels: Array<Coach.Wheel>;
	@Output() promote: EventEmitter<Coach.promoteEvent>;

	constructor() { }

	ngOnInit(): void {
	}

}
