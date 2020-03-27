import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Train, Coach } from '../TypeDefs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
@Component({
	selector: 'train,[flow]',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {
	@Output('promote') promoterCoachClickEvtEmitter = new EventEmitter();
	@Input() trainData: Train.Caoches = [];
	connectors = {};
	leaderLineDrawOptions = {
		path: 'grid',
		startSocket: 'right',
		endSocket: 'auto'
	};
	subs = new Subscription();
	coachIdPrefix = 'coach_no_';
	constructor(private zone: NgZone, private mediaObserver: MediaObserver) { }

	ngOnInit(): void {
		this.subscribeToMediaChange();
	}

	emitPromeEvt(event: any, i: number) {
		if (i + 1 === this.trainData.length) {
			this.promoterCoachClickEvtEmitter.emit({
				...event,
				index: i
			})
		}
	}

	onCoachAdd(e: Coach.Data, i: number) {
		this.drawConnector({
			start: this.coachIdPrefix + (i - 1),
			end: this.coachIdPrefix + (i)
		})
	}

	drawConnector(opts: { start: string, end: string, path?: string, startSocket?: string, endSocket?: string }) {
		const startEndObj = {
			start: document.getElementById(opts.start),
			end: document.getElementById(opts.end)
		}
		this.zone.runOutsideAngular(() => {
			setTimeout(() => {
				this.connectors[opts.start] = new LeaderLine(Object.assign(this.leaderLineDrawOptions, opts, startEndObj));
			});
		});
	}

	subscribeToMediaChange() {
		this.subs.add(this.mediaObserver.media$.subscribe((mChange: MediaChange) => {
			this.zone.runOutsideAngular(() => {
				setTimeout(() => {
					if (mChange.mqAlias === 'xs' && mChange.matches) {
						this.setSockets('bottom', 'top');
					} else {
						this.setSockets('right', 'left');
					}
				})
			})
		}));
	}

	private setSockets(start: string, end: string, line?: any) {
		if (line) {
			line.startSocket = start;
			line.endSocket = end;
		} else {
			const lines = Object.values(this.connectors);
			// AnimEvent.add(() => {
			lines.forEach((line: any) => {
				line.startSocket = start;
				line.endSocket = end;
			});
			// });
		}

	}
}
