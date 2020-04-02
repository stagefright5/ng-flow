import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { Coach } from '../../utils/TypeDefs'
import { OverlayService } from '../../services/overlay.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { selectors } from '../../utils/constants';
@Component({
	selector: selectors.NODE,
	templateUrl: './node.component.html',
	styleUrls: ['./node.component.scss']
})
export class CoachComponent implements AfterViewInit {
	@Input() coachData: Coach.Data = {};
	@Input() position: { x: number, y: number } = { x: 0, y: 0 };
	@Input() dimension: { width: number, height: number };
	@Input() promoteEvtCbFn: (...args) => void;
	@Output() coachAdded: EventEmitter<any> = new EventEmitter();
	@HostBinding('attr.id') id = '';

	@ViewChild('coach_content', { static: false, read: ViewContainerRef }) coachContent: ViewContainerRef;
	constructor(private _overlayService: OverlayService,
		private _dynamicCompService: DynamicComponentService,
		private renderer: Renderer2,
		private elementRef: ElementRef) { }

	ngAfterViewInit() {
		setTimeout(() => {
			if (this.coachData.component) {
				this._dynamicCompService.loadComponent(this.coachContent, this.coachData.component);
			}
			this.coachAdded.emit(this.coachData);
		});
	}

	emitPromoterWheelClickEvt(e: MouseEvent, wheel) {
		const dataObj = {
			wheelData: wheel,
			coachData: this.coachData
		};
		if (wheel.descriptionPanel) {
			this._overlayService.open(<HTMLElement>event.target, wheel.descriptionPanel, dataObj);
		} else if (wheel.promoter) {
			if (typeof this.promoteEvtCbFn === 'function') {
				this.promoteEvtCbFn({
					wheelData: wheel,
					coachData: this.coachData
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
