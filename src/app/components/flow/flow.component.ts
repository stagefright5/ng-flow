import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, OnChanges, DoCheck, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Train, Coach } from '../../utils/TypeDefs';

import { CoachComponent } from '../node/node.component';
import { LeaderLineService } from '../../services/leader-line.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { PositionService } from '../../services/position.service';
import { selectors } from '../../utils/constants';

@Component({
	selector: selectors.FLOW,
	templateUrl: './flow.component.html',
	styleUrls: ['./flow.component.scss'],
	exportAs: 'ngFlow'
})
export class TrainComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges, DoCheck {
	@Output('promote') promoterCoachClickEvtEmitter = new EventEmitter();
	@Input() flowData: Train.Caoches = [];
	@ViewChild('coaches', { read: ViewContainerRef, static: true }) coachesContanerRef: ViewContainerRef;
	coachIdPrefix = 'coach_no_';
	nodeDimension: Coach.Dimension = { width: 15, height: 18 };
	private _oldFlowData: Train.Caoches = [];
	constructor(private leaderLinesService: LeaderLineService,
		private dynamicCompService: DynamicComponentService,
		private elmRef: ElementRef,
		private position: PositionService) {
		this.position.init(this.elmRef, this.nodeDimension);
	}

	ngOnInit(): void {
		// TODO: Subscribe for media changes and "_renderFlow" again
		// this.leaderLinesService.subscribeToMediaChange((change) => {
		// this._renderFlow(null, true);
		// 	console.log('mchange: ', change.matches);
		// 	this.position.clearHistory();
		// 	this.dynamicCompService.attachedCompList[selectors.NODE].forEach(node => {
		// 		this.dynamicCompService.updateInputBindings({ position: this.position.getAddingNodePos() }, node);
		// 	});
		// });
	}

	ngAfterViewInit() {
	}


	ngOnChanges(changes) {
		// console.log('changed:', changes);
	}

	ngDoCheck() {
		// console.log('Do Check Called!');
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

	private _renderFlow(nodes?: Train.Caoches, reRender = true) {
		const coachesToRender = nodes || this.flowData;
		if (reRender) {
			this.position.clearHistory();
			this.dynamicCompService.removeFlowNodes(this.coachesContanerRef);
			this.leaderLinesService.removeAllConnectors();
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
		this.leaderLinesService.mediaObserverSubs.unsubscribe();
		delete this.leaderLinesService.connectors;
	}
}
