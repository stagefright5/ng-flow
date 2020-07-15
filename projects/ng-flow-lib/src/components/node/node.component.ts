import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Input,
	OnDestroy,
	Renderer2,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { OverlayService } from '../../services/overlay.service';
import { NODE_DATA, Selectors, WHEEL_DATA } from '../../utils/constants';
import { Node, PromoteEventObject } from '../../utils/typings';
@Component({
	selector: Selectors.NODE,
	templateUrl: './node.component.html',
	styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements AfterViewInit, OnDestroy {
	private _config: Node.Config;
	private _pos: Node.Position;
	private _dim: Node.Dimension;
	private _promEvtCb: (e: PromoteEventObject) => void;
	// private _nodeAdded: EventEmitter<Node.Config> = new EventEmitter();
	@Input('nodeData') set nodeConfig(v: Node.Config) {
		this._config = v;
		this.onChanges({ nodeConfig: v });
	}
	get nodeConfig(): Node.Config {
		return this._config;
	}
	@Input() set position(v: Node.Position) {
		this._pos = v;
		this.onChanges({ position: v });
	}
	get position(): Node.Position {
		return this._pos || { top: 0, left: 0 };
	}
	@Input() set dimension(v: Node.Dimension) {
		this._dim = v;
		this.onChanges({ dimension: v });
	}
	get dimension(): Node.Dimension {
		return this._dim || { width: 250, height: 300 };
	}

	@Input() set promoteEvtCbFn(v: (e: PromoteEventObject) => void) {
		this._promEvtCb = v;
		this.onChanges({ promoteEvtCbFn: v });
	}
	get promoteEvtCbFn(): (e: PromoteEventObject) => void {
		return this._promEvtCb;
	}

	// @Output() set nodeAdded(v: EventEmitter<Node.Config>) {
	// 	this._nodeAdded = v;
	// 	this.onChanges({ nodeAdded: v });
	// }
	// get nodeAdded(): EventEmitter<Node.Config> {
	// 	return this._nodeAdded;
	// }

	@HostBinding('attr.id') id = '';

	@ViewChild('node_content', { static: false, read: ViewContainerRef })
	nodeContent: ViewContainerRef;
	private _currentChildComponentSelector: string;
	constructor(
		private _overlayService: OverlayService,
		private _dynamicCompService: DynamicComponentService,
		private renderer: Renderer2,
		private elementRef: ElementRef
	) {}

	ngAfterViewInit() {
		setTimeout(() => {
			if (this.nodeConfig.component) {
				this._loadChildComponent();
			}
			// this.nodeAdded.emit(this.nodeConfig);
		});
	}

	onChanges(changes: any) {
		if (changes.nodeConfig) {
			if ((<Node.Config>changes.nodeConfig).hasOwnProperty('component') && this.nodeContent) {
				if (this._currentChildComponentSelector) {
					console.log('[Node.ngOnChanges] clearing the children');
					this._dynamicCompService.clearAttachedComps(this.nodeContent, this._currentChildComponentSelector);
				}
				if ((<Node.Config>changes.nodeConfig).component) {
					console.log('[Node.ngOnChanges] Loading child');
					this._loadChildComponent();
				}
			}
		}
	}

	private _loadChildComponent() {
		const attachedComp = this._dynamicCompService.loadComponent(this.nodeContent, {
			component: this.nodeConfig.component,
			injection: {
				data: this.nodeConfig.data,
				token: NODE_DATA,
			},
		});
		this._currentChildComponentSelector = attachedComp.selector;
	}

	emitPromoterWheelClickEvt(e: MouseEvent, wheel: Node.Wheel) {
		if (wheel.descriptionPanel) {
			this._overlayService.open({
				elToAttach: <HTMLElement>event.target,
				comp: wheel.descriptionPanel,
				injectionData: wheel.data,
				injectionToken: WHEEL_DATA,
			});
		} else {
			if (typeof this.promoteEvtCbFn === 'function') {
				const dataObj: PromoteEventObject = {
					wheelConfig: wheel,
					nodeConfig: this.nodeConfig,
				};
				this.promoteEvtCbFn(dataObj);
			}
		}
	}

	updateDOMPosition() {
		Object.entries(this.position).forEach(([key, value]) => {
			const el = this.elementRef.nativeElement;
			this.renderer.setStyle(el, key, value + 'px');
		});
	}

	ngOnDestroy() {
		// this.pubSub.$pub(Events.NODE_DELETE, {
		// 	id: _.attr(this.elementRef.nativeElement, 'id'),
		// });
	}
}
