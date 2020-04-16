import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	ViewChild,
	ViewContainerRef,
	DoCheck,
	ElementRef,
	OnChanges,
	SimpleChanges,
	HostListener
} from "@angular/core";
import {
	Flow,
	Node,
	AttachedComponentData,
	Connector
} from "../../utils/TypeDefs";

import { NodeComponent } from "../node/node.component";
import { LeaderLineService } from "../../services/leader-line.service";
import { DynamicComponentService } from "../../services/dynamic-component.service";
import { PositionService } from "../../services/position.service";
import { CONST_SELECTORS, NODE_ID_PREFIX } from "../../utils/constants";
import { MediaObserver, MediaChange } from "@angular/flex-layout/core";
import { Subscription } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { _ } from "../../utils/generic-ops";

@Component({
	selector: CONST_SELECTORS.FLOW,
	templateUrl: "./flow.component.html",
	styleUrls: ["./flow.component.scss"],
	exportAs: "ngFlow"
})
export class FlowComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
	@Output("promote") promoterNodeClickEvtEmitter = new EventEmitter();
	@Input() flowData: Flow.Nodes = [];
	@Input() connectorColor: string = "#000";
	@Input() connectorSize: number = 4;
	@Input() nodeWidth = 250;
	@Input() nodeHeight = 300;
	@Input() nodeGap = 0;

	@ViewChild("nodes", { read: ViewContainerRef, static: true })
	nodesContanerRef: ViewContainerRef;
	nodeIdPrefix = NODE_ID_PREFIX;
	private _oldFlowData: Flow.Nodes = [];
	private mChangeObservers: Array<(change: MediaChange) => void> = [];
	private mediaObserverSubs: Subscription;
	private _setTimeoutTimer = null;
	private _firstTime = true;

	constructor(
		private leaderLinesService: LeaderLineService,
		private dynamicCompService: DynamicComponentService,
		private elmRef: ElementRef,
		private position: PositionService,
		private mediaObserver: MediaObserver
	) {
		this._subsForMediaChange();
	}

	ngOnInit(): void {
		// TODO: Use "MutationObserver" DOM API for finer control on when to reposition the nodes
		this.addObserverForMediaChange(this.reCalculateNodePositions);
		this.position.initBasePositionParams(
			this.elmRef,
			{
				width: this.nodeWidth,
				height: this.nodeHeight
			},
			this.nodeGap
		);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			(changes.nodeWidth && !changes.nodeWidth.firstChange) ||
			(changes.nodeHeight && !changes.nodeHeight.firstChange) ||
			(changes.nodeGap && !changes.nodeGap.firstChange)
		) {
			setTimeout(() => {
				const dimension = {
					width: this.nodeWidth,
					height: this.nodeHeight
				};
				this.position.initBasePositionParams(
					this.elmRef,
					dimension,
					this.nodeGap
				);
				this.dynamicCompService.attachedCompList[
					CONST_SELECTORS.NODE
				].forEach(compData =>
					this.dynamicCompService.updateComponentBindings(
						{ inputBindings: { dimension } },
						compData
					)
				);
				console.log("recalcing pos after width changed");
				this.reCalculateNodePositions();
			});
		}
	}

	ngDoCheck() {
		if (this._oldFlowData.length < this.flowData.length) {
			console.log("Did Check!");
			this._appendNewNodes();
		}
	}

	emitWheelClick = (event: any) => {
		this.promoterNodeClickEvtEmitter.emit(event);
	};

	getNodeData(index: number) {
		return {
			...this.flowData[index],
			index
		};
	}

	reCalculateNodePositions = (change?: MediaChange) => {
		clearTimeout(this._setTimeoutTimer);
		this._setTimeoutTimer = setTimeout(() => {
			console.log("mchange: ", change);
			this.position.resetStores();
			this.dynamicCompService.attachedCompList[
				CONST_SELECTORS.NODE
			].forEach(this.updateNodePosition);
			this.leaderLinesService.refreshConnectors();
		}, 200);
	};
	// Will be called out of this class instance's context. Hence Arrow func.
	updateNodePosition = (node?: AttachedComponentData) => {
		this.dynamicCompService.updateComponentBindings(
			{
				inputBindings: {
					position: this.position.getAddingNodePos(node.__data__)
				}
			},
			node
		);
		(<NodeComponent>node.compRef.instance).updateDOMPosition();
	};

	private _appendNewNodes() {
		const newNodesToAppend = this.flowData.slice(
			this._oldFlowData.length,
			this.flowData.length
		);
		newNodesToAppend.forEach((node, i) => {
			this.updateNodePosition(
				this._loadFlowNode(node, i + this._oldFlowData.length)
			);
		});
		this._oldFlowData.push(...newNodesToAppend);
	}

	// Will be called out of this class instance's context. Hence Arrow func.
	private _loadFlowNode = (node: Node.Data, i: number) => {
		return this.dynamicCompService.appendNodeToFlow({
			flow: this.nodesContanerRef,
			component: NodeComponent,
			id: this.nodeIdPrefix + i,
			inputBindings: {
				nodeData: { ...node, index: i },
				dimension: {
					width: this.nodeWidth,
					height: this.nodeHeight
				},
				promoteEvtCbFn: this.emitWheelClick
			},
			outputBindings: {
				nodeAdded: () => {
					if (this._firstTime)
						if (i > 0) {
							this.drawConnector({
								start: this.nodeIdPrefix + (i - 1),
								end: this.nodeIdPrefix + i
							});
						}
				}
			},
			__data__: node
		});
	};

	drawConnector({
		start = "",
		end = "",
		path = "grid"
	}: Partial<Connector.DrawConnectorOptions>) {
		this.leaderLinesService.drawConnector({
			start:
				typeof start === "string"
					? document.getElementById(start)
					: start,
			end: typeof end === "string" ? document.getElementById(end) : end,
			color: this.connectorColor,
			size: this.connectorSize,
			path: path
			// startSocket: this.position.history.get()
		});
	}

	addObserverForMediaChange(
		mediaChangeObserver: (change: MediaChange) => void
	) {
		this.mChangeObservers.push(mediaChangeObserver);
	}

	_subsForMediaChange() {
		this.mediaObserverSubs = this.mediaObserver.media$
			.pipe(
				distinctUntilChanged((x, y) => x.mqAlias === y.mqAlias),
				filter(v => v.matches)
			)
			.subscribe((c: MediaChange) => {
				this.mChangeObservers.forEach(a => a(c));
			});
	}

	deleteNode(id: string) {
		const deletedNode = this.dynamicCompService.detachComponent(
			CONST_SELECTORS.NODE,
			id
		);
		this._oldFlowData = this.flowData.slice();
		this.flowData = this.flowData.filter(n => n !== deletedNode);
	}

	reRenderFlow() {
		this._firstTime = false;
		this.position.resetStores();
		const oldConnectors = Array.from(
			this.leaderLinesService.connectors.keys()
		);
		this.dynamicCompService.clearAttachedComps(
			this.nodesContanerRef,
			CONST_SELECTORS.NODE
		);
		this.leaderLinesService.removeAllConnectors();
		this._oldFlowData = [];
		this._appendNewNodes();
		// KEEP_AN_EYE: Might fail to draw some connectors due to timing issues
		setTimeout(() => {
			this.reDrawConnectors(oldConnectors);
		});
	}

	reDrawConnectors(keys: Array<any>) {
		keys.map(key => ({
			...key,
			start: _.attr(key.start, "id"),
			end: _.attr(key.end, "id")
		})).forEach(k => this.leaderLinesService.drawConnector(k));
	}

	ngOnDestroy() {
		this.mediaObserverSubs.unsubscribe();
		this.leaderLinesService.removeAllConnectors();
		this.dynamicCompService.clearAttachedComps(
			this.nodesContanerRef,
			CONST_SELECTORS.NODE
		);
		this.position.resetStores();
		clearTimeout(this._setTimeoutTimer);
	}
}
