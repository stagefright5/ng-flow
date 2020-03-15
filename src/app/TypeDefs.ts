export namespace Coach {
	export interface CoachData {
		titles: Titles;
		description: Description;
	}

	export interface Wheel {
		icon: string;
		descriptionPanel: ComponentClass;
	}

	export type promoteEvent = 'promoted';
}

export namespace Train {
	export type Caoches = Array<Coach.CoachData>;
}