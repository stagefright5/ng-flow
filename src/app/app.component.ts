import { Component } from '@angular/core';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { Train } from './TypeDefs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'console-app-deployment-status-ui';
	coaches: Train.Caoches = [
		{
			titles: {
				'Train Name': 'h4'
			}
		},
		{
			titles: {
				'Abnxbnxc': 'c1',
				'AasdadKjasdh': 'c2',
				'Aasdad Kjasdh': 'c3'
			},
			wheels: [
				{
					icon: 'assets/asterisk.svg',
					// descriptionPanel: 'ss'
				}
			]
		},
		{
			titles: {
				'Abnxbnxc': 'c1',
			},
			wheels: [
				{
					descriptionPanel: DescPanelComponent
				},
				{
					icon: 'assets/arrow-right.svg',
					promoter: true
					// descriptionPanel: 'ss'
				}
			]
		}
	];

	onPromoteHandler(e) {
		console.log('onPromoteHandler::', e);
		this.coaches.push({
			titles: {
				'Last akhs': 'c1',
				'Second sdh': 'c2',
				'Aasdad Kjasdh': 'c3'
			},
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
			lastCoach: true
		})
	}
}
