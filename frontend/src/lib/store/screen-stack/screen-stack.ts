import { create } from "zustand";
import type { Screen, ScreenStackState } from "./screen-stack.type";

const DEFAULT_SCREEN: Screen = "home";

const useScreenStack = create<ScreenStackState>()((set, get) => ({
	stack: [DEFAULT_SCREEN],

	push: (screen: Screen): void =>
		set((state) =>
			({ stack: [...state.stack, screen] })
	),

	pop: (): void =>
		set((state) => {
			if (state.stack.length <= 1)
				return state;
			return { stack: state.stack.slice(0, -1) };
		}
	),

	top: (): Screen => {
		const { stack } = get();
		return stack.length > 0 ? stack.at(-1)! : DEFAULT_SCREEN;
	},

	current: (): Screen => get().top(),

	clear: (): void => set(() => ({ stack: [DEFAULT_SCREEN] })),
}));

export default useScreenStack;