import { Coach, Train } from '../utils/TypeDefs';
import { ElementRef, Injectable, QueryList } from '@angular/core';
import { from_direction_track, selectors } from '../utils/constants';
import { PositonHistory } from '../utils/position-history';
import { DynamicComponentService } from './dynamic-component.service';
import { CoachComponent } from '../node/node.component';

@Injectable({
	providedIn: 'root'
})
export class PositionService {

	rows = 0;
	unit: number = 0;
	positionHistory = new PositonHistory(2);

	private _nodeGap = 0;
	private _parentElm: HTMLElement;
	private _nodeDimension = <Coach.Dimension>{};
	private _parentElmRect: DOMRect;
	private fromDirections = from_direction_track;

	constructor(private dynamicComponentService: DynamicComponentService) { }

	init(elmRef: ElementRef, initialNodeDimension: Coach.Dimension) {
		this._parentElm = elmRef.nativeElement;
		this.unit = parseFloat(getComputedStyle(document.querySelector('html')).fontSize);
		/*-- this.unit dependent properties --*/
		Object.entries(initialNodeDimension).forEach(([k, v]) => {
			this._nodeDimension[k] = v * this.unit;
		})
		this._nodeGap = 5 * this.unit;
	}

	getAddingNodePos(): Coach.Position {
		const oneNodeSpace = this.spaceForOneNode;
		const positionObject = <Coach.Position>{
			left: 0,
			top: 0
		}
		const l = this.positionHistory.length - 1;
		let _direction = this.fromDirections.FROM_LEFT
		if (l > -1) {
			let prevNodeLeftPos = this.prevNodePos.leftPos;
			let newLeftPosContainer = prevNodeLeftPos + this.spaceForOneNode.width;
			let _additionFactor = 0;
			const prevfromDir = this.positionHistory.get(l) && this.positionHistory.get(l).direction;
			const prevPrevFromDir = this.positionHistory.get(l - 1) && this.positionHistory.get(l - 1).direction;
			_direction = prevfromDir || _direction;

			if (prevfromDir === this.fromDirections.FROM_TOP) {
				// check the history upto 2 and decide the "direction"
				if (prevPrevFromDir === this.fromDirections.FROM_LEFT) {
					_additionFactor = -this.spaceForOneNode.width;
					_direction = this.fromDirections.FROM_RIGHT;
				} else if (prevPrevFromDir === this.fromDirections.FROM_RIGHT) {
					_additionFactor = this.spaceForOneNode.width;
					_direction = this.fromDirections.FROM_LEFT
				}
			} else {
				if (prevfromDir === this.fromDirections.FROM_LEFT) {
					_additionFactor = this.spaceForOneNode.width;
					_direction = prevfromDir;
				} else if (prevfromDir === this.fromDirections.FROM_RIGHT) {
					_additionFactor = -this.spaceForOneNode.width;
					_direction = prevfromDir;
				}
			}
			if (_additionFactor) {
				newLeftPosContainer += _additionFactor - this.spaceForOneNode.width;
			}
			const leftOverflow = newLeftPosContainer < 0;
			const rightOverflow = (newLeftPosContainer + this._nodeDimension.width) > this.parentElmRect.width;
			if (rightOverflow || leftOverflow) {
				if (rightOverflow) {
					// rollback calculated width
					newLeftPosContainer = prevNodeLeftPos;
				} else if (leftOverflow) {
					newLeftPosContainer = 0;
				}
				// This node should be rendered in a new row
				this.rows++;
				// Which also means that the direction is "FROM_TOP"
				_direction = this.fromDirections.FROM_TOP
			}

			positionObject.top = this.rows * (oneNodeSpace.height + this._nodeGap);
			positionObject.left = newLeftPosContainer;
		}
		this.positionHistory.add({
			...positionObject,
			direction: _direction
		});
		return positionObject;
	}


	private get spaceForOneNode(): Coach.Dimension {
		return ({
			width: this._nodeGap + this._nodeDimension.width,
			height: this._nodeDimension.height
		});
	}

	private get prevNodePos() {
		const leftPos = this.positionHistory.get(this.positionHistory.length - 1) && this.positionHistory.get(this.positionHistory.length - 1).left || 0;
		const rightPos = leftPos + this._nodeDimension.width
		return ({
			leftPos,
			rightPos
		});
	}

	private get parentElmRect(): DOMRect {
		this._parentElmRect = <DOMRect>(this._parentElmRect || this._parentElm.getBoundingClientRect());
		return this._parentElmRect;
	}

	clearHistory() {
		this.positionHistory.clear();
	}
}
