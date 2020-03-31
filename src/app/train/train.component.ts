import { Component, OnInit, Input, Output, EventEmitter, NgZone, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, OnChanges } from '@angular/core';
import { Train, Coach } from '../TypeDefs';
import { LeaderLineService } from '../leader-line.service';
import { DynamicComponentService } from '../dynamic-component.service';
import { CoachComponent } from '../coach/coach.component';
@Component({
	selector: 'train,[flow]',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
	@Output('promote') promoterCoachClickEvtEmitter = new EventEmitter();
	@Input() trainData: Train.Caoches = [];
	@ViewChild('coaches', { read: ViewContainerRef, static: true }) coachesContanerRef: ViewContainerRef;
	coachIdPrefix = 'coach_no_';
	gap = 5;
	coachDimension: Coach.Dimension = { width: 15, height: 18 };
	constructor(private leaderLinesService: LeaderLineService,
		private dynamicCompService: DynamicComponentService) { }

	ngOnInit(): void {
		// TODO: Subscribe for media changes and "renderCoaches" again
		// this.leaderLinesService.subscribeToMediaChange();
	}

	emitPromeEvt = (event: any) => {
		if (event.coachData.index + 1 === this.trainData.length) {
			this.promoterCoachClickEvtEmitter.emit(event)
		}
	}

	getCoachData(index: number) {
		return ({
			...(this.trainData[index]),
			index
		});
	}

	ngAfterViewInit() {
		this._renderCoaches();
	}

	ngOnChanges(changes) {
		console.log(changes);
		if (!changes.trainData.firstChange && changes.trainData && changes.trainData.currentValue !== changes.trainData.previousValue && changes.trainData.currentValue.length) {
			this._renderCoaches(changes.trainData.currentValue);
		}
	}

	private _renderCoaches(coaches?: Train.Caoches) {
		const coachesToRender = coaches || this.trainData;
		coachesToRender.forEach(this._renderCoach);
	}

	private _renderCoach = (coach: Coach.Data, i: number) => {
		this.dynamicCompService.addCoach({
			train: this.coachesContanerRef,
			component: CoachComponent,
			uniqueId: this.coachIdPrefix + i,
			inputBindings: {
				position: this.getCoordinates(i),
				coachData: { ...coach, index: i },
				dimension: this.coachDimension,
				promoteEvtCbFn: this.emitPromeEvt
			},
			outputBindings: {
				coachAdded: () => {
					if (i > 0) {
						this.onCoachAdd(coach, i)
					}
				}
			}
		});
	}

	onCoachAdd(e: Coach.Data, i: number) {
		this.leaderLinesService.drawConnector({
			start: this.coachIdPrefix + (i - 1),
			end: this.coachIdPrefix + (i)
		});
	}

	getCoordinates(i): Coach.Position {
		return ({ left: (i * (this.gap + this.coachDimension.width)), top: 0 });
	}

	ngOnDestroy() {
		this.leaderLinesService.subs.unsubscribe();
	}
}
