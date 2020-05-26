import { Component, ViewChild } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Flow } from 'ng-flow-lib';
import { FlowComponent } from 'ng-flow-lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	@ViewChild(FlowComponent, { static: false }) flow: FlowComponent;
	title = 'console-app-deployment-status-ui';
	no = '2';
	from = '1';
	to = '3';
	type: any = 'arc';
	dimension = { width: 250, height: 300 };
	gap = 50;
	con_types = ['straight', 'arc', 'fluid', 'magnet', 'grid'];
	show = true;
	nodes: Flow.Nodes = [
		{
			component: DescPanelComponent,
			width: 250,
			height: 100
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 180
		},
		{
			wheels: [
				{
					descriptionPanel: DescPanelComponent
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 220
		},
		{
			component: DescPanelComponent,
			width: 150,
			height: 180
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 180
		},
		{
			wheels: [
				{
					descriptionPanel: DescPanelComponent
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 180
		},
		{
			component: DescPanelComponent,
			width: 150,
			height: 180
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 180
		},
		{
			wheels: [
				{
					descriptionPanel: DescPanelComponent
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			],
			width: 150,
			height: 180
		}
	];

	onPromoteHandler(e) {
		console.log('onPromoteHandler::', e);
		if (e.nodeData.index === this.nodes.length - 1)
			this.nodes.push(
				{
					wheels: [
						{
							icon: 'assets/asterisk.svg',
							descriptionPanel: DescPanelComponent
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
						}
					],
					lastNode: true
				},
				{
					wheels: [
						{
							descriptionPanel: DescPanelComponent
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
							// descriptionPanel: DescPanelComponent
							// descriptionPanel: 'ss'
						}
					]
				},
				{
					wheels: [
						{
							descriptionPanel: DescPanelComponent
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
							// descriptionPanel: DescPanelComponent
							// descriptionPanel: 'ss'
						}
					]
				},
				{
					wheels: [
						{
							descriptionPanel: DescPanelComponent
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
							// descriptionPanel: DescPanelComponent
							// descriptionPanel: 'ss'
						}
					]
				}
			);
	}

	deleteNode() {
		this.flow.deleteNode(`node_no_${this.no}`);
	}

	drawConnector() {
		this.flow.drawConnector({
			start: `node_no_${this.from}`,
			end: `node_no_${this.to}`,
			path: this.type
		});
	}
}
