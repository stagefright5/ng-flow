import { Injectable } from '@angular/core';
import { Overlay, ConnectedPositionStrategy, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class OverlayService {
	overlayRef: OverlayRef;
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
	backDropClickSub: Subscription;

	constructor(private overlay: Overlay) { }

	createAndAttachPanel(el: HTMLElement, comp: ComponentType<unknown>) {
		const positionStrategy = this.overlay.position()
			.flexibleConnectedTo(el)
			.withPositions(this.positions);
		this.overlayRef = this.overlay.create({
			positionStrategy,
			hasBackdrop: true,
			disposeOnNavigation: true,
			maxWidth: 'content',
			maxHeight: 'content',
			backdropClass: 'desc-panel-backdrop'
		});
		this.subscribeToBackDropClick();
		const panelPortal = new ComponentPortal(comp);
		this.overlayRef.attach(panelPortal);
	}

	detachPanel() {
		this.overlayRef.detach();
	}

	disposeOverlayRef() {
		this.backDropClickSub.unsubscribe();
		this.overlayRef.dispose();
	}

	private subscribeToBackDropClick() {
		this.backDropClickSub = this.overlayRef.backdropClick().subscribe(() => {
			this.detachPanel();
			this.disposeOverlayRef();
		})
	}
}
