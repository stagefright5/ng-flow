import { Component } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Flow } from 'ng-flow-lib';
import { FlowComponent } from 'ng-flow-lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'console-app-deployment-status-ui';
	no = '2';
	from = '1';
	to = '3';
	type: any = 'arc';
	nodes: Flow.Nodes = [
		{
			component: DescPanelComponent
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg',
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
					promoter: true,
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			]
		}, {
			component: DescPanelComponent
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg',
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
					promoter: true,
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			]
		}, {
			component: DescPanelComponent
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg',
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
					promoter: true,
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			]
		}
	];

	onPromoteHandler(e) {
		console.log('onPromoteHandler::', e);
		if (e.nodeData.index === this.nodes.length - 1)
			this.nodes.push({
				wheels: [
					{
						icon: 'assets/asterisk.svg',
						descriptionPanel: DescPanelComponent
					},
					{
						icon: 'assets/arrow-right.svg',
						promoter: true,
					},
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
							promoter: true,
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
							promoter: true,
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
							promoter: true,
							// descriptionPanel: DescPanelComponent
							// descriptionPanel: 'ss'
						}
					]
				});
	}

	deleteNode(flow) {
		flow.deleteNode('node_no_' + this.no);
	}

	drawConnector(flow: FlowComponent) {
		flow.drawConnector({ start: `node_no_${this.from}` as any, end: `node_no_${this.to}` as any, path: this.type })
	}
}
