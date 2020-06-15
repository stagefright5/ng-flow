import { Node } from '../utils/TypeDefs';
import { ElementRef, Injectable } from '@angular/core';
import { Directions } from '../utils/constants';
import { History } from '../utils/history';

@Injectable({
	providedIn: 'root'
})
export class PositionService {
	unit: number = 0;
	history = new History(Infinity);

	private _nodeGap = 0;
	private _parentElm: HTMLElement;
	private _defaultNodeSize: Node.Dimension;
	private _parentElmRect: DOMRect;
	private _dirs = Directions;

	constructor() {}

	init(elmRef: ElementRef, rowHeight: number, nodeWidth: number, gap: number) {
		this._parentElm = elmRef.nativeElement;
		this._defaultNodeSize = { width: 0, height: 0 };
		this.unit = 1 || parseFloat(getComputedStyle(document.querySelector('html')).fontSize);
		/*-- this.unit dependent properties --*/
		this._defaultNodeSize.height = rowHeight;
		this._defaultNodeSize.width = nodeWidth;
		this._nodeGap = gap || this._defaultNodeSize.width * 0.5;
	}

	getAddingNodePos(node: Node.Data): Node.Position {
		const thisNodeCompleteSpace = this.entireSpaceOccupiedByNode(node);
		let nodeTop = 0;
		let nodeLeft = 0;
		const l = this.history.length - 1;
		let _direction = this._dirs.FROM_LEFT;
		const prevNode = <Node.PositionHistoryEntry>this.history.latest;
		let rowNum = (prevNode && prevNode.row) || 0;
		if (l > -1) {
			// Assuming that this node will be rendered to the right of the previous node.
			let _leftPosAdditionFactor = thisNodeCompleteSpace.width;
			const prevfromDir = prevNode && prevNode.direction;
			const prevPrevFromDir =
				this.history.get(l - 1) && (<Node.PositionHistoryEntry>this.history.get(l - 1)).direction;
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
					 *	------	   		  	  ------
					 *	|     |	  		 	  |	    |
					 *	| ppp |-------------->|  pp |
					 *	|     |	   		 	  |     |
					 *	------            	  ------
					 *		   		       		|
					 *		   		       		|
					 *		   		  	   		v
					 *		   			 	------
					 *		   	    		|     |
					 *	[new_node]<-----	|  p  |
					 *	^	   	    		|     |
					 *	|	  				------
					 *	|				    |
					 *	|				    |
					 * 	|<---addnFactor---->|
					 *  |
					 * This is the new left
					 *
					 *
					 * And, the new node goes "from right" to left
					 */
					_leftPosAdditionFactor = -thisNodeCompleteSpace.width;
					_direction = this._dirs.FROM_RIGHT;
				} else if (prevPrevFromDir === this._dirs.FROM_RIGHT) {
					/**
					 * If true, the flow will look something like this:
					 *	------	   		 ------
					 *	|     |	  		 |	   |
					 *	| pp  |<---------| ppp |
					 *	|     |	   		 |     |
					 *	------           ------
					 * 	  |
					 * 	  |
					 * 	  v
					 * ------
					 * |     |
					 * |  p  |------->[new_node]
					 * |     |				   ^
					 * ------				   |
					 * 		 |				   |
					 * 		 |				   |
					 *		 |<---addnFactor-->|
					 * 		 |				   |
					 * 					This is the new left
					 *
					 *
					 * And, the new node goes "from left" to right
					 */
					_leftPosAdditionFactor = prevNode.hSpace;
					_direction = this._dirs.FROM_LEFT;
				} else {
					/**
					 * Which means, there was no right or left space for the previous and
					 * previous to previous nodes. Hence, the new node should be rendered in a
					 * new row.
					 * 		  |
					 * 		  |
					 * 		  v
					 * 		------
					 * 	    |     |
					 * 		| pp  |
					 * 		|     |
					 *		------
					 * 		  |
					 * 		  |
					 * 		  v
					 * 		------
					 * 	    |     |
					 * 		|  p  |
					 * 		|     |
					 *		------
					 * 		  |
					 * 		  |
					 * 		  v
					 * 	  [new_node]
					 */
				}
			} else if (prevfromDir === this._dirs.FROM_RIGHT) {
				/**
				 * If true, the flow will look something like this:
				 * 				   		 ------
				 * 				  		 |	   |
				 *    [new_node]<--------| pp  |<-----
				 *    ^				 	 |     |
				 *    |					 ------
				 * 	  |					 |
				 * 	  |<---addnFactor--->|
				 *    |
				 * This is the new left
				 *  And, the new node goes "from right" to left
				 */
				_leftPosAdditionFactor = -thisNodeCompleteSpace.width; // taking the leftmost coordinate
				_direction = this._dirs.FROM_RIGHT;
			} else if (prevfromDir === this._dirs.FROM_LEFT) {
				/**
				 * If true, the flow will look something like this:
				 *  	 ------
				 * 		 |	   |
				 * ----->|  pp |------> [new_node]
				 * 		 |     |				 ^
				 * 		 ------					 |
				 * 			   |				 |
				 * 			   |<---addnFactor-->|
				 * 			   |				 |
				 * 						This is the new left
				 *
				 * And, the new node goes "from left" to right
				 */
				_leftPosAdditionFactor = prevNode.hSpace;
				_direction = this._dirs.FROM_LEFT;
			}

			// Get the node's "left" value by adding to the previous node's left position.
			nodeLeft = prevNode.left + _leftPosAdditionFactor;

			const thisNodeWidth = this.getNodeSize(node).width;

			/** Start: Check if the node is overflowing its container and update the "nodeLeft" **/
			const leftOverflow = nodeLeft < 0;
			const rightOverflow = nodeLeft + thisNodeWidth > this.ENCLOSING_RECT.width;
			if (rightOverflow || leftOverflow) {
				if (rightOverflow) {
					// rollback calculated width
					const latestNodeWidth = prevNode.hSpace - this._nodeGap;
					const diffInWidth = thisNodeWidth - latestNodeWidth;
					nodeLeft = prevNode.left - diffInWidth;
				} else if (leftOverflow) {
					nodeLeft = prevNode.left;
				}
				// This node should be rendered in a new row
				rowNum = rowNum + 1;
				// Which also means that the direction is "FROM_TOP"
				_direction = this._dirs.FROM_TOP;
			}
			/** End: Check if the node is overflowing its container **/
		}

		/** Start: Calculate the "top" value **/
		nodeTop = rowNum * (this._defaultNodeSize.height + this._nodeGap);
		if (!node.height || node.height >= this._defaultNodeSize.height) {
			// No need to position the node vertically as it will take the entire height of the row
		} else {
			// Now, that needs to be rePositioned to the center of the virtaul "row"
			nodeTop = nodeTop + (this._defaultNodeSize.height - node.height) / 2;
		}
		/** End: Calculate the "top" value **/

		this.history.push<Node.PositionHistoryEntry>({
			left: nodeLeft,
			top: nodeTop,
			hSpace: thisNodeCompleteSpace.width,
			row: rowNum,
			direction: _direction
			/**
			 * // WATCHOUT: May be store the "node" (Data) in the history
			 * node: node
			 */
		});
		return {
			top: nodeTop,
			left: nodeLeft
		};
	}

	entireSpaceOccupiedByNode(node: Node.Data): Node.Dimension {
		const s = this.getNodeSize(node);
		return {
			width: this._nodeGap + s.width,
			height: this._nodeGap + s.height
		};
	}

	getNodeSize(node) {
		return {
			width: node.width || this._defaultNodeSize.width,
			height:
				!node.height || node.height >= this._defaultNodeSize.height ? this._defaultNodeSize.height : node.height
		};
	}

	calculateNodesPositions(nodes: Array<Node.Data>) {
		const positonsArray = [];
		nodes.forEach(nodeData => {
			positonsArray.push(this.getAddingNodePos(nodeData));
		});
		return positonsArray.map(({ top, left }) => ({ top, left }));
	}

	private get ENCLOSING_RECT(): DOMRect {
		this._parentElmRect = <DOMRect>(this._parentElmRect || this._parentElm.getBoundingClientRect());
		return this._parentElmRect;
	}

	get NODES_TOTAL_HEIGHT(): string {
		return (
			(<Node.PositionHistoryEntry>this.history.latest).top + this._defaultNodeSize.height + this._nodeGap + 'px'
		);
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
		this._defaultNodeSize = null;
		this.resetStores();
		this.unit = null;
		this._nodeGap = null;
	}
}
