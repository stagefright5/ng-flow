import { Component, OnInit, Inject } from "@angular/core";
import { DESC_PANEL_DATA } from "ng-flow-lib";

@Component({
	selector: "app-desc-panel",
	templateUrl: "./desc-panel.component.html",
	styleUrls: ["./desc-panel.component.scss"]
})
export class DescPanelComponent implements OnInit {
	constructor(@Inject(DESC_PANEL_DATA) public data: any) {
		console.log("injectedData::", this.data);
	}

	Array(n: number) {
		return Array.from({ length: n || 0 });
	}
	ngOnInit() {}
}
