import { Node } from "./TypeDefs";

export class PositonHistory {
	entries: Array<Node.PositionHistoryEntry> = [];
	maxLength: number = null;

	constructor(maxLength: number) {
		this.maxLength = maxLength || this.maxLength;
	}

	push(newEntries: Node.PositionHistoryEntry | Node.PositionHistoryEntry[]) {
		let entries = [];
		if (!Array.isArray(newEntries)) {
			entries = [newEntries];
		}
		this.entries.push(...entries);
		if (this.entries.length > this.maxLength) {
			this.entries = this.entries.slice(
				-this.maxLength,
				this.entries.length
			);
		}
		return this.entries;
	}

	get length() {
		return this.entries.length;
	}

	get(index: number) {
		return this.entries[index];
	}

	get recent() {
		return this.get(this.length - 1);
	}

	pop() {
		return this.entries.pop();
	}

	clear() {
		this.entries = [];
	}
}
