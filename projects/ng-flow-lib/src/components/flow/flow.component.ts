import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ViewContainerRef, DoCheck, ElementRef } from '@angular/core';
import { Flow, Node, AttachedComponentData, Connector } from '../../utils/TypeDefs';

import { NodeComponent } from '../node/node.component';
import { LeaderLineService } from '../../services/leader-line.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { PositionService } from '../../services/position.service';
import { CONST_SELECTORS, NODE_ID_PREFIX } from '../../utils/constants';
import { MediaObserver, MediaChange } from '@angular/flex-layout/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators'
import { _ } from '../../utils/generic-ops';

@Component({
	selector: CONST_SELECTORS.FLOW,
	templateUrl: './flow.component.html',
	styleUrls: ['./flow.component.scss'],
	exportAs: 'ngFlow'
})
export class FlowComponent implements OnInit, OnDestroy, DoCheck {
	@Output('promote') promoterNodeClickEvtEmitter = new EventEmitter();
	@Input() flowData: Flow.Nodes = [];
	@Input() connectorColor: string = '#000';
	@Input() connectorSize: number = 4;

	@ViewChild('nodes', { read: ViewContainerRef, static: true }) nodesContanerRef: ViewContainerRef;
	nodeIdPrefix = NODE_ID_PREFIX;
	nodeDimension: Node.Dimension = { width: 15, height: 18 };
	private _oldFlowData: Flow.Nodes = [];
	private mChangeObservers: Array<(change: MediaChange) => void> = [];
	private mediaObserverSubs: Subscription;
	private _setTimeoutTimer = null;

	constructor(private leaderLinesService: LeaderLineService,
		private dynamicCompService: DynamicComponentService,
		private elmRef: ElementRef,
		private position: PositionService,
		private mediaObserver: MediaObserver) {
		this.position.init(this.elmRef, this.nodeDimension);
		this._subsForMediaChange();
	}

	ngOnInit(): void {
		// TODO: Use "MutationObserver" DOM API for finer control on when to reposition the nodes
		this.addObserverForMediaChange(this.reCalculateNodePositions)
	}

	ngDoCheck() {
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
			this.position.prepareForRecalculation();
			this.leaderLinesService.removeAllConnectors();
			this.dynamicCompService.clearAttachedComps(this.nodesContanerRef, CONST_SELECTORS.NODE);
		}
		nodesToRender.forEach(this._loadFlowNode);
	}

	// Will be called out of this class instance's context. Hence Arrow func.
	private _loadFlowNode = (node: Node.Data, i: number) => {
		return this.dynamicCompService.appendNodeToFlow({
			flow: this.nodesContanerRef,
			component: NodeComponent,
			uniqueId: this.nodeIdPrefix + i,
			inputBindings: {
				nodeData: { ...node, index: i },
				dimension: this.nodeDimension,
				promoteEvtCbFn: this.emitPromeEvt
			},
			outputBindings: {
				nodeAdded: () => {
					if (i > 0) {
						this.drawConnector({ from: this.nodeIdPrefix + (i - 1), to: this.nodeIdPrefix + i });
					}
				}
			},
			_data: node
		});
	}

	drawConnector({ from = '', to = '' }) {
		this.leaderLinesService.drawConnector({
			start: document.getElementById(from),
			end: document.getElementById(to),
			color: this.connectorColor,
			size: this.connectorSize,
		});
	}

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

	deleteNode(id: string) {
		const deletedNode = this.dynamicCompService.detachComponent(CONST_SELECTORS.NODE, id);
		this._oldFlowData = this.flowData.slice();
		this.flowData = this.flowData.filter(n => n !== deletedNode);
	}

	ngOnDestroy() {
		this.mediaObserverSubs.unsubscribe();
		this.leaderLinesService.removeAllConnectors();
		this.dynamicCompService.clearAttachedComps(this.nodesContanerRef, CONST_SELECTORS.NODE);
		clearTimeout(this._setTimeoutTimer);
	}
}
