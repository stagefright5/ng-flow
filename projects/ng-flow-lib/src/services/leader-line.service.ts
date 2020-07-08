import { Injectable, NgZone, ElementRef } from '@angular/core';
import { Connector } from '../utils/typings';
import { _ } from '../utils/generic-ops';
import { PubSubService } from './pub-sub.service';
import { Events } from '../utils/constants';
import { Subscription } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class LeaderLineService {
	private _container: HTMLElement = null;
	private _curTranslate = null;
	private _leaderLineDrawOptions: Partial<Connector.DrawConnectorOptions> = null;
	private _nodeDestroySub: Subscription = null;

	connectors: Map<Connector.DrawConnectorOptions, any> = null;

	constructor(private zone: NgZone, private pubSub: PubSubService) {
		this._subscribeForEvts();
		LeaderLine.positionByWindowResize = false;
		window['connectors'] = this.connectors;
	}

	init(connCont: ElementRef) {
		this.connectors = new Map();
		this._container = connCont.nativeElement;
		this._curTranslate = {
			x: 0,
			y: 0
		};
		this._leaderLineDrawOptions = {
			path: 'fluid',
			startSocket: 'auto',
			endSocket: 'auto',
			startPlug: 'behind'
		};
		this.positionContainer();
		this.positionConnectors();
		this._fixPosition();
	}

	drawConnector(opts: Connector.DrawConnectorOptions) {
		if (opts.start && opts.end) {
			opts.start = typeof opts.start === 'string' ? document.getElementById(opts.start) : opts.start;
			opts.end = typeof opts.end === 'string' ? document.getElementById(opts.end) : opts.end;
			if (opts.start && opts.end && opts.start !== opts.end) {
				this.zone.runOutsideAngular(() =>
					setTimeout(() => {
						opts = { ...this._leaderLineDrawOptions, ...(opts && opts) };
						const line = new LeaderLine(opts);
						line.svgDOMRef = document.querySelector('body>.leader-line:last-of-type');
						this._container.appendChild(line.svgDOMRef);
						this.connectors.set(opts, line);
					})
				);
			} else {
				console.warn('Could not draw connector between', opts.start, opts.end);
			}
		} else {
			console.warn('Could not draw connector between', opts.start, opts.end);
		}
	}

	each(cb: (v: any, index, arr: any[]) => void) {
		Object.values(this.connectors).forEach(cb);
	}

	removeConnector(con: any) {
		document.body.appendChild(con.svgDOMRef);
		con.remove();
	}

	removeAllConnectors() {
		this.connectors.forEach((value, key) => {
			this.connectors.delete(key);
			this.removeConnector(value);
		});
	}

	positionContainer() {
		this._fixPosition(null, true);
	}

	positionConnectors() {
		this.connectors.forEach(v => v.position());
	}

	private _subscribeForEvts() {
		this._nodeDestroySub = this.pubSub.$sub(Events.NODE_DELETE, obj => {
			console.log(obj.id + ' :: ' + Events.NODE_DELETE + 'd');
			this.connectors.forEach((value, key) => {
				if (
					obj.id === _.attr(key.start as HTMLElement, 'id') ||
					obj.id === _.attr(key.end as HTMLElement, 'id')
				) {
					this.connectors.delete(key);
					this.removeConnector(value);
				}
			});
		});
	}

	private _fixPosition(line?: any, onlyContainer = false) {
		const containerBRect = this._container.getBoundingClientRect(),
			// Calculate how much the co-ordinate frame of the "this._container" should be moved so that it
			// aligns with that of the document.
			translate = {
				x: (containerBRect.left + this.pageXOffset) * -1,
				y: (containerBRect.top + this.pageYOffset) * -1
			};
		if (translate.x !== 0 || translate.y !== 0) {
			// Update position of wrapper by transforming so that it aligns with the co-ordinate system of
			// the document itself
			this._curTranslate.x += translate.x;
			this._curTranslate.y += translate.y;
			this._container.style.transform = `translate(${this._curTranslate.x}px, ${this._curTranslate.y}px)`;
			!onlyContainer && this.positionConnectors();
		} else if (!onlyContainer && line) {
			// Update position of target line
			console.log('Fix target line');
			line.position();
		}
	}

	private get pageXOffset() {
		return window.pageXOffset !== undefined
			? window.pageXOffset
			: (document.documentElement || document.body.parentNode || document.body)['scrollLeft'];
	}

	private get pageYOffset() {
		return window.pageYOffset !== undefined
			? window.pageYOffset
			: (document.documentElement || document.body.parentNode || document.body)['scrollTop'];
	}

	cleanup() {
		this.removeAllConnectors();
		if (this._nodeDestroySub) {
			this._nodeDestroySub.unsubscribe();
			this._nodeDestroySub = null;
		}
		this._container = null;
		this._curTranslate = null;
		this._leaderLineDrawOptions = null;
	}
}
