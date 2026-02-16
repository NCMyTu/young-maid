type Screen = "home" | "shop" | "inventory" | "admin";

interface ScreenStackState {
	stack: Screen[];

	push: (screen: Screen) => void,
	pop: () => void;
	top: () => Screen;
	current: () => Screen;
	clear: () => void
}

export type {
	Screen,
	ScreenStackState
};