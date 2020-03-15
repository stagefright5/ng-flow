import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Train } from '../TypeDefs';
import { DescPanelComponent } from '../desc-panel/desc-panel.component';

@Component({
	selector: 'train,[flow]',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {
	@Output('promote') addNewCoachEvtEmitter = new EventEmitter();
	@Input() trainData: Train.Caoches = [];
	constructor() { }

	ngOnInit(): void {
	}

	emitPromeEvt(event: any, i: number) {
		if (i + 1 === this.trainData.length) {
			this.addNewCoachEvtEmitter.emit({
				...event,
				index: i
			})
		}
	}

}
