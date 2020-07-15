import { Injectable, ComponentRef, Injector, InjectionToken } from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DescPanelRef } from '../utils/desc-panel-ref';

@Injectable({
	providedIn: 'root',
})
export class OverlayService {
	_backDropClickSub: Subscription;
	_containerRef: ComponentRef<unknown>;

	constructor(private _overlay: Overlay, private injector: Injector) {}

	open({
		elToAttach,
		comp,
		injectionData = {},
		injectionToken,
	}: {
		elToAttach: HTMLElement;
		comp: ComponentType<unknown>;
		injectionData: any;
		injectionToken: InjectionToken<any>;
	}) {
		const _overlayRef = this._createOverlay(elToAttach);
		const _containerRef = this._attachPanelContainer(_overlayRef, comp, injectionData, injectionToken);
		const _panelRef = new DescPanelRef(_overlayRef, _containerRef, injectionData);
		return _panelRef;
	}

	_createOverlay(elToAttach: HTMLElement) {
		return this._overlay.create(this._getOverlayConfig(elToAttach));
	}

	_attachPanelContainer(
		_overlayRef: OverlayRef,
		comp: ComponentType<unknown>,
		injectionData: any,
		injectionToken: InjectionToken<any>
	) {
		const customInjectors = this._createCustomInjector(injectionData, injectionToken);
		const panelPortal = new ComponentPortal(comp, null, customInjectors);
		const containerRef = _overlayRef.attach(panelPortal);
		return containerRef;
	}

	_createCustomInjector(config = {}, injectionToken: InjectionToken<any>) {
		const customInjectors = new WeakMap();
		customInjectors.set(injectionToken, config);
		return new PortalInjector(this.injector, customInjectors);
	}

	_getOverlayConfig(el: HTMLElement) {
		const positions: ConnectedPosition[] = [
			{
				originX: 'center',
				originY: 'bottom',
				overlayX: 'end',
				overlayY: 'top',
			},
			{
				originX: 'start',
				originY: 'top',
				overlayX: 'start',
				overlayY: 'bottom',
			},
			{
				originX: 'start',
				originY: 'top',
				overlayX: 'end',
				overlayY: 'bottom',
			},
			{
				originX: 'start',
				originY: 'bottom',
				overlayX: 'start',
				overlayY: 'top',
			},
		];
		const positionStrategy = this._overlay.position().flexibleConnectedTo(el).withPositions(positions);
		const overlayConfig: OverlayConfig = {
			positionStrategy,
			hasBackdrop: true,
			// disposeOnNavigation: true,
			// maxHeight: '30rem',
			// maxWidth: '20rem',
			backdropClass: 'desc-panel-backdrop',
			panelClass: 'desc-panel',
			scrollStrategy: this._overlay.scrollStrategies.block(),
		};
		return overlayConfig;
	}
}
