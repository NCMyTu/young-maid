import { create } from "zustand";
import type { UserState } from "./user.type";

const DEFAULT_ID = "";
const DEFAULT_DISPLAY_NAME = "Guest";
const DEFAULT_TAGLINE = "GUEST";
const DEFAULT_ROLE = "";

const useUser = create<UserState>()((set) => ({
	id: DEFAULT_ID,
	displayName: DEFAULT_DISPLAY_NAME,
	tagline: DEFAULT_TAGLINE,
	role: DEFAULT_ROLE,

	set: (user) => set(() => ({ ...user })),

	clear: (): void =>
		set(() =>
		({
			id: DEFAULT_ID,
			displayName: DEFAULT_DISPLAY_NAME,
			tagline: DEFAULT_TAGLINE,
			role: DEFAULT_ROLE,
	})),
}));

export default useUser;