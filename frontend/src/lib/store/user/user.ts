import { create } from "zustand";
import type { UserState } from "./user.type";

const DEFAULT_ID = "";
const DEFAULT_DISPLAY_NAME = "Guest";
const DEFAULT_TAGLINE = "GUEST";
const DEFAULT_ROLE = "user";

const useUser = create<UserState>()((set) => ({
	id: DEFAULT_ID,
	displayName: DEFAULT_DISPLAY_NAME,
	tagline: DEFAULT_TAGLINE,
	role: DEFAULT_ROLE,

	set: ({ id, displayName, tagline, role }): void =>
		set(() =>
		({
			id: id,
			displayName: displayName,
			tagline: tagline,
			role: role
		})),
}));

export default useUser;