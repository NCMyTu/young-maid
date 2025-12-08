import { create } from "zustand";
import type { Screen, ScreenStackState } from "./screen-stack.type";

const DEFAULT_SCREEN: Screen = "home";

const useScreenStack = create<ScreenStackState>((set, get) => {
	const getTopScreen = (): Screen => {
		const { stack } = get();
		return stack.length > 0 ? stack.at(-1)! : DEFAULT_SCREEN;
	};

	return {
		stack: [],
			
		push: (screen: Screen): void =>
			set(
				(state) => ({ stack: [...state.stack, screen] })
			),

		pop: (): void => {
			set((state) => {
				const newStack = [...state.stack];
				newStack.pop();
				return { stack: newStack };
			})
		},

		top: (): Screen => getTopScreen(),

		current: (): Screen => getTopScreen(),
		
		reset: (): void => set(() => ({ stack: [] })),
	};
});

export default useScreenStack;