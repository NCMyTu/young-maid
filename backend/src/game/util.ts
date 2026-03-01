import type { Card, PlayerId } from "./type.js";

/** Shuffle `arr` in-place */
export const shuffleInPlace = <T>(arr: T[]): void => {
	// Fisher–Yates shuffle
	for (let i = arr.length - 1; i >= 1; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// Ughh Typescript bitching...
		[arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
	}
};

export const isPlayerId = (x: unknown): x is PlayerId => typeof x === "string";
export const isCard = (x: unknown): x is Card =>
	typeof x === "number"
	&& Number.isInteger(x)
	&& x >= 1
	&& x <= 13;