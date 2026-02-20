interface UserData {
	id: string;
	displayName: string;
	tagLine: string;
	role: string;
	avatar: string;
	gold: number;
	gem: number
}

interface UserState extends UserData {
	setUser: (user: Partial<UserData>) => void;
	clear: () => void
}

export type {
	UserData,
	UserState
};