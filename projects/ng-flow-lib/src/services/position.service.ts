import { Node } from '../utils/TypeDefs';
import { ElementRef, Injectable } from '@angular/core';
import { CONST_DIRECTIONS } from '../utils/constants';
import { PositonHistory } from '../utils/position-history';

@Injectable({
	providedIn: 'root'
})
export class PositionService {

	unit: number = 0;
	history = new PositonHistory(Infinity);

	private _nodeGap = 0;
	private _parentElm: HTMLElement;
	private _nodeDimension = <Node.Dimension>{};
	private _parentElmRect: DOMRect;
	private _DIRECTIONS = CONST_DIRECTIONS;

	constructor() { }

	init(elmRef: ElementRef, initialNodeDimension: Node.Dimension) {
		this._parentElm = elmRef.nativeElement;
		this.unit = parseFloat(getComputedStyle(document.querySelector('html')).fontSize);
		/*-- this.unit dependent properties --*/
		Object.entries(initialNodeDimension).forEach(([k, v]) => {
			this._nodeDimension[k] = v * this.unit;
		})
		this._nodeGap = 5 * this.unit;
	}

	getAddingNodePos(node): Node.Position {
		const oneNodeSpace = this.ONE_NODE_SPACE;
		const positionObject = <Node.Position>{
			left: 0,
			top: 0
		}
		const l = this.history.length - 1;
		let _direction = this._DIRECTIONS.FROM_LEFT;
		let rowNum = this.history.recent && this.history.recent.row || 0;
		if (l > -1) {
			let prevNodeLeftPos = this.prevNodePos.leftPos;
			let newLeftPosContainer = prevNodeLeftPos + this.ONE_NODE_SPACE.width;
			let _additionFactor = 0;
			const prevfromDir = this.history.get(l) && this.history.get(l).direction;
			const prevPrevFromDir = this.history.get(l - 1) && this.history.get(l - 1).direction;
			_direction = prevfromDir || _direction;

			if (prevfromDir === this._DIRECTIONS.FROM_TOP) {
				// check the history upto 2 and decide the "direction"
				if (prevPrevFromDir === this._DIRECTIONS.FROM_LEFT) {
					_additionFactor = -this.ONE_NODE_SPACE.width;
					_direction = this._DIRECTIONS.FROM_RIGHT;
				} else if (prevPrevFromDir === this._DIRECTIONS.FROM_RIGHT) {
					_additionFactor = this.ONE_NODE_SPACE.width;
					_direction = this._DIRECTIONS.FROM_LEFT
				}
			} else {
				if (prevfromDir === this._DIRECTIONS.FROM_LEFT) {
					_additionFactor = this.ONE_NODE_SPACE.width;
					_direction = prevfromDir;
				} else if (prevfromDir === this._DIRECTIONS.FROM_RIGHT) {
					_additionFactor = -this.ONE_NODE_SPACE.width;
					_direction = prevfromDir;
				}
			}
			if (_additionFactor) {
				newLeftPosContainer += _additionFactor - this.ONE_NODE_SPACE.width;
			}
			const leftOverflow = newLeftPosContainer < 0;
			const rightOverflow = (newLeftPosContainer + this._nodeDimension.width) > this.ENCLOSING_RECT.width;
			if (rightOverflow || leftOverflow) {
				if (rightOverflow) {
					// rollback calculated width
					newLeftPosContainer = prevNodeLeftPos;
				} else if (leftOverflow) {
					newLeftPosContainer = 0;
				}
				// This node should be rendered in a new row
				rowNum = rowNum + 1;
				// Which also means that the direction is "FROM_TOP"
				_direction = this._DIRECTIONS.FROM_TOP
			}

			positionObject.top = rowNum * (oneNodeSpace.height + this._nodeGap);
			positionObject.left = newLeftPosContainer;
		}
		this.history.push({
			...positionObject,
			row: rowNum,
			direction: _direction,
			node: node
		});
		return positionObject;
	}


	private get ONE_NODE_SPACE(): Node.Dimension {
		return ({
			width: this._nodeGap + this._nodeDimension.width,
			height: this._nodeDimension.height
		});
	}

	private get prevNodePos() {
		const leftPos = this.history.get(this.history.length - 1) && this.history.get(this.history.length - 1).left || 0;
		const rightPos = leftPos + this._nodeDimension.width
		return ({
			leftPos,
			rightPos
		});
	}

	private get ENCLOSING_RECT(): DOMRect {
		this._parentElmRect = <DOMRect>(this._parentElmRect || this._parentElm.getBoundingClientRect());
		return this._parentElmRect;
	}

	clearHistory() {
		this.history.clear();
	}

	prepareForRecalculation() {
		this.clearHistory();
		this.rows = 0;
		this._parentElmRect = null;
	}
}
