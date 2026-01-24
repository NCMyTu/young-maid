import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserState } from "./user.type";

const DEFAULT_ID = "";
const DEFAULT_DISPLAY_NAME = "Guest";
const DEFAULT_TAGLINE = "GUEST";
const DEFAULT_ROLE = "";
const DEFAULT_GOLD = 0;
const DEFAULT_GEM = 0;

const useUser = create<UserState>()(
	persist(
		(set) => ({
			id: DEFAULT_ID,
			displayName: DEFAULT_DISPLAY_NAME,
			tagLine: DEFAULT_TAGLINE,
			role: DEFAULT_ROLE,
			gold: DEFAULT_GOLD,
			gem: DEFAULT_GEM,

			setUser: (user) => set(() => ({ ...user })),

			clear: () =>
				set({
					id: DEFAULT_ID,
					displayName: DEFAULT_DISPLAY_NAME,
					tagLine: DEFAULT_TAGLINE,
					role: DEFAULT_ROLE,
					gold: DEFAULT_GOLD,
					gem: DEFAULT_GEM
				}),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);

export default useUser;