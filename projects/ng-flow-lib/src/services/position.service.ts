import { Node } from "../utils/TypeDefs";
import { ElementRef, Injectable } from "@angular/core";
import { Directions } from "../utils/constants";
import { History } from "../utils/history";

@Injectable({
	providedIn: "root"
})
export class PositionService {
	unit: number = 0;
	history = new History(Infinity);

	private _nodeGap = 0;
	private _parentElm: HTMLElement;
	private _nodeDimension: Node.Dimension;
	private _parentElmRect: DOMRect;
	private _dirs = Directions;

	constructor() { }

	init(elmRef: ElementRef, initialNodeDimension: Node.Dimension, gap: number) {
		this._parentElm = elmRef.nativeElement;
		this._nodeDimension = { width: 0, height: 0 };
		this.unit = 1 || parseFloat(getComputedStyle(document.querySelector("html")).fontSize);
		/*-- this.unit dependent properties --*/
		Object.entries(initialNodeDimension).forEach(([k, v]) => {
			this._nodeDimension[k] = parseFloat(v) * this.unit;
		});
		this._nodeGap = parseFloat(gap + "") || this._nodeDimension.width * 0.5;
	}

	getAddingNodePos(node): Node.Position {
		const oneNodeSpace = this.ONE_NODE_SPACE;
		const positionObject = <Node.Position>{
			left: 0,
			top: 0
		};
		const l = this.history.length - 1;
		let _direction = this._dirs.FROM_LEFT;
		let rowNum = (this.history.latest && (<Node.PositionHistoryEntry>this.history.latest).row) || 0;
		if (l > -1) {
			let prevNodeLeftPos = this.latestNodePos.leftPos;
			// Assuming that this node will be rendered to the right of the previous node.
			let _leftPosAdditionFactor = this.ONE_NODE_SPACE.width;
			const prevfromDir = this.history.latest && (<Node.PositionHistoryEntry>this.history.latest).direction;
			const prevPrevFromDir = this.history.get(l - 1) && (<Node.PositionHistoryEntry>this.history.get(l - 1)).direction;
			_direction = prevfromDir || _direction;

			if (prevfromDir === this._dirs.FROM_TOP) {
				/**
				 * 		  |
				 * 		  |
				 * 		  v
				 * 		 ------
				 * 	    |     |
				 * 		|  p  |
				 * 		|     |
				 *		------ 
				 */
				// check the history upto 2 and decide the "direction"
				if (prevPrevFromDir === this._dirs.FROM_LEFT) {
					/**
					 * If true, the flow will look something like this:
					 *	 ------	   		  ------	
					 *	|     |	  		 |	   |
					 *	| ppp |--------->|  pp |
					 *	|     |	   		 |     |
					 *	------           ------
					 *		   		       |
					 *		   		       |
					 *		   		  	   v
					 *		   			 ------
					 *		   	    	|     |
					 *	[new_node]<-----|  p  |
					 *		   	    	|     |
					 *		  			------ 
					 */
					_leftPosAdditionFactor = -this.ONE_NODE_SPACE.width;
					_direction = this._dirs.FROM_RIGHT;
				} else if (prevPrevFromDir === this._dirs.FROM_RIGHT) {
					/**
					 * If true, the flow will look something like this:
					 *	 ------	   		  ------	
					 *	|     |	  		 |	   |
					 *	| pp  |<---------| ppp |
					 *	|     |	   		 |     |
					 *	------           ------
					 * 	  |
					 * 	  |
					 * 	  v
					 *  ------
					 * |     |
					 * |  p  |------->[new_node]
					 * |     |
					 * ------ 
					 */
					_leftPosAdditionFactor = this.ONE_NODE_SPACE.width;
					_direction = this._dirs.FROM_LEFT;
				} else {
					/**
					  * Which means, there was no right or left space for the previous and
					  * previous to previous nodes. Hence, the new node should be rendered in a
					  * new row.
					  * 		  |
					  * 		  |
					  * 		  v
					  * 		 ------
					  * 	    |     |
					  * 		| pp  |
					  * 		|     |
					  *			------ 
					  * 		  |
					  * 		  |
					  * 		  v
					  * 		 ------
					  * 	    |     |
					  * 		|  p  |
					  * 		|     |
					  *			------ 
					  * 		  |
					  * 		  |
					  * 		  v
					  * 	  [new_node]
					  */
				}
			} else {
				if (prevfromDir === this._dirs.FROM_LEFT) {
					/**
					 * If true, the flow will look something like this:
					 *  	  ------	
					 * 		 |	   |
					 * ----->|  pp |------> [new_node]
					 * 		 |     |
					 * 		 ------
					 */
					_leftPosAdditionFactor = this.ONE_NODE_SPACE.width;
					_direction = prevfromDir;
				} else if (prevfromDir === this._dirs.FROM_RIGHT) {
					/**
					 * If true, the flow will look something like this:
					 * 				   ------
					 * 				  |	    |
					 *[new_node]<-----|  pp |<-----
					 * 				  |     |
					 * 				  ------
					 */
					_leftPosAdditionFactor = -this.ONE_NODE_SPACE.width;
					_direction = prevfromDir;
				}
			}

			// Get the node's "left" value by adding to the previous node's left position.
			let newLeftPosContainer = prevNodeLeftPos + _leftPosAdditionFactor;
			
			const leftOverflow = newLeftPosContainer < 0;
			const rightOverflow = newLeftPosContainer + this._nodeDimension.width > this.ENCLOSING_RECT.width;
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
				_direction = this._dirs.FROM_TOP;
			}

			positionObject.top = rowNum * (oneNodeSpace.height + this._nodeGap);
			positionObject.left = newLeftPosContainer;
		}
		this.history.push<Node.PositionHistoryEntry>({
			...positionObject,
			row: rowNum,
			direction: _direction,
			/**
			 * // WATCHOUT: May be store the "node" (Data) in the history
			 * node: node
			 */
		});
		return positionObject;
	}

	calculateNodesPositions(nodes: Array<Node.Data>) {
		const positonsArray = [];
		nodes.forEach(nodeData => {
			positonsArray.push(this.getAddingNodePos(nodeData));
		});
		return positonsArray.map(({ top, left }) => ({ top, left }));
	}

	private get ONE_NODE_SPACE(): { width: number; height: number } {
		return {
			width: this._nodeGap + this._nodeDimension.width,
			height: this._nodeDimension.height
		};
	}

	private get latestNodePos() {
		const leftPos =
			(this.history.latest && (<Node.PositionHistoryEntry>this.history.latest).left) || 0;
		const rightPos = leftPos + this._nodeDimension.width;
		return {
			leftPos,
			rightPos
		};
	}

	private get ENCLOSING_RECT(): DOMRect {
		this._parentElmRect = <DOMRect>(this._parentElmRect || this._parentElm.getBoundingClientRect());
		return this._parentElmRect;
	}

	get NODES_TOTAL_HEIGHT(): string {
		return ((<Node.PositionHistoryEntry>this.history.latest).row + 1) * (this.ONE_NODE_SPACE.height + this._nodeGap) + 'px';
	}

	clearHistory() {
		this.history.clear();
	}

	resetStores() {
		this.clearHistory();
		this._parentElmRect = null;
	}

	cleanup() {
		this._parentElm = null;
		this._nodeDimension = null;
		this.resetStores();
		this.unit = null;
		this._nodeGap = null;
	}
}
