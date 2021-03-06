import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, InjectionToken, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { DescPanelRef } from '../utils/desc-panel-ref';

@Injectable()
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
		const overlayRef = this._createOverlay(elToAttach);
		const panelRef = new DescPanelRef(overlayRef, injectionData);
		const customInjectors = this._createCustomInjector(injectionData, injectionToken, panelRef);
		const containerRef = this._attachPanelContainer(overlayRef, comp, customInjectors);
		this._subscribeForCloseActions(overlayRef, panelRef);
		return panelRef;
	}

	private _subscribeForCloseActions(_overlayRef: OverlayRef, panelRef: DescPanelRef) {
		_overlayRef.backdropClick().subscribe(_ => panelRef.close());
		_overlayRef
			.keydownEvents()
			.pipe(filter((e: KeyboardEvent) => e.keyCode === ESCAPE && !hasModifierKey(e)))
			.subscribe(_ => panelRef.close());
	}

	_createOverlay(elToAttach: HTMLElement) {
		return this._overlay.create(this._getOverlayConfig(elToAttach));
	}

	_attachPanelContainer(_overlayRef: OverlayRef, comp: ComponentType<unknown>, customInjectors) {
		const panelPortal = new ComponentPortal(comp, null, customInjectors);
		const containerRef = _overlayRef.attach(panelPortal);
		return containerRef;
	}

	_createCustomInjector(config = {}, injectionToken: InjectionToken<any>, panelRef: DescPanelRef) {
		const customInjectors = new WeakMap();
		customInjectors.set(DescPanelRef, panelRef);
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
