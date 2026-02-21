class PlayerQueue {
	queue: Set<string>;

	constructor() {
		this.queue = new Set();
	}

	get size(): number {
		return this.queue.size;
	}

	has(playerId: string): boolean {
		return this.queue.has(playerId);
	}

	add(playerId: string): number {
		this.queue.add(playerId);
		return this.queue.size;
	}

	remove(playerId: string): void {
		this.queue.delete(playerId);
	}
}

export default PlayerQueue;