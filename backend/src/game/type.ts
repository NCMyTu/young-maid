type PlayerId = string;

type RoomId = string;

enum PlayerState {
	Idle = "idle",
	InQueue = "inQueue",
	InGame = "inGame"
}

export {
	type PlayerId,
	PlayerState,
	type RoomId
};