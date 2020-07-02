import {
	Component,
	Input,
	Output,
	EventEmitter,
	AfterViewInit,
	ViewChild,
	ViewContainerRef,
	ElementRef,
	Renderer2,
	HostBinding,
	OnDestroy
} from '@angular/core';
import { Node } from '../../utils/TypeDefs';
import { OverlayService } from '../../services/overlay.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { Selectors, Events } from '../../utils/constants';
import { PubSubService } from '../../services/pub-sub.service';
import { _ } from '../../utils/generic-ops';
@Component({
	selector: Selectors.NODE,
	templateUrl: './node.component.html',
	styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit, OnDestroy {
	@Input('nodeData') nodeConfig: Node.Config = {};
	@Input() position: Node.Position = { top: 0, left: 0 };
	@Input() dimension: Node.Dimension = { width: 250, height: 300 };
	@Input() promoteEvtCbFn: (e: PromoteEventObject) => void;
	@Output() nodeAdded: EventEmitter<Node.Config> = new EventEmitter();
	@HostBinding('attr.id') id = '';

	@ViewChild('node_content', { static: false, read: ViewContainerRef })
	nodeContent: ViewContainerRef;
	constructor(
		private _overlayService: OverlayService,
		private _dynamicCompService: DynamicComponentService,
		private renderer: Renderer2,
		private elementRef: ElementRef,
		private pubSub: PubSubService
	) { }

	ngAfterViewInit() {
		setTimeout(() => {
			if (this.nodeConfig.component) {
				this._dynamicCompService.loadComponent(this.nodeContent, {
					component: this.nodeData.component
				});
			}
			this.nodeAdded.emit(this.nodeConfig);
		});
	}

	emitPromoterWheelClickEvt(e: MouseEvent, wheel: Node.Wheel) {
		if (wheel.descriptionPanel) {
			this._overlayService.open(<HTMLElement>event.target, wheel.descriptionPanel, dataObj);
		} else {
			if (typeof this.promoteEvtCbFn === 'function') {
				const dataObj: PromoteEventObject = {
					wheelConfig: wheel,
					nodeConfig: this.nodeConfig
				}
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
		this.pubSub.$pub(Events.NODE_DELETE, {
			id: _.attr(this.elementRef.nativeElement, 'id')
		});
	}
}
