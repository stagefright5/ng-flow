import { Component, ViewChild } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Flow, PromoteEventObject } from 'ng-flow-lib';
import { FlowComponent } from 'ng-flow-lib';
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
			to: [
				"second",
				"fourth"
			],
			data: {
				"hey": "fuck you"
			}
		},
		{
			wheels: [
				{
					icon: 'assets/asterisk.svg'
					// descriptionPanel: 'ss'
				}
			],
			id: "second",
			from: [
				"fourth"
			],
			to: [
				"second",
				{
					id: "fourth",
					path: "grid"
				}
			]
			// width: 150,
			// height: 100
		},
		{
			wheels: [
				{
					descriptionPanel: WheelDescPanelComponent,
					data: {
						"hello": "fuck you too"
					}
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: DescPanelComponent
					// descriptionPanel: 'ss'
				}
			],
			id: "third",
			from: [
				'second'
			]
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
			to: [
				'first'
			],
			from: [
				'third'
			]
			// width: 150,
			// height: 180
		},
		{
			component: DescPanelComponent,
			// to: [
			// 	'first'
			// ],
			id: 'fourth',
			wheels: [
				{
					descriptionPanel: WheelDescPanelComponent,
					data: {
						"hello": "fuck you too fourth time"
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
		},
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
					component: DescPanelComponent,
					data: {
						"any": "data"
					},
					wheels: [
						{
							icon: 'assets/asterisk.svg',
							descriptionPanel: WheelDescPanelComponent,
							data: {
								"oneMore": "Fuck you!" 
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
					data: "that is after a wheel config in a node"

				},
				{
					wheels: [
						{
							descriptionPanel: WheelDescPanelComponent,
							data: {
								"fuckYou": "For life"
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
					wheels: [
						{
							descriptionPanel: WheelDescPanelComponent,
							data: {
								"nonCussWords": [
									{"greetings": [
										"hi", "hello", "GM!"
									]},
									{
										"farewells": [
											"goodbye", "tata"
										]
									}
								],
								"cussWords": "fuck, shit, motherfucker"
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
