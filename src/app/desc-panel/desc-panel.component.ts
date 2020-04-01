import { Component, OnInit, AfterViewInit, Inject, OnChanges } from '@angular/core';
import { DESC_PANEL_DATA } from '../utils/cutom-tokens';

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
