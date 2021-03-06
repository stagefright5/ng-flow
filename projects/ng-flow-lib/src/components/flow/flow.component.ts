import {
	Component,
	DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { LeaderLineService } from '../../services/leader-line.service';
import { OverlayService } from '../../services/overlay.service';
import { PositionService } from '../../services/position.service';
import { Classes, NodeIdPrefix, Selectors as directive_selectors } from '../../utils/constants';
import { _ } from '../../utils/generic-ops';
import { AttachedComponent, Connector, Flow, Node, PromoteEventObject } from '../../utils/typings';
import { NodeComponent } from '../node/node.component';

@Component({
	selector: directive_selectors.FLOW,
	templateUrl: './flow.component.html',
	styleUrls: ['./flow.component.scss'],
	exportAs: 'ngFlow',
	providers: [DynamicComponentService, PositionService, LeaderLineService, OverlayService],
	host: {
		class: Classes.FLOW,
	},
})
export class FlowComponent implements OnInit, OnDestroy, DoCheck, OnChanges {
	@Output('promote') promoterNodeClickEvtEmitter = new EventEmitter();
	@Input() flowData: Flow.Nodes = [];
	@Input() connectorColor: string = '#000';
	@Input() connectorSize: number = 4;
	@Input() nodeWidth = 250;
	@Input() nodeHeight = 300;
	@Input() nodeGap = 0;
	@Input() containerHeight: string | 'auto' = 'auto';

	@ViewChild('nodes', { read: ViewContainerRef, static: true }) nodesRef: ViewContainerRef;
	@ViewChild('nodes_container', { read: ElementRef, static: true }) nodesContanerRef: ElementRef;
	@ViewChild('connectors_container', { read: ElementRef, static: true }) connectorsContainer: ElementRef;
	classes = Classes;
	private nodeIdPrefix = NodeIdPrefix;
	private _oldFlowData: Flow.Nodes = [];
	private mediaObserverSubs: Subscription;
	private _setTimeoutTimer = null;

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
		this.position.init(this.nodesContanerRef, this.nodeHeight, this.nodeWidth, this.nodeGap);
		this.elmRef.nativeElement.style.height =
			this.containerHeight !== 'auto' ? `${this.containerHeight}px` : this.containerHeight;
		this.leaderLinesService.init(this.connectorsContainer);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			(changes.nodeWidth && !changes.nodeWidth.firstChange) ||
			(changes.nodeHeight && !changes.nodeHeight.firstChange) ||
			(changes.nodeGap && !changes.nodeGap.firstChange)
		) {
			setTimeout(() => {
				this.position.init(this.elmRef, this.nodeHeight, this.nodeWidth, this.nodeGap);
				this.dynamicCompService.attachedCompList[directive_selectors.NODE].forEach(attachedComp => {
					const size = this.position.getNodeSize(this.getNodeConfig(attachedComp));
					const dimension = {
						width: size.width,
						height: size.height,
					};
					this.dynamicCompService.updateComponentBindings({ inputBindings: { dimension } }, attachedComp);
				});
				this.reCalculateNodePositions();
			});
		}
	}

	ngDoCheck() {
		if (this._oldFlowData.length < this.flowData.length) {
			this._appendNewNodes();
		}
	}

	private _emitWheelClick = (event: PromoteEventObject) => {
		this.promoterNodeClickEvtEmitter.emit(event);
	};

	reCalculateNodePositions = (change?: MediaChange) => {
		clearTimeout(this._setTimeoutTimer);
		this._setTimeoutTimer = setTimeout(() => {
			this.position.resetStores();
			this._updatePositions(this.dynamicCompService.attachedCompList[directive_selectors.NODE]);
		});
	};

	private _updateContainersLayouts() {
		this.leaderLinesService.positionContainer();
		this.leaderLinesService.positionConnectors();
		if (this.containerHeight === 'auto') {
			(<HTMLElement>this.elmRef.nativeElement).style.height = this.position.NODES_TOTAL_HEIGHT;
		}
	}

	private _updatePositions(nodes?: AttachedComponent[]) {
		const positions = this.position.calculateNodesPositions(nodes.map(n => this.getNodeConfig(n)));
		nodes.forEach((node, i) => {
			const inputBindings = {
				inputBindings: {
					position: positions[i],
				},
			};
			this.dynamicCompService.updateComponentBindings(inputBindings, node);
			(<NodeComponent>node.compRef.instance).updateDOMPosition();
		});
		this._updateContainersLayouts();
	}

	private _appendNewNodes() {
		const newNodesToAppend = this.flowData.slice(this._oldFlowData.length, this.flowData.length);
		const appendedNodes = newNodesToAppend.map((node, i) => {
			const nodeIndex = i + this._oldFlowData.length;
			node.id = node.id || this.nodeIdPrefix + nodeIndex;
			return this._loadFlowNode(node, nodeIndex);
		});
		this._updatePositions(appendedNodes);
		setTimeout(() => {
			this.drawConnectors(appendedNodes.map(d => this.getNodeConfig(d)));
		});
		this._oldFlowData.push(...newNodesToAppend);
	}

	private _loadFlowNode(nodeConfig: Node.Config, nodeIndex: number) {
		const thisNodeId = nodeConfig.id;
		return this.dynamicCompService.appendNodeToFlow({
			flow: this.nodesRef,
			component: NodeComponent,
			id: thisNodeId,
			inputBindings: {
				nodeConfig: { ...nodeConfig, index: nodeIndex },
				dimension: this.position.getNodeSize(nodeConfig),
				promoteEvtCbFn: this._emitWheelClick,
			},
			__data__: nodeConfig,
		});
	}

	drawConnectors(nodes: Node.Config[]) {
		for (let i = 0; i <= nodes.length - 1; i++) {
			if (Array.isArray(nodes[i].from)) {
				nodes[i].from.forEach(from => {
					if (typeof from === 'string') {
						this.drawConnector({ start: from, end: nodes[i].id });
					} else {
						this.drawConnector({ start: from.id, end: nodes[i].id, path: from.path });
					}
				});
			}
			if (Array.isArray(nodes[i].to))
				nodes[i].to.forEach(to => {
					if (typeof to === 'string') {
						this.drawConnector({ start: nodes[i].id, end: to });
					} else {
						this.drawConnector({ start: nodes[i].id, end: to.id, path: to.path });
					}
				});
		}
	}

	drawConnector({ start = '', end = '', path = 'fluid' }: Partial<Connector.DrawConnectorOptions>) {
		this.leaderLinesService.drawConnector({
			start: typeof start === 'string' ? document.getElementById(start) : start,
			end: typeof end === 'string' ? document.getElementById(end) : end,
			color: this.connectorColor,
			size: this.connectorSize,
			path: path,
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
		// this._firstTime = false;
		this.position.resetStores();
		// Save all the old connectors' config
		const oldConnectors = Array.from(this.leaderLinesService.connectors.keys());
		this.dynamicCompService.clearAttachedComps(this.nodesRef, directive_selectors.NODE);
		this.leaderLinesService.removeAllConnectors();
		this._oldFlowData = [];
		this._appendNewNodes();
		// WATCHOUT: Might fail to draw some connectors due to timing issues
		setTimeout(() => {
			// redraw connectors with the same config
			this.reDrawConnectors(oldConnectors);
		});
	}

	private reDrawConnectors(keys: Array<any>) {
		keys.map(key => ({
			...key,
			start: _.attr(key.start, 'id'),
			end: _.attr(key.end, 'id'),
		})).forEach(k => this.leaderLinesService.drawConnector(k));
	}

	updateNodesData(newConfigs: Array<Partial<Node.Config>>) {
		const idNodeMap: Record<string, AttachedComponent> = this.dynamicCompService.attachedCompList[
			directive_selectors.NODE
		].reduce((a, c) => {
			a[this.getNodeConfig(c).id] = c;
			return a;
		}, {});
		let reposition = false;
		newConfigs.forEach(newConfig => {
			if (idNodeMap[newConfig.id]) {
				const config = this.getNodeConfig(idNodeMap[newConfig.id]);
				if (!reposition && (config.width !== newConfig.width || config.height !== newConfig.height)) {
					reposition = true;
				}
				Object.assign(config, newConfig);
				const inputBindings = {
					nodeConfig: config,
					dimension: {
						width: config.width,
						height: config.height,
					},
				};
				this.dynamicCompService.updateComponentBindings(
					{ inputBindings: inputBindings },
					idNodeMap[newConfig.id]
				);
			}
		});
		if (reposition) {
			this.reCalculateNodePositions();
		}
	}

	private getNodeConfig(nodeComponent): Node.Config {
		return this.dynamicCompService.getAttachedComponentData(nodeComponent);
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
