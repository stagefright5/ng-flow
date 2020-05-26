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
import { Flow, Node, AttachedComponentData, Connector } from "../../utils/TypeDefs";

import { NodeComponent } from "../node/node.component";
import { LeaderLineService } from "../../services/leader-line.service";
import { DynamicComponentService } from "../../services/dynamic-component.service";
import { PositionService } from "../../services/position.service";
import { Selectors as directive_selectors, NodeIdPrefix, Classes } from "../../utils/constants";
import { MediaObserver, MediaChange } from "@angular/flex-layout/core";
import { Subscription } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { _ } from "../../utils/generic-ops";

@Component({
	selector: directive_selectors.FLOW,
	templateUrl: "./flow.component.html",
	styleUrls: ["./flow.component.scss"],
	exportAs: "ngFlow",
	host: {
		class: Classes.FLOW
	}
})
export class FlowComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
	@Output("promote") promoterNodeClickEvtEmitter = new EventEmitter();
	@Input() flowData: Flow.Nodes = [];
	@Input() connectorColor: string = "#000";
	@Input() connectorSize: number = 4;
	@Input() nodeWidth = 250;
	@Input() nodeHeight = 300;
	@Input() nodeGap = 0;
	@Input() containerHeight: string | 'auto' = 'auto';

	@ViewChild("nodes", { read: ViewContainerRef, static: true }) nodesRef: ViewContainerRef;
	@ViewChild("nodes_container", { read: ElementRef, static: true }) nodesContanerRef: ElementRef;
	@ViewChild("connectors_container", { read: ElementRef, static: true }) connectorsContainer: ElementRef;
	classes = Classes;
	private nodeIdPrefix = NodeIdPrefix;
	private _oldFlowData: Flow.Nodes = [];
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
		this.position.init(
			this.nodesContanerRef,
			{
				width: this.nodeWidth,
				height: this.nodeHeight
			},
			this.nodeGap
		);
		this.elmRef.nativeElement.style.height = this.containerHeight !== 'auto' ? '400px' : this.containerHeight;
		this.leaderLinesService.init(this.connectorsContainer);
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
				this.position.init(this.elmRef, dimension, this.nodeGap);
				this.dynamicCompService.attachedCompList[directive_selectors.NODE].forEach(compData =>
					this.dynamicCompService.updateComponentBindings({ inputBindings: { dimension } }, compData)
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

	private _emitWheelClick = (event: any) => {
		this.promoterNodeClickEvtEmitter.emit(event);
	};

	reCalculateNodePositions = (change?: MediaChange) => {
		clearTimeout(this._setTimeoutTimer);
		this._setTimeoutTimer = setTimeout(() => {
			console.log("mchange: ", change);
			this.position.resetStores();
			this._updateNodesPositions(this.dynamicCompService.attachedCompList[directive_selectors.NODE]);
			this._updateContainersLayouts();
		}, 200);
	};

	private _updateContainersLayouts() {
		this.leaderLinesService.positionContainer();
		this.leaderLinesService.positionConnectors();
		if (this.containerHeight === 'auto') {
			(<HTMLElement>this.elmRef.nativeElement).style.height = this.position.NODES_TOTAL_HEIGHT;
		}
	}
	// Will be called out of this class instance's context. Hence Arrow func.
	private _updateNodesPositions(nodes?: AttachedComponentData[]) {
		const positions = this.position.calculateNodesPositions(nodes.map(n => n.__data__));
		nodes.forEach((node, i) => {
			const inputBindings = {
				inputBindings: {
					position: positions[i]
				}
			};
			this.dynamicCompService.updateComponentBindings(inputBindings, node);
			(<NodeComponent>node.compRef.instance).updateDOMPosition();
		});
	};

	private _appendNewNodes() {
		const newNodesToAppend = this.flowData.slice(this._oldFlowData.length, this.flowData.length);
		this._updateNodesPositions(newNodesToAppend.map((node, i) => this._loadFlowNode(node, i + this._oldFlowData.length)));
		this._oldFlowData.push(...newNodesToAppend);
		this._updateContainersLayouts();
	}

	// Will be called out of this class instance's context. Hence Arrow func.
	private _loadFlowNode = (node: Node.Data, i: number) => {
		return this.dynamicCompService.appendNodeToFlow({
			flow: this.nodesRef,
			component: NodeComponent,
			id: this.nodeIdPrefix + i,
			inputBindings: {
				nodeData: { ...node, index: i },
				dimension: {
					width: this.nodeWidth,
					height: this.nodeHeight
				},
				promoteEvtCbFn: this._emitWheelClick
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

	drawConnector({ start = "", end = "", path = "fluid" }: Partial<Connector.DrawConnectorOptions>) {
		this.leaderLinesService.drawConnector({
			start: typeof start === "string" ? document.getElementById(start) : start,
			end: typeof end === "string" ? document.getElementById(end) : end,
			color: this.connectorColor,
			size: this.connectorSize,
			path: path
		});
	}

	private _subsForMediaChange() {
		this.mediaObserverSubs = this.mediaObserver.media$
			.pipe(
				distinctUntilChanged((x, y) => x.mqAlias === y.mqAlias),
				filter(v => v.matches)
			)
			.subscribe((c: MediaChange) => {
				this.reCalculateNodePositions(c);
			});
	}

	deleteNode(id: string) {
		const deletedNode = this.dynamicCompService.detachComponent(directive_selectors.NODE, id);
		this._oldFlowData = this.flowData.slice();
		this.flowData = this.flowData.filter(n => n !== deletedNode);
	}

	reRenderFlow() {
		this._firstTime = false;
		this.position.resetStores();
		// Save all the old connectors' config
		const oldConnectors = Array.from(this.leaderLinesService.connectors.keys());
		this.dynamicCompService.clearAttachedComps(this.nodesRef, directive_selectors.NODE);
		this.leaderLinesService.removeAllConnectors();
		this._oldFlowData = [];
		this._appendNewNodes();
		// KEEP_AN_EYE: Might fail to draw some connectors due to timing issues
		setTimeout(() => {
			// redraw connectors with the same config
			this.reDrawConnectors(oldConnectors);
		});
	}

	private reDrawConnectors(keys: Array<any>) {
		keys.map(key => ({
			...key,
			start: _.attr(key.start, "id"),
			end: _.attr(key.end, "id")
		})).forEach(k => this.leaderLinesService.drawConnector(k));
	}

	ngOnDestroy() {
		if (this.mediaObserverSubs) {
			this.mediaObserverSubs.unsubscribe();
			this.mediaObserverSubs = null;
		}
		this.dynamicCompService.clearAttachedComps(this.nodesRef, directive_selectors.NODE);
		this.leaderLinesService.cleanup();
		this.position.cleanup();
		clearTimeout(this._setTimeoutTimer);
	}
}
