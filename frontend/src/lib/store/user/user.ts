import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserData, UserState } from "./user.type";
import { API_BASE_URL } from "@/config/endpoints";

const DEFAULT_ID = "";
const DEFAULT_DISPLAY_NAME = "Guest";
const DEFAULT_TAGLINE = "GUEST";
const DEFAULT_ROLE = "";
const DEFAULT_AVATAR = `${API_BASE_URL}/upload/avatar/default.png`;
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
			avatar: DEFAULT_AVATAR,

			setUser: (user: Partial<UserData>) => set(() => ({
				...user,
				avatar: `${API_BASE_URL}/${user.avatar}`
			})),

			clear: () =>
				set({
					id: DEFAULT_ID,
					displayName: DEFAULT_DISPLAY_NAME,
					tagLine: DEFAULT_TAGLINE,
					role: DEFAULT_ROLE,
					avatar: DEFAULT_AVATAR,
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