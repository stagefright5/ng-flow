import { Component } from '@angular/core';

export namespace Coach {

	type Description = Record<string, string>;
	type Titles = Array<Record<string, string>>;

	export interface CoachData {
		titles: Titles;
		description: Description;
	}

	export interface Wheel {
		icon: string;
		descriptionPanel: Component;
	}

	export type promoteEvent = 'promoted';
}

export namespace Train {
	export type Caoches = Array<Coach.CoachData>;
}