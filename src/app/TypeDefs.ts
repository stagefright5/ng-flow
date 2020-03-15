import { ComponentType } from '@angular/cdk/portal';

export namespace Coach {

	export type Description = null | Record<string, string>;
	export type Titles = Record<string, string>;

	export interface Data {
		titles?: Titles;
		description?: Description;
		wheels?: Array<Wheel>;
		lastCoach?: boolean;
	}

	export interface Wheel {
		icon?: string;
		descriptionPanel?: ComponentType<unknown>;
		promoter?: boolean;
	}

}

export namespace Train {
	export type Caoches = Array<Coach.Data>;
}