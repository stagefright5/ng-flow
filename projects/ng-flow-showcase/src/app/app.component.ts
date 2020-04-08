import { Component } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Flow } from 'ng-flow-lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'console-app-deployment-status-ui';
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
}
