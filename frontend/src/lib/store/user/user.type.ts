interface UserData {
	id: string;
	displayName: string;
	tagLine: string;
	role: string;
	gold: number;
	gem: number
}

interface UserState extends UserData {
	setUser: (user: UserData) => void;
	clear: () => void
}

export type {
	UserState
};