type PlayerId = string;

type PlayerInfo = {
	id: PlayerId;
	displayName: string;
	tagLine: string;
	avatar: string
};

interface PlayerInfoState {
	isSet: boolean;
	info: PlayerInfo[];

	setPlayerInfo: (info: PlayerInfo[]) => void;
	clear: () => void
}

export type {
	PlayerInfo,
	PlayerInfoState
};