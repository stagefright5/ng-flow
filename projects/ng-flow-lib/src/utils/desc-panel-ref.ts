import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { filter } from 'rxjs/operators';

export class DescPanelRef {
	constructor(private _overlayRef: OverlayRef, private _config: any) {
		this._subscribeToKeyDownEvts();
		this._subscribeToBackDropClick();
	}

	private _subscribeToBackDropClick() {
		this._overlayRef.backdropClick().subscribe((...a) => {
			this.close();
		});
	}

	private _subscribeToKeyDownEvts() {
		this._overlayRef
			.keydownEvents()
			.pipe(
				filter(event => {
					return event.keyCode === ESCAPE && !this._config.disableClose && !hasModifierKey(event);
				})
			)
			.subscribe(e => {
				e.preventDefault();
				this.close();
			});
	}

	close() {
		this._detachPanel();
		this._disposeOverlayRef();
	}

	private _detachPanel() {
		if (this._overlayRef) {
			this._overlayRef.detach();
		}
	}

	private _disposeOverlayRef() {
		this._overlayRef && this._overlayRef.dispose();
	}
}
