import { Coach } from './TypeDefs';
import { ElementRef } from '@angular/core';
import { from_direction_track } from './constants';

export class Position {

	rows = 0;
	unit: number = 0;
	positionHistory: Array<Coach.PositionHistoryEntry> = [];

	private _nodeGap = 0;
	private _parentElm: HTMLElement;
	private _nodeDimension = <Coach.Dimension>{};
	private _parentElmRect: DOMRect;
	private fromDirections = from_direction_track;

	constructor(elmRef: ElementRef, initialNodeDimension: Coach.Dimension) {
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
			const prevfromDir = this.positionHistory[l] && this.positionHistory[l].direction;
			const prevPrevFromDir = this.positionHistory[l - 1] && this.positionHistory[l - 1].direction;
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
			const rightOverflow = (newLeftPosContainer + this.spaceForOneNode.width) > this.parentElmRect.width;
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
		this.positionHistory.push({
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
		const leftPos = this.positionHistory[this.positionHistory.length - 1] && this.positionHistory[this.positionHistory.length - 1].left || 0;
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

	prepareForPosUpdate() {
		this.positionHistory = [];
	}
}
