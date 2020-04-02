import { Injectable, NgZone } from '@angular/core';
import { Subscription, pipe } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators'
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Injectable({ providedIn: 'root' })
export class LeaderLineService {
	constructor(private zone: NgZone, private mediaObserver: MediaObserver) {
		this._subsForMediaChange();
	}
	connectors = {};
	mChangeObservers: Array<(change: MediaChange) => void> = [];
	leaderLineDrawOptions = {
		path: 'grid',
		startSocket: 'auto',
		endSocket: 'auto'
	};
	mediaObserverSubs: Subscription;
	drawConnector(opts: { start: string, end: string, path?: string, startSocket?: string, endSocket?: string }) {
		const startEndObj = {
			start: document.getElementById(opts.start),
			end: document.getElementById(opts.end)
		}
		this.zone.runOutsideAngular(() => {
			setTimeout(() => {
				this.connectors[opts.start] = new LeaderLine(Object.assign(this.leaderLineDrawOptions, opts, startEndObj));
			});
		});
	}

	//TODO: Not being called from anywhere.
	subscribeToMediaChange(mediaChangeObserver: (change: MediaChange) => void) {
		this.mChangeObservers.push(mediaChangeObserver);
	}

	_subsForMediaChange() {
		this.mediaObserverSubs = this.mediaObserver.media$.pipe(
			filter(v => v.matches),
			distinctUntilChanged((a, b) => a.mqAlias !== b.mqAlias)
		).subscribe((c: MediaChange) => {
			this.mChangeObservers.forEach(a => a(c));
		})
	}

	private setSockets(start: string, end: string, line?: any) {
		if (line) {
			line.startSocket = start;
			line.endSocket = end;
		} else {
			const lines = Object.values(this.connectors);
			lines.forEach((line: any) => {
				line.startSocket = start;
				line.endSocket = end;
			});
		}
	}

	removeAllConnectors() {
		Object.values(this.connectors).forEach((v: any) => {
			v.remove();
		});
		this.connectors = {};
	}
}