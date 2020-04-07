import { ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';
import { NodeComponent } from '../components/node/node.component';
import { CONST_DIRECTIONS } from './constants';

export namespace Node {

	export type Description = null | Record<string, string>;
	export type Titles = Record<string, string>;

	export interface Data {
		wheels?: Wheel[];
		lastNode?: boolean;
		index?: number;
		component?: any
	}

	export interface Wheel {
		icon?: string;
		descriptionPanel?: any;
		promoter?: boolean;
	}
	export interface Dimension {
		width: number,
		height: number
	}

	export interface PositionHistoryEntry extends Position {
		direction: CONST_DIRECTIONS
	}

	export interface Position {
		top: number;
		left: number;
	}

	export interface New {
		flow?: ViewContainerRef,
		component?: typeof NodeComponent,
		uniqueId?: string,
		inputBindings: {
			nodeData?: Node.Data,
			position?: Node.Position,
			dimension?: Node.Dimension,
			promoteEvtCbFn?: (...args) => void
		},
		outputBindings: {
			nodeAdded?: (...args) => void
		}
	}
}


type BindableProperty = {
	propName: string;
	templateName: string;
};
export interface NewComponentData {
	compRef: ComponentRef<unknown>;
	inputs: BindableProperty[];
	outputs: BindableProperty[];
}

export namespace Flow {
	export type Nodes = Node.Data[];
}

export namespace Connector {
	export interface DrawConnectorOptions {
		start?: HTMLElement,
		end?: HTMLElement,
		color?: string,
		size?: number,
		path?: 'straight' | 'arc' | 'fluid' | 'magnet' | 'grid',
		startSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto',
		endSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto',
		startSocketGravity?: number | string | number[] | string[],
		endSocketGravity?: number | string | number[] | string[],
		startPlug?: 'disc' | 'square' | 'arrow1' | 'arrow2' | 'arrow3' | 'hand' | 'crosshair' | 'behind',
		endPlug?: 'disc' | 'square' | 'arrow1' | 'arrow2' | 'arrow3' | 'hand' | 'crosshair' | 'behind',
		startPlugColor?: 'auto' | string
		endPlugColor?: 'auto' | string
	}
}