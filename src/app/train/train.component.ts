import { Component, OnInit, Input } from '@angular/core';
import { Train } from '../TypeDefs';

@Component({
	selector: 'train',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

	@Input() coachDataArray: Train.Caoches;

	constructor() { }

	ngOnInit(): void {
	}

}
