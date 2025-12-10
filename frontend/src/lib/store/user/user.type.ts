interface UserData {
	id: string,
	displayName: string,
	tagline: string,
	role: string
}

interface UserState extends UserData {
	set: (user: UserData) => void,
	clear: () => void
}

export type {
	UserState
};