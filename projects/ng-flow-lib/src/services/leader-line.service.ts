import { Injectable, NgZone } from "@angular/core";
import { Connector } from "../utils/TypeDefs";
import { _ } from "../utils/generic-ops";
import { PubSubService } from "./pub-sub.service";
import { Events } from "../utils/constants";
@Injectable({
	providedIn: "root"
})
export class LeaderLineService {
	connectors = new Map();
	leaderLineDrawOptions: Partial<Connector.DrawConnectorOptions> = {
		path: "fluid",
		startSocket: "auto",
		endSocket: "auto",
		startPlug: "behind"
	};

	constructor(private zone: NgZone, private pubSub: PubSubService) {
		this._subscribeForEvts();
	}

	drawConnector(opts: Connector.DrawConnectorOptions) {
		if (opts.start && opts.end) {
			opts.start =
				typeof opts.start === "string"
					? document.getElementById(opts.start)
					: opts.start;
			opts.end =
				typeof opts.end === "string"
					? document.getElementById(opts.end)
					: opts.end;
			this.zone.runOutsideAngular(() => {
				opts = { ...this.leaderLineDrawOptions, ...(opts && opts) };
				this.connectors.set(opts, new LeaderLine(opts));
			});
		} else {
			console.log(
				"Could not draw connector between",
				opts.start,
				opts.end
			);
		}
	}

	each(cb: (v: any, index, arr: any[]) => void) {
		Object.values(this.connectors).forEach(cb);
	}

	removeConnector(con) {
		con.remove();
	}

	removeAllConnectors() {
		this.connectors.forEach((value, key) => {
			this.connectors.delete(key);
			this.removeConnector(value);
		});
	}

	refreshConnectors() {
		this.connectors.forEach((v, k) => v.position());
	}

	private _getLLKey(start: string | HTMLElement, end: string | HTMLElement) {
		if (typeof start !== "string") {
			start = _.attr(start, "id");
		}
		if (typeof end !== "string") {
			end = _.attr(end, "id");
		}
		return { start, end };
	}

	private _subscribeForEvts() {
		this.pubSub.$sub(Events.NODE_DELETE, obj => {
			console.log(obj.id + " :: " + Events.NODE_DELETE + "d");
			this.connectors.forEach((value, key) => {
				if (
					obj.id === _.attr(key.start, "id") ||
					obj.id === _.attr(key.end, "id")
				) {
					this.connectors.delete(key);
					this.removeConnector(value);
				}
			});
		});
	}
}
