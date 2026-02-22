import type { PlayerId } from "@/game/type.js";
import { shuffleInPlace } from "@/game/util.js";

export default class PlayerQueue {
	queue: Set<PlayerId>;

	constructor() {
		this.queue = new Set();
	}

	get size(): number {
		return this.queue.size;
	}

	has(playerId: PlayerId): boolean {
		return this.queue.has(playerId);
	}

	/** Returns queue size after adding player. */
	add(playerId: PlayerId): number {
		this.queue.add(playerId);
		return this.size;
	}

	/** Returns true if `playerId` has been removed, otherwise false. */
	remove(playerId: PlayerId): boolean {
		return this.queue.delete(playerId)
	}

	/** Return an array of `PlayerId`,
	 * return an empty array if somehow fails.
	 */
	getRandomPlayers(n: number): PlayerId[] {
		// TODO: this doesn't account for how long player will have to wait in queue.

		if (n <= 0 || n > this.size)
			return [];

		const sampleFrom: PlayerId[] = Array.from(this.queue);

		// To avoid a full shuffling or i'm just overengineering.
		if (n === 1) {
			const index = Math.floor(Math.random() * this.size);
			const selected: PlayerId = sampleFrom[index]!;

			this.queue.delete(selected);
			return [selected];
		}

		shuffleInPlace(sampleFrom);

		const selected: PlayerId[] = sampleFrom.slice(0, n);

		selected.forEach(playerId => this.queue.delete(playerId));

		return selected;
	}
}