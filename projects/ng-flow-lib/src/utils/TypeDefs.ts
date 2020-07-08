import { ViewContainerRef, ComponentRef, ComponentFactory, InjectionToken } from '@angular/core';
import { NodeComponent } from '../components/node/node.component';
import { Directions } from './constants';

export namespace Node {
	export type Description = null | Record<string, string>;
	export type Titles = Record<string, string>;

	export interface Config {
		id: string;
		wheels?: Wheel[];
		lastNode?: boolean;
		index?: number;
		component?: any;
		width?: number;
		height?: number;
		to?: FromToConnector[];
		from?: FromToConnector[];
		data?: CustomData;
	}

	export type FromToConnector =
		| string
		| {
				id: string;
				path: Connector.Path;
		  };

	export interface Wheel {
		icon?: string;
		descriptionPanel?: any;
		promoter?: boolean;
		data?: CustomData;
	}
	export interface Dimension {
		width: number;
		height: number;
	}

	export interface PositionHistoryEntry extends Position {
		direction: Directions;
		row: number;
		hSpace: number;
		// WATCHOUT: node: any;
	}

	export interface Position {
		top: number;
		left: number;
	}

	export interface New {
		flow?: ViewContainerRef;
		component?: typeof NodeComponent;
		id?: string;
		injection?: {
			data: CustomData;
			token: InjectionToken<any>;
		};
		inputBindings?: {
			nodeConfig?: Node.Config;
			position?: Node.Position;
			dimension?: Node.Dimension;
			promoteEvtCbFn?: (event: PromoteEventObject) => void;
		};
		outputBindings?: {
			nodeAdded?: (...args) => void;
		};
		__data__: Node.Config;
	}
}

type BindableProperty = {
	propName: string;
	templateName: string;
};
export interface AttachedComponent {
	compRef: ComponentRef<unknown>;
	selector: string,
	inputs: BindableProperty[];
	outputs: BindableProperty[];
	id?: string;
	__data__?: Node.Config;
}

export namespace Flow {
	export type Nodes = Node.Config[];
}

export namespace Connector {
	export interface DrawConnectorOptions {
		start?: HTMLElement | string;
		end?: HTMLElement | string;
		color?: string;
		size?: number;
		path?: Path;
		startSocket?: SocketPosition;
		endSocket?: SocketPosition;
		startSocketGravity?: number | string | number[] | string[];
		endSocketGravity?: number | string | number[] | string[];
		startPlug?: Plug;
		endPlug?: Plug;
		startPlugColor?: 'auto' | string;
		endPlugColor?: 'auto' | string;
	}
	export type Path = 'straight' | 'arc' | 'fluid' | 'magnet' | 'grid';
	export type SocketPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';
	type Plug = 'disc' | 'square' | 'arrow1' | 'arrow2' | 'arrow3' | 'hand' | 'crosshair' | 'behind';
}

export type CustomData = any;
export interface PanelConfig extends Object {
	injectionData: CustomData;
}

export interface PromoteEventObject {
	nodeConfig: Node.Config;
	wheelConfig: Node.Wheel;
}
