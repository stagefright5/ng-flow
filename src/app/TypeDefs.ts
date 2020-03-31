import { ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';
import { CoachComponent } from './coach/coach.component';
import { Directive } from '@angular/core';

export namespace Coach {

	export type Description = null | Record<string, string>;
	export type Titles = Record<string, string>;

	export interface Data {
		titles?: Titles;
		description?: Description;
		wheels?: Wheel[];
		lastCoach?: boolean;
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

	export interface Position {
		top: number;
		left: number;
	}

	export interface New {
		train: ViewContainerRef,
		component: typeof CoachComponent,
		uniqueId: string,
		inputBindings: {
			coachData: Coach.Data,
			position: Coach.Position,
			dimension: Coach.Dimension,
			promoteEvtCbFn: (...args) => void
		},
		outputBindings: {
			coachAdded: (...args) => void
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

export namespace Train {
	export type Caoches = Coach.Data[];
}
