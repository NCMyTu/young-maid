type Screen = "home" | "shop";

interface ScreenStackState {
	stack: Screen[],
	push: (screen: Screen) => void,
	pop: () => void,
	top: () => Screen,
	current: () => Screen,
	reset: () => void
}

export type {
	Screen,
	ScreenStackState
};