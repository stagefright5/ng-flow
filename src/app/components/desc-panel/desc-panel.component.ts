import { Component, OnInit, Inject } from '@angular/core';
import { DESC_PANEL_DATA } from 'src/app/modules/flow/utils/constants';

@Component({
	selector: 'app-desc-panel',
	templateUrl: './desc-panel.component.html',
	styleUrls: ['./desc-panel.component.scss']
})
export class DescPanelComponent implements OnInit {

	constructor(@Inject(DESC_PANEL_DATA) public data: any) { }

	ngOnInit(): void {
	}

}
