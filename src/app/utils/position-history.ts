import { Coach } from './TypeDefs';

export class PositonHistory {
	entries: Array<Coach.PositionHistoryEntry> = [];
	maxLength: number = null;

	constructor(maxLength: number) {
		this.maxLength = maxLength || this.maxLength;
	}

	add(entry: Coach.PositionHistoryEntry) {
		return this.addEntries([entry]);
	}

	addEntries(entries: Array<Coach.PositionHistoryEntry>) {
		this.entries.push(...entries);
		if (this.entries.length > this.maxLength) {
			this.entries = this.entries.slice(-this.maxLength, this.entries.length);
		}
		return this.entries;
	}

	get length() {
		return this.entries.length;
	}

	get(index: number) {
		return this.entries[index];
	}

	pop() {
		return this.entries.pop();
	}

	clear() {
		this.entries = [];
	}
}