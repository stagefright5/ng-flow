import { Injectable, ComponentRef, Injector } from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DESC_PANEL_DATA } from '../utils/cutom-tokens';
import { FlowModule } from '../flow.module';
@Injectable({
	providedIn: FlowModule
})
export class OverlayService {
	_overlayRef: OverlayRef;
	positions: ConnectedPosition[] = [
		{
			originX: 'start',
			originY: 'bottom',
			overlayX: 'start',
			overlayY: 'top',
		}, {
			originX: 'start',
			originY: 'top',
			overlayX: 'start',
			overlayY: 'bottom',
		}
	];
	_backDropClickSub: Subscription;
	_compRef: ComponentRef<unknown>;

	constructor(private _overlay: Overlay, private injector: Injector) { }

	open(elToAttach: HTMLElement, comp: ComponentType<unknown>, config?: any) {
		const customInjectors = this._createCustomInjector(config);
		this._compRef = this._createAndAttachPanel(elToAttach, comp, customInjectors);
		this.subscribeToBackDropClick();
	}

	_createAndAttachPanel(el: HTMLElement, comp: ComponentType<unknown>, customInjectors?: PortalInjector) {
		this._overlayRef = this._overlay.create(this._getOverlayConfig(el));
		const panelPortal = new ComponentPortal(comp, null, customInjectors);
		return this._overlayRef.attach(panelPortal);
	}

	_createCustomInjector(config: any) {
		const customInjectors = new WeakMap();
		customInjectors.set(DESC_PANEL_DATA, config);
		return new PortalInjector(this.injector, customInjectors);
	}

	_getOverlayConfig(el: HTMLElement) {
		const positionStrategy = this._overlay.position()
			.flexibleConnectedTo(el)
			.withLockedPosition(true)
			.withViewportMargin(50)
			.withFlexibleDimensions(true)
			.withPositions(this.positions);
		const overlayConfig: OverlayConfig = {
			positionStrategy,
			hasBackdrop: true,
			disposeOnNavigation: true,
			maxHeight: '5rem',
			backdropClass: 'desc-panel-backdrop',
			scrollStrategy: this._overlay.scrollStrategies.reposition({
				autoClose: false
			})
		}
		return overlayConfig;
	}

	_detachPanel() {
		this._overlayRef && this._overlayRef.detach();
	}

	_disposeOverlayRef() {
		this._overlayRef && this._overlayRef.dispose();
	}

	private subscribeToBackDropClick() {
		this._backDropClickSub = this._overlayRef.backdropClick().subscribe((...a) => {
			this.close();
		});
	}

	private close() {
		if (this._compRef) {
			this._compRef.destroy();
		}
		// this._detachPanel();
		this._disposeOverlayRef();
		this._backDropClickSub.unsubscribe();
	}
}

