import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, OnChanges, DoCheck, ElementRef } from '@angular/core';
import { Train, Coach } from '../utils/TypeDefs';

import { CoachComponent } from '../coach/coach.component';
import { LeaderLineService } from '../services/leader-line.service';
import { DynamicComponentService } from '../services/dynamic-component.service';
import { Position } from '../utils/position';

@Component({
	selector: 'train,[flow]',
	templateUrl: './train.component.html',
	styleUrls: ['./train.component.scss'],
	exportAs: 'flowInstance'
})
export class TrainComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges, DoCheck {
	@Output('promote') promoterCoachClickEvtEmitter = new EventEmitter();
	@Input() flowData: Train.Caoches = [];
	@ViewChild('coaches', { read: ViewContainerRef, static: true }) coachesContanerRef: ViewContainerRef;
	coachIdPrefix = 'coach_no_';
	nodeDimension: Coach.Dimension = { width: 15, height: 18 };
	position: Position;
	private _oldFlowData: Train.Caoches = [];
	constructor(private leaderLinesService: LeaderLineService,
		private dynamicCompService: DynamicComponentService,
		private elmRef: ElementRef) {
		this.position = new Position(this.elmRef, this.nodeDimension);
	}

	ngOnInit(): void {
		// TODO: Subscribe for media changes and "_renderFlow" again
		// this.leaderLinesService.subscribeToMediaChange();
	}

	ngAfterViewInit() {
		// setTimeout(() => {
		// 	this._renderFlow();
		// })
	}


	ngOnChanges(changes) {
		console.log('changed:', changes);
	}

	ngDoCheck() {
		console.log('Do Check Called!');
		if (this._oldFlowData.length < this.flowData.length) {
			console.log('Did Check!');
			this._appendNewNodes();
		}
	}

	emitPromeEvt = (event: any) => {
		if (event.coachData.index + 1 === this.flowData.length) {
			this.promoterCoachClickEvtEmitter.emit(event)
		}
	}

	getCoachData(index: number) {
		return ({
			...(this.flowData[index]),
			index
		});
	}

	private _appendNewNodes() {
		const newNodesToAppend = this.flowData.slice(this._oldFlowData.length, this.flowData.length)
		newNodesToAppend.forEach((node, i) => {
			this._loadFlowNode(node, i + this._oldFlowData.length);
		})
		this._oldFlowData.push(...newNodesToAppend);
	}

	// TODO: Implement remove old nodes
	private _detachOldNodes() {
	}

	private _renderFlow(nodes?: Train.Caoches, clearOldComps = true) {
		const coachesToRender = nodes || this.flowData;
		if (clearOldComps) {
			this.dynamicCompService.removeFlowNodes(this.coachesContanerRef);
		}
		coachesToRender.forEach(this._loadFlowNode);
	}

	private _loadFlowNode = (coach: Coach.Data, i: number) => {
		this.dynamicCompService.appendNodeToFlow({
			train: this.coachesContanerRef,
			component: CoachComponent,
			uniqueId: this.coachIdPrefix + i,
			inputBindings: {
				position: this.position.getAddingNodePos(),
				coachData: { ...coach, index: i },
				dimension: this.nodeDimension,
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

	ngOnDestroy() {
		this.leaderLinesService.subs.unsubscribe();
		delete this.leaderLinesService.connectors;
	}
}
