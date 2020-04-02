import { ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';
import { NodeComponent } from '../components/node/node.component';
import { from_direction_track } from './constants';

export namespace Node {

	export type Description = null | Record<string, string>;
	export type Titles = Record<string, string>;

	export interface Data {
		titles?: Titles;
		description?: Description;
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
		direction: from_direction_track
	}

	export interface Position {
		top: number;
		left: number;
	}

	export interface New {
		flow: ViewContainerRef,
		component: typeof NodeComponent,
		uniqueId: string,
		inputBindings: {
			nodeData: Node.Data,
			position: Node.Position,
			dimension: Node.Dimension,
			promoteEvtCbFn: (...args) => void
		},
		outputBindings: {
			nodeAdded: (...args) => void
		}
	}
}


type BindableProperty = {
	propName: string;
	templateName: string;
};
export interface LoadedComponentData {
	compRef: ComponentRef<unknown>;
	inputs: BindableProperty[];
	outputs: BindableProperty[];
}

export namespace Flow {
	export type Nodes = Node.Data[];
}
