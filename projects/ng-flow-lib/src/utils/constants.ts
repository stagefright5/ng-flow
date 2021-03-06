import { InjectionToken } from '@angular/core';

export const WHEEL_DATA = new InjectionToken<any>('DescriptionPanelData');

export const NODE_DATA = new InjectionToken<any>('CustomNodeData');

export enum Directions {
	FROM_LEFT = 0,
	FROM_RIGHT,
	FROM_TOP,
}
export const Selectors = {
	NODE: 'node',
	FLOW: 'flow,[flow]',
	WHEEL: 'wheel',
};
export const NodeIdPrefix = 'node_no_';
export const Events = {
	NODE_DELETE: 'node-delete',
};
export const Classes = {
	FLOW: 'ng_flow_class_ng-flow',
	NODE_CONTAINER: 'ng_flow_class_nodes-container',
	CONNECTORS_CONTAINER: 'ng_flow_class_leader-lines-container',
};
