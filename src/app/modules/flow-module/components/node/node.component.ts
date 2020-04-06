import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { Node } from '../../utils/TypeDefs'
import { OverlayService } from '../../services/overlay.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { selectors } from '../../utils/constants';
@Component({
	selector: selectors.NODE,
	templateUrl: './node.component.html',
	styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {
	@Input() nodeData: Node.Data = {};
	@Input() position: { x: number, y: number } = { x: 0, y: 0 };
	@Input() dimension: { width: number, height: number };
	@Input() promoteEvtCbFn: (...args) => void;
	@Output() nodeAdded: EventEmitter<any> = new EventEmitter();
	@HostBinding('attr.id') id = '';

	@ViewChild('node_content', { static: false, read: ViewContainerRef }) nodeContent: ViewContainerRef;
	constructor(private _overlayService: OverlayService,
		private _dynamicCompService: DynamicComponentService,
		private renderer: Renderer2,
		private elementRef: ElementRef) { }

	ngAfterViewInit() {
		setTimeout(() => {
			if (this.nodeData.component) {
				this._dynamicCompService.loadComponent(this.nodeContent, this.nodeData.component);
			}
			this.nodeAdded.emit(this.nodeData);
		});
	}

	emitPromoterWheelClickEvt(e: MouseEvent, wheel) {
		const dataObj = {
			wheelData: wheel,
			nodeData: this.nodeData
		};
		if (wheel.descriptionPanel) {
			this._overlayService.open(<HTMLElement>event.target, wheel.descriptionPanel, dataObj);
		} else if (wheel.promoter) {
			if (typeof this.promoteEvtCbFn === 'function') {
				this.promoteEvtCbFn({
					wheelData: wheel,
					nodeData: this.nodeData
				});
			}
		}
	}

	setPosition() {
		Object.entries(this.position).forEach(([key, value]) => {
			const el = this.elementRef.nativeElement;
			this.renderer.setStyle(el, key, value + 'px');
		});
	}

}
