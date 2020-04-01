import { Injectable, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Injectable({ providedIn: 'root' })
export class LeaderLineService {
	constructor(private zone: NgZone, private mediaObserver: MediaObserver) { }
	connectors = {};
	leaderLineDrawOptions = {
		path: 'grid',
		startSocket: 'auto',
		endSocket: 'auto'
	};
	subs = new Subscription();
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

	//TODO: Not being called from anywhere. change implemetation or remove.
	subscribeToMediaChange() {
		const mediaObserverSubs = this.mediaObserver.media$.subscribe((mChange: MediaChange) => {
			this.zone.runOutsideAngular(() => {
				setTimeout(() => {
					if (mChange.mqAlias === 'xs' && mChange.matches) {
						this.setSockets('bottom', 'top');
					} else {
						this.setSockets('right', 'left');
					}
				})
			})
		});
		this.subs.add(mediaObserverSubs);
		return mediaObserverSubs;
	}

	private setSockets(start: string, end: string, line?: any) {
		if (line) {
			line.startSocket = start;
			line.endSocket = end;
		} else {
			const lines = Object.values(this.connectors);
			// AnimEvent.add(() => {
			lines.forEach((line: any) => {
				line.startSocket = start;
				line.endSocket = end;
			});
			// });
		}

	}
}