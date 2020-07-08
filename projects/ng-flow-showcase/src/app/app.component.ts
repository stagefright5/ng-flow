import { Component, ViewChild } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Flow, FlowComponent, PromoteEventObject } from 'ng-flow-lib';
import { WheelDescPanelComponent } from './wheel-desc-panel/wheel-desc-panel.component';

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
			height: 85,
			id: 'first',
			to: ['second', /* 'fourth' */],
			data: {
				hey: 'fuck you'
			}
		},
		{
			component: DescPanelComponent,
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			id: 'second',
			// from: ['fourth'],
			to: [
				'third',
				// {
				// 	id: 'fifth',
				// 	path: 'grid'
				// }
			]
			// width: 150,
			// height: 100
		},
		{
			wheels: [
				{
					descriptionPanel: WheelDescPanelComponent,
					data: {
						hello: 'fuck you too'
					}
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			],
			id: 'third',
			to: ['fourth'],
			// from: ['fifth']
			// width: 150,
			// height: 220
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			to: ['fifth'],
			id: 'fourth'
			// from: ['third']
			// width: 150,
			// height: 180
		},
		{
			component: DescPanelComponent,
			// to: [
			// 	'first'
			// ],
			id: 'fifth',
			wheels: [
				{
					descriptionPanel: WheelDescPanelComponent,
					data: {
						hello: 'fuck you too fourth time'
					}
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			]
			// width: 150,
			// height: 180
		}
		// {
		// 	wheels: [
		// 		{
		// 			descriptionPanel: WheelDescPanelComponent
		// 		},
		// 		{
		// 			icon: 'assets/arrow-right.svg',
		// 			promoter: true
		// 			// descriptionPanel: DescPanelComponent
		// 			// descriptionPanel: 'ss'
		// 		}
		// 	],
		// 	to: [
		// 		'first'
		// 	]
		// 	// width: 150,
		// 	// height: 180
		// },
		// {
		// 	wheels: [
		// 		{
		// 			icon: 'assets/asterisk.svg'
		// 			// descriptionPanel: 'ss'
		// 		}
		// 	]
		// 	// width: 150,
		// 	// height: 180
		// },
		// {
		// 	component: DescPanelComponent
		// 	// width: 150,
		// 	// height: 180
		// },
		// {
		// 	wheels: [
		// 		{
		// 			descriptionPanel: WheelDescPanelComponent
		// 		},
		// 		{
		// 			icon: 'assets/arrow-right.svg',
		// 			promoter: true
		// 			// descriptionPanel: DescPanelComponent
		// 			// descriptionPanel: 'ss'
		// 		}
		// 	]
		// 	// width: 150,
		// 	// height: 180
		// }
	];

	onPromoteHandler(e: PromoteEventObject) {
		console.log('onPromoteHandler::', e);
		if (e.nodeConfig.index === this.nodes.length - 1)
			this.nodes.push(
				{
					id: Math.random() + '',
					component: DescPanelComponent,
					data: {
						any: 'data'
					},
					wheels: [
						{
							icon: 'assets/asterisk.svg',
							descriptionPanel: WheelDescPanelComponent,
							data: {
								oneMore: 'Fuck you!'
							}
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
						}
					],
					lastNode: true
				},
				{
					id: Math.random() + '',
					wheels: [
						{
							descriptionPanel: WheelDescPanelComponent
						},
						{
							icon: 'assets/arrow-right.svg',
							promoter: true
							// descriptionPanel: DescPanelComponent
							// descriptionPanel: 'ss'
						}
					],
					component: DescPanelComponent,
					data: 'that is after a wheel config in a node'
				},
				{
					id: Math.random() + '',
					wheels: [
						{
							descriptionPanel: WheelDescPanelComponent,
							data: {
								fuckYou: 'For life'
							}
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
					id: Math.random() + '',
					wheels: [
						{
							descriptionPanel: WheelDescPanelComponent,
							data: {
								nonCussWords: [
									{ greetings: ['hi', 'hello', 'GM!'] },
									{
										farewells: ['goodbye', 'tata']
									}
								],
								cussWords: 'fuck, shit, motherfucker'
							}
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

	updateNodeData(flow: FlowComponent) {
		flow.updateNodesData([
			{
				id: 'second',
				width: 250,
				height: 85,
				// component: undefined,
				data: {
					any: 'data'
				},
				wheels: [
					{
						icon: 'assets/asterisk.svg',
						descriptionPanel: WheelDescPanelComponent,
						data: {
							oneMore: 'Fuck you!'
						}
					},
					{
						icon: 'assets/arrow-right.svg',
						promoter: true
					}
				],
			},
			{
				// component: DescPanelComponent,
				width: 250,
				height: 300,
				id: 'first',
				to: ['second', /* 'fourth' */],
				data: {
					hey: 'fuck you'
				}
			}
		]);
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
