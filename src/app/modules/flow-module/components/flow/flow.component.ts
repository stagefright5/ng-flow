import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, OnChanges, DoCheck, ElementRef } from '@angular/core';
import { Flow, Node } from '../../utils/TypeDefs';

import { NodeComponent } from '../node/node.component';
import { LeaderLineService } from '../../services/leader-line.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { PositionService } from '../../services/position.service';
import { selectors, NODE_ID_PREFIX } from '../../utils/constants';

@Component({
	selector: selectors.FLOW,
	templateUrl: './flow.component.html',
	styleUrls: ['./flow.component.scss'],
	exportAs: 'ngFlow'
})
export class FlowComponent implements OnInit, OnDestroy, DoCheck {
	@Output('promote') promoterNodeClickEvtEmitter = new EventEmitter();
	@Input() flowData: Flow.Nodes = [];
	@ViewChild('nodes', { read: ViewContainerRef, static: true }) nodesContanerRef: ViewContainerRef;
	nodeIdPrefix = NODE_ID_PREFIX;
	nodeDimension: Node.Dimension = { width: 15, height: 18 };
	private _oldFlowData: Flow.Nodes = [];
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

	ngDoCheck() {
		// console.log('Do Check Called!');
		if (this._oldFlowData.length < this.flowData.length) {
			console.log('Did Check!');
			this._appendNewNodes();
		}
	}

	emitPromeEvt = (event: any) => {
		if (event.nodeData.index + 1 === this.flowData.length) {
			this.promoterNodeClickEvtEmitter.emit(event)
		}
	}

	getNodeData(index: number) {
		return ({
			...(this.flowData[index]),
			index
		});
	}

	reCalculateNodePositions = (change?: MediaChange) => {
		clearTimeout(this._setTimeoutTimer);
		this._setTimeoutTimer = setTimeout(() => {
			console.log('mchange: ', change);
			this.position.prepareForRecalculation();
			this.dynamicCompService.attachedCompList[CONST_SELECTORS.NODE].forEach(this.updateNodePosition);
			this.leaderLinesService.refreshConnectors();
		}, 600);
	}
	// Will be called out of this class instance's context. Hence Arrow func.
	updateNodePosition = (node?: NewComponentData) => {
		this.dynamicCompService.updateComponentBindings({
			inputBindings: {
				position: this.position.getAddingNodePos()
			}
		}, node);
		(<NodeComponent>node.compRef.instance).updateDOMPosition();
	}

	private _appendNewNodes() {
		const newNodesToAppend = this.flowData.slice(this._oldFlowData.length, this.flowData.length)
		newNodesToAppend.forEach((node, i) => {
			this.updateNodePosition(this._loadFlowNode(node, i + this._oldFlowData.length));
		});
		this._oldFlowData.push(...newNodesToAppend);
	}

	// TODO: Implement remove old nodes
	private _detachOldNodes() {
	}

	private _renderFlow(nodes?: Flow.Nodes, reRender = true) {
		const nodesToRender = nodes || this.flowData;
		if (reRender) {
			this.position.clearHistory();
			this.dynamicCompService.removeFlowNodes(this.nodesContanerRef);
			this.leaderLinesService.removeAllConnectors();
		}
		nodesToRender.forEach(this._loadFlowNode);
	}

	private _loadFlowNode = (node: Node.Data, i: number) => {
		this.dynamicCompService.appendNodeToFlow({
			flow: this.nodesContanerRef,
			component: NodeComponent,
			uniqueId: this.nodeIdPrefix + i,
			inputBindings: {
				position: this.position.getAddingNodePos(),
				nodeData: { ...node, index: i },
				dimension: this.nodeDimension,
				promoteEvtCbFn: this.emitPromeEvt
			},
			outputBindings: {
				nodeAdded: () => {
					if (i > 0) {
						this.onNodeAdd(node, i)
					}
				}
			}
		});
	}

	onNodeAdd(e: Node.Data, i: number) {
		this.leaderLinesService.drawConnector({
	//TODO: Not being called from anywhere.
	addObserverForMediaChange(mediaChangeObserver: (change: MediaChange) => void) {
		this.mChangeObservers.push(mediaChangeObserver);
	}

	_subsForMediaChange() {
		this.mediaObserverSubs = this.mediaObserver.media$.pipe(
			distinctUntilChanged((x, y) => x.mqAlias === y.mqAlias),
			filter((v) => v.matches)
		).subscribe((c: MediaChange) => {
			this.mChangeObservers.forEach(a => a(c));
		});
	}

	ngOnDestroy() {
		this.leaderLinesService.mediaObserverSubs.unsubscribe();
		delete this.leaderLinesService.connectors;
	}
}
