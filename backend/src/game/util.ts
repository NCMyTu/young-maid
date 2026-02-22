/** Shuffle `arr` in-place */
export const shuffleInPlace = <T>(arr: T[]): void => {
	// Fisher–Yates shuffle
	for (let i = arr.length - 1; i >= 1; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// Ughh Typescript bitching...
		[arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
	}
}