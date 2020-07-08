export class History {
	entries: any[] = [];
	maxLength: number = null;

	constructor(maxLength: number) {
		this.maxLength = maxLength || this.maxLength;
	}

	push<T>(newEntries: T | T[]): T[] {
		let entries = [];
		if (!Array.isArray(newEntries)) {
			entries = [newEntries];
		}
		this.entries.push(...entries);
		if (this.entries.length > this.maxLength) {
			this.entries = this.entries.slice(-this.maxLength, this.entries.length);
		}
		return this.entries;
	}

	get length() {
		return this.entries.length;
	}

	get<T>(index: number): T {
		return this.entries[index];
	}

	get latest() {
		return this.get(this.length - 1);
	}

	pop<T>(): T {
		return this.entries.pop();
	}

	clear() {
		this.entries = [];
	}
}
