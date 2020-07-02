import { Component, OnInit, Inject } from '@angular/core';
import { NODE_DATA } from 'ng-flow-lib';

@Component({
	selector: 'app-desc-panel',
	templateUrl: './desc-panel.component.html',
	styleUrls: ['./desc-panel.component.scss']
})
export class DescPanelComponent implements OnInit {
	constructor(@Inject(NODE_DATA) public data: any) {
		console.log('node data::', this.data);
	}

	Array(n: number) {
		return Array.from({ length: n || 0 });
	}
	ngOnInit() {}
}
