import { Injectable, NgZone } from '@angular/core';
import { FlowModule } from '../flow.module';
import { Connector } from '../utils/TypeDefs'

@Injectable({
	providedIn: FlowModule
})
export class LeaderLineService {
	connectors = {};
	leaderLineDrawOptions: Partial<Connector.DrawConnectorOptions> = {
		path: 'grid',
		startSocket: 'auto',
		endSocket: 'auto',
		startPlug: "behind"
	};

	constructor(private zone: NgZone) { }

	drawConnector(opts: Connector.DrawConnectorOptions) {
		if (opts.start && opts.end) {
			this.zone.runOutsideAngular(() => {
				const key = this._getKey(opts.start, opts.end);
				if (!this.connectors[key]) {
					this.connectors[key] = new LeaderLine({ ...this.leaderLineDrawOptions, ...(opts && opts) });
				}
			});
		} else {
			console.log('Could not draw connector between', opts.start, opts.end);
		}
	}

	each(cb: (v: any, index, arr: any[]) => void) {
		Object.values(this.connectors).forEach(cb);
	}

	removeAllConnectors() {
		this.each((v) => {
			delete this.connectors[this._getKey(v.start, v.end)];
			v.remove();
		});
	}

	refreshConnectors() {
		this.each((v) => v.position());
	}

	private _getKey(start: string | HTMLElement, end: string | HTMLElement) {
		if (typeof start !== 'string') {
			start = this._attr(start, 'id');
		}
		if (typeof end !== 'string') {
			end = this._attr(end, 'id');
		}
		return `${start}::${end}`;
	}

	private _attr(elm: HTMLElement, attr: string) {
		return elm.attributes.getNamedItem(attr).value;
	}
}