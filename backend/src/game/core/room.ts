import type { PlayerId, RoomId } from "@/game/type.js";

export default class GameRoom {
	id: RoomId;
	players: PlayerId[];

	constructor(id: string, players: PlayerId[]) {
		this.id = id;
		this.players = players;
	}
}