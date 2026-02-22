import { v7 as uuid_v7 } from "uuid";

import PlayerQueue from "./core/queue.js";
import GameRoom from "./core/room.js";
import { type PlayerId, PlayerState, type RoomId } from "./type.js";

const N_PLAYERS_PER_ROOM = 2;

export default class Maestro {
	queue: PlayerQueue;
	rooms: Map<RoomId, GameRoom>;
	playerToRoom: Map<PlayerId, RoomId>;

	constructor() {
		this.queue = new PlayerQueue();
		this.rooms = new Map<RoomId, GameRoom>();
		this.playerToRoom = new Map<PlayerId, RoomId>();
	}

	getQueueSize(): number {
		return this.queue.size;
	}

	getPlayerState(playerId: PlayerId): PlayerState {
		if (this.queue.has(playerId))
			return PlayerState.InQueue;
		else if (this.playerToRoom.has(playerId))
			return PlayerState.InGame;
		else
			return PlayerState.Idle;
	}

	removePlayerFromQueue(playerId: PlayerId): boolean {
		return this.queue.remove(playerId);
	}

	/** Return true if player successfully interact with the queue
	 * (either join or leave the queue), false otherwise.
	 */
	handlePlayerInteractWithQueue(playerId: PlayerId): boolean {
		if (this.getPlayerState(playerId) === PlayerState.InGame)
			return false;

		if (this.queue.has(playerId))
			this.queue.remove(playerId);
		else
			this.queue.add(playerId);
		return true;
	}

	makeMatch(): { roomId: RoomId, players: PlayerId[] } | undefined {
		const players: PlayerId[] = this.queue.getRandomPlayers(N_PLAYERS_PER_ROOM);
		if (players.length < N_PLAYERS_PER_ROOM)
			return;

		let roomId = uuid_v7();
		while (this.rooms.has(roomId))
			roomId = uuid_v7();

		const room = new GameRoom(roomId, players);

		this.rooms.set(roomId, room);
		players.forEach(playerId => {
			this.queue.remove(playerId);
			this.playerToRoom.set(playerId, roomId);
		});

		return { roomId, players };
	}
}